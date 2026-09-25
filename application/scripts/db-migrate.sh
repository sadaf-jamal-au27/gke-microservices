#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
export PGPASSWORD="${DB_PASSWORD:-retail}"
HOST="${DB_HOST:-127.0.0.1}"
PORT="${DB_PORT:-5432}"
USER="${DB_USER:-retail_app}"
DB="${DB_NAME:-retail}"

wait_db() {
  for i in {1..30}; do
    if psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DB" -c 'SELECT 1' >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  echo "Postgres not ready at ${HOST}:${PORT}"
  exit 1
}

wait_db
for f in "$ROOT/devops/db/migrations/"*.sql; do
  echo "Applying $(basename "$f")"
  psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DB" -v ON_ERROR_STOP=1 -f "$f"
done
echo "Migrations complete."
