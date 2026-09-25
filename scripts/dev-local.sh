#!/usr/bin/env bash
# Developer local stack — run from repo root after: ./scripts/setup-local.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

"$ROOT/scripts/dev-stop.sh"

export DB_HOST="${DB_HOST:-127.0.0.1}"
export DB_PORT="${DB_PORT:-5432}"
export DB_USER="${DB_USER:-retail_app}"
export DB_PASSWORD="${DB_PASSWORD:-retail}"
export DB_NAME="${DB_NAME:-retail}"
export DB_SSL="${DB_SSL:-false}"

if ! docker exec retail-postgres pg_isready -U retail_app -d retail >/dev/null 2>&1; then
  echo "Postgres not ready — running setup-local.sh…"
  "$ROOT/scripts/setup-local.sh"
fi

exec pnpm exec concurrently --kill-others-on-fail -c auto \
  -n catalog,dealer,stock,price,drive,cart,order,finance,service,trade,bff,ui \
  "PORT=3101 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/vehicle-catalog-service dev" \
  "PORT=3102 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/dealership-service dev" \
  "PORT=3103 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/vehicle-inventory-service dev" \
  "PORT=3104 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/auto-pricing-service dev" \
  "PORT=3105 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/test-drive-service dev" \
  "PORT=3106 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/auto-cart-service dev" \
  "PORT=3107 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/auto-order-service dev" \
  "PORT=3108 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/auto-finance-service dev" \
  "PORT=3109 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/service-appointment-service dev" \
  "PORT=3110 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/trade-in-service dev" \
  "PORT=3090 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_USER=$DB_USER DB_PASSWORD=$DB_PASSWORD DB_NAME=$DB_NAME DB_SSL=$DB_SSL pnpm --filter @retail/bff-api-service dev" \
  "pnpm --filter @retail/storefront dev"
