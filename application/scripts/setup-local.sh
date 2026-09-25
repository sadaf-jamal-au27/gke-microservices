#!/usr/bin/env bash
# One-time / repeat: Postgres + SQL migrations for local dev
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

export DB_HOST="${DB_HOST:-127.0.0.1}"
export DB_PORT="${DB_PORT:-5432}"
export DB_USER="${DB_USER:-retail_app}"
export DB_PASSWORD="${DB_PASSWORD:-retail}"
export DB_NAME="${DB_NAME:-retail}"

echo "→ Docker Postgres"
if ! docker info >/dev/null 2>&1; then
  echo ""
  echo "ERROR: Docker is not running."
  echo "  1. Open Docker Desktop and wait until it is ready"
  echo "  2. Run again: ./scripts/setup-local.sh"
  echo ""
  exit 1
fi
docker compose up -d postgres

echo "→ Waiting for Postgres…"
for i in {1..40}; do
  if docker exec retail-postgres pg_isready -U retail_app -d retail >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "→ Migrations"
docker exec -i retail-postgres psql -U retail_app -d retail -v ON_ERROR_STOP=1 < "$ROOT/devops/db/migrations/001_core.sql" 2>/dev/null || true
docker exec -i retail-postgres psql -U retail_app -d retail -v ON_ERROR_STOP=1 < "$ROOT/devops/db/migrations/002_automobile.sql"

echo "→ Build shared packages"
corepack enable 2>/dev/null || true
pnpm install
pnpm --filter @retail/automobile-db build
pnpm --filter @retail/service-core build

echo ""
echo "Setup OK. Run:  pnpm dev"
