#!/usr/bin/env bash
set -euo pipefail

ENV="${1:?Usage: tg-apply-all.sh <dev|qa|test|prod> [plan|apply|destroy]}"
ACTION="${2:-plan}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="${ROOT}/terragrunt/environments/${ENV}"

STACKS=(
  project_services
  cloud_storage
  github_wif
  network
  gke
  cloudsql
  pubsub
  cloudrun
)

for stack in "${STACKS[@]}"; do
  DIR="${BASE}/${stack}"
  CFG="${DIR}/${stack}.hcl"
  if [[ ! -f "${CFG}" ]]; then
    echo "Missing ${CFG}"
    exit 1
  fi
  echo "==== ${ENV}/${stack}: terragrunt ${ACTION} ===="
  (cd "${DIR}" && terragrunt "${ACTION}" --non-interactive)
done

echo "Done: ${ENV} ${ACTION}"
