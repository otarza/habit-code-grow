#!/usr/bin/env bash
# Daily Postgres dump for listmonk. Run via cron from the host.
# Example cron (3am UTC): 0 3 * * * /opt/listmonk/backup.sh >> /var/log/listmonk-backup.log 2>&1

set -euo pipefail

COMPOSE_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${COMPOSE_DIR}/backups"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="${BACKUP_DIR}/listmonk-${TS}.sql.gz"

mkdir -p "${BACKUP_DIR}"

cd "${COMPOSE_DIR}"
docker compose exec -T db pg_dump -U listmonk -d listmonk --no-owner --clean --if-exists \
	| gzip -9 > "${OUT}"

find "${BACKUP_DIR}" -name 'listmonk-*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete

echo "[$(date -u +%FT%TZ)] backup ok: ${OUT} ($(du -h "${OUT}" | cut -f1))"

# Optional offsite shipping — uncomment and configure one:
# aws s3 cp "${OUT}" "s3://your-bucket/listmonk/$(basename "${OUT}")"
# rclone copy "${OUT}" remote:listmonk-backups/
