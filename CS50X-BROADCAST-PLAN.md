# CS50x Live Invite Broadcast Plan

## Goal

Send a warm, short Georgian invitation to everyone who pre-registered for the free CS50x Georgian public lecture series, with the scheduled YouTube Live link.

## Files

- `email-templates/cs50x-live-invite.html` - HTML email template.
- `email-templates/cs50x-live-invite.txt` - plain-text fallback.
- `scripts/send-cs50x-live-broadcast.js` - CSV-driven Postmark broadcast CLI.

## CSV Format

Preferred:

```csv
email,name
student@example.com,ნინო
friend@example.com,
```

Headerless CSV is also accepted. The first column is treated as email and the second column as optional name.

## Dry Run

```bash
node scripts/send-cs50x-live-broadcast.js \
  --csv ./pre-registered.csv \
  --youtube-url "https://www.youtube.com/watch?v=YOUR_LIVE_ID"
```

The dry run validates emails, removes duplicates, prints invalid rows, shows the first recipients, and previews the rendered text.

## Send

```bash
POSTMARK_TOKEN="YOUR_POSTMARK_SERVER_TOKEN" node scripts/send-cs50x-live-broadcast.js \
  --csv ./pre-registered.csv \
  --youtube-url "https://www.youtube.com/watch?v=YOUR_LIVE_ID" \
  --send
```

Optional controls:

```bash
--starts-at "4 ივლისს, შაბათს, 10:00-ზე"
--subject "ხვალ 10:00-ზე ვიწყებთ CS50x-ს ქართულად"
--stream cs50x-georgia
--batch-size 100
--delay-ms 1000
--limit 25
--offset 0
--direct-links
```

## Recommended Send Sequence

1. Export pre-registered contacts to CSV.
2. Run the dry run and check invalid rows.
3. Send a small live test to yourself with `--limit 1 --send`.
4. Verify the email in inbox and Postmark Activity.
5. Send the full CSV with `--send`.
6. Monitor Postmark Activity for bounces or delivery issues.
7. Do not save Postmark tokens in repo files, docs, CSVs, or shell scripts.
