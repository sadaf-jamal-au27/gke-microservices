#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID}"
REGION="${REGION:-asia-south1}"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/retail"

gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

pnpm install
pnpm --filter @retail/service-core build

for dir in application/services/*/; do
  name="$(basename "$dir")"
  echo "Building ${name}..."
  docker build -f "application/services/${name}/Dockerfile" -t "${REGISTRY}/${name}:1.0.0" .
  docker push "${REGISTRY}/${name}:1.0.0"
done

echo "All service images pushed to ${REGISTRY}"
