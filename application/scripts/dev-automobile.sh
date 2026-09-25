#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

export DB_HOST="${DB_HOST:-127.0.0.1}"
export DB_PORT="${DB_PORT:-5432}"
export DB_USER="${DB_USER:-retail_app}"
export DB_PASSWORD="${DB_PASSWORD:-retail}"
export DB_NAME="${DB_NAME:-retail}"
export DB_SSL="${DB_SSL:-false}"

if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable && corepack prepare pnpm@9.15.4 --activate
fi

echo "Starting PostgreSQL (Docker)…"
docker compose up -d postgres

if command -v psql >/dev/null 2>&1; then
  chmod +x application/scripts/db-migrate.sh
  ./application/scripts/db-migrate.sh
else
  echo "Install psql (brew install libpq) then run: ./application/scripts/db-migrate.sh"
fi

pnpm install
pnpm --filter @retail/automobile-db build
pnpm --filter @retail/service-core build

PIDS=()
cleanup() { for pid in "${PIDS[@]}"; do kill "$pid" 2>/dev/null || true; done; }
trap cleanup EXIT INT TERM

run_svc() {
  PORT="$2" DB_HOST="$DB_HOST" DB_PORT="$DB_PORT" DB_USER="$DB_USER" DB_PASSWORD="$DB_PASSWORD" DB_NAME="$DB_NAME" DB_SSL="$DB_SSL" \
    pnpm --filter "@retail/$1" dev >/tmp/"$1".log 2>&1 &
  PIDS+=($!)
  echo "▶ $1 :$2 (PostgreSQL)"
}

for s in vehicle-catalog-service:3101 dealership-service:3102 vehicle-inventory-service:3103 auto-pricing-service:3104 \
  test-drive-service:3105 auto-cart-service:3106 auto-order-service:3107 auto-finance-service:3108 \
  service-appointment-service:3109 trade-in-service:3110; do
  name="${s%%:*}"
  port="${s##*:}"
  run_svc "$name" "$port"
done

sleep 3
PORT=3090 DB_HOST="$DB_HOST" DB_PORT="$DB_PORT" DB_USER="$DB_USER" DB_PASSWORD="$DB_PASSWORD" DB_NAME="$DB_NAME" \
  pnpm --filter @retail/bff-api-service dev >/tmp/bff.log 2>&1 &
PIDS+=($!)
echo "▶ bff-api-service :3090"

echo ""
echo "AutoDrive storefront → http://localhost:5173"
echo "Data persists in PostgreSQL (docker volume retail_pg_data)"
echo ""

pnpm --filter @retail/storefront dev
