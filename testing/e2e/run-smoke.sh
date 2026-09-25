#!/usr/bin/env bash
# End-to-end smoke: Postgres + migrations + build automobile stack + HTTP checks.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

export DB_HOST=127.0.0.1 DB_PORT=5432 DB_USER=retail_app DB_PASSWORD=retail DB_NAME=retail DB_SSL=false

echo "→ E2E: Postgres + migrations"
bash application/scripts/setup-local.sh

echo "→ E2E: install & build"
pnpm install --frozen-lockfile
pnpm --filter @retail/service-core build
pnpm --filter @retail/automobile-db build 2>/dev/null || true
pnpm --filter @retail/bff-api-service build
pnpm --filter @retail/vehicle-catalog-service build

echo "→ E2E: start catalog + BFF"
bash application/scripts/dev-stop.sh || true

PORT=3101 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL \
  pnpm --filter @retail/vehicle-catalog-service dev &
PID_CATALOG=$!
PORT=3090 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL \
  pnpm --filter @retail/bff-api-service dev &
PID_BFF=$!

cleanup() {
  kill $PID_CATALOG $PID_BFF 2>/dev/null || true
  bash application/scripts/dev-stop.sh || true
}
trap cleanup EXIT

wait_http() {
  local url=$1 max=${2:-60}
  for i in $(seq 1 "$max"); do
    if curl -sf "$url" >/dev/null; then return 0; fi
    sleep 1
  done
  echo "Timeout waiting for $url"
  return 1
}

wait_http "http://127.0.0.1:3101/health/live" 90
wait_http "http://127.0.0.1:3090/health/live" 90

echo "→ E2E: API assertions"
curl -sf "http://127.0.0.1:3101/v1/platform/stats" | grep -q 'vehiclesListed'
curl -sf "http://127.0.0.1:3090/v1/storefront/vehicles" | grep -q '\['

echo "E2E smoke passed."
