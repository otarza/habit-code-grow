# Listmonk on Hetzner + Postmark

Self-hosted email campaigns for ~50K contacts. Stack: listmonk + Postgres + Caddy on a single Hetzner VPS, sending via Postmark broadcast streams.

## Files

| File | Purpose |
|---|---|
| `docker-compose.yml` | listmonk + Postgres + Caddy, tuned for 2 GB RAM |
| `Caddyfile` | TLS reverse proxy (auto-renews via Let's Encrypt) |
| `.env.example` | Template for secrets — copy to `.env` on the server |
| `backup.sh` | Daily Postgres dump with 14-day retention |

## 1. Provision the server

Hetzner Cloud → New Server:

- Image: **Ubuntu 24.04**
- Type: **CPX11** (2 vCPU, 2 GB RAM, 40 GB SSD) — `~€4.5/mo`
- Location: closest to your audience (FSN/NBG/HEL for EU, ASH/HIL for US)
- SSH key: add yours
- Firewall: allow `22`, `80`, `443` inbound

## 2. One-time server setup

SSH in as root, then:

```bash
# Create a non-root user
adduser deploy && usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
# Disable root SSH + password auth in /etc/ssh/sshd_config, then: systemctl restart ssh

# Install Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy

# Basic firewall
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable

# Unattended security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

Switch to `deploy` for the rest.

## 3. Deploy listmonk

```bash
sudo mkdir -p /opt/listmonk && sudo chown deploy:deploy /opt/listmonk
cd /opt/listmonk

# Copy these files up (from your laptop):
#   scp infra/listmonk/{docker-compose.yml,Caddyfile,.env.example,backup.sh} deploy@SERVER:/opt/listmonk/

cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD to: openssl rand -base64 32
nano .env

# Edit Caddyfile — replace news.example.com with your real hostname
nano Caddyfile
```

Point DNS first (so Caddy can fetch a cert):

```
A   news.yourdomain.com   ->  <hetzner-server-ip>
```

Wait for DNS propagation (`dig +short news.yourdomain.com`), then bring it up:

```bash
docker compose up -d
docker compose logs -f listmonk
```

First-run logs should show migrations applied, then `Listening on http://0.0.0.0:9000`.

## 4. Initial admin setup

Open `https://news.yourdomain.com` — Caddy auto-fetches a Let's Encrypt cert on first request. Create the admin user when prompted.

## 5. Wire up Postmark

In Postmark:
1. **Servers → New Server** → pick "Broadcast" intent
2. **Sender Signatures** → add and verify your sending domain (adds SPF/DKIM records — put them in DNS)
3. **Message Streams** → note the broadcast stream ID (often just `broadcast`)
4. **API Tokens** → copy the server token

In listmonk (**Settings → SMTP**):

| Field | Value |
|---|---|
| Host | `smtp.postmarkapp.com` |
| Port | `587` |
| Auth protocol | `LOGIN` |
| Username | *your Postmark server token* |
| Password | *same server token* |
| TLS | `STARTTLS` |
| Max connections | `10` |
| Retries | `2` |
| Custom headers | `X-PM-Message-Stream: broadcast` |

Send a test from listmonk to confirm.

## 6. Bounce + complaint webhooks (do not skip)

In **listmonk → Settings → Bounces**:
- Enable bounce processing
- Set a webhook key (generate: `openssl rand -hex 16`) — save it
- Enable the Postmark webhook source

In **Postmark → Servers → your server → Webhooks → Add webhook**:
- URL: `https://news.yourdomain.com/webhooks/bounce?source=postmark&key=YOUR_KEY`
- Subscribe to: **Bounce**, **Spam Complaint**, **Subscription Change**

Without this, hard bounces stay subscribed → your Postmark reputation score drops → cost goes up.

## 7. DNS checklist

For the sending domain (e.g. `yourdomain.com`):

| Record | Why |
|---|---|
| SPF (`v=spf1 include:spf.mtasv.net ~all`) | Postmark publishes the include |
| DKIM (Postmark provides) | Required for authentication |
| Return-Path CNAME (Postmark provides) | Aligns SPF, improves deliverability |
| DMARC (`v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com`) | Start at `p=none`, tighten later |

For the app hostname (`news.yourdomain.com`):

| Record | Why |
|---|---|
| A → server IP | App access + TLS issuance |

## 8. Backups

```bash
# Test once manually
/opt/listmonk/backup.sh

# Install daily cron (3am UTC)
( crontab -l 2>/dev/null; echo "0 3 * * * /opt/listmonk/backup.sh >> /var/log/listmonk-backup.log 2>&1" ) | crontab -
```

Uncomment the S3/rclone line in `backup.sh` to ship dumps offsite. **Local-only backups don't survive a disk failure** — set up offsite before the first real campaign.

## 9. Day-2 operations

```bash
# Update listmonk to latest
cd /opt/listmonk
docker compose pull
docker compose up -d
docker compose logs -f listmonk

# Check Postgres size
docker compose exec db psql -U listmonk -c "SELECT pg_size_pretty(pg_database_size('listmonk'));"

# Trim old analytics rows (run monthly if needed)
docker compose exec db psql -U listmonk -c "DELETE FROM campaign_views WHERE created_at < NOW() - INTERVAL '90 days';"
docker compose exec db psql -U listmonk -c "DELETE FROM link_clicks  WHERE created_at < NOW() - INTERVAL '90 days';"
docker compose exec db psql -U listmonk -c "VACUUM ANALYZE;"
```

## 10. Capacity at this size

| Metric | Expected |
|---|---|
| Subscribers | 50K → ~50 MB in `subscribers` table |
| Send rate | ~10 SMTP conns × Postmark throughput = comfortably >50K/hr |
| RAM at idle | ~400 MB (Postgres + listmonk) |
| RAM during campaign | ~1.2 GB peak |
| Disk growth | ~1–2 GB/year with 90-day analytics retention |

The CPX11 has headroom. If you cross ~250K subscribers or send >1M/month, bump to **CPX21** (3 vCPU, 4 GB) — same compose file, no migration.

## 11. Things to add later (not for launch)

- Offsite backup target (S3/B2/rclone)
- Uptime monitoring (BetterStack / Healthchecks.io ping in `backup.sh`)
- Fail2ban on SSH
- Move Postgres to a separate volume snapshot schedule once the list grows past 100K
