#!/usr/bin/env bash
# Lint + template Helm chart (no cluster required).
set -euo pipefail

ENV="${1:-dev}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CHART="${ROOT}/devops/helm/retail-platform"
VALUES="${CHART}/values-${ENV}.yaml"

[[ -f "${VALUES}" ]] || { echo "Missing ${VALUES}"; exit 1; }

helm lint "${CHART}" \
  -f "${CHART}/values.yaml" \
  -f "${VALUES}" \
  -f "${CHART}/services.generated.yaml"

helm template "retail-${ENV}-ci" "${CHART}" \
  -f "${CHART}/values.yaml" \
  -f "${VALUES}" \
  -f "${CHART}/services.generated.yaml" \
  >/dev/null

echo "DevOps Helm validation passed (${ENV})."
