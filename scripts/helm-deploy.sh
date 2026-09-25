#!/usr/bin/env bash
set -euo pipefail

ENV="${1:?Usage: helm-deploy.sh <dev|qa|test|prod>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHART="${ROOT}/platform/helm/retail-platform"

VALUES_ENV="${CHART}/values-${ENV}.yaml"
if [[ ! -f "${VALUES_ENV}" ]]; then
  echo "Missing ${VALUES_ENV}"
  exit 1
fi

NAMESPACE="retail-${ENV}"

echo "Deploying Helm release retail-${ENV} into namespace ${NAMESPACE}"

helm upgrade --install "retail-${ENV}" "${CHART}" \
  --namespace "${NAMESPACE}" \
  --create-namespace \
  -f "${CHART}/values.yaml" \
  -f "${VALUES_ENV}" \
  -f "${CHART}/services.generated.yaml" \
  --wait \
  --timeout 20m

echo "Helm release retail-${ENV} deployed."

echo "Useful commands:"
echo "  helm -n ${NAMESPACE} status retail-${ENV}"
echo "  helm -n ${NAMESPACE} get values retail-${ENV}"
echo "  kubectl -n ${NAMESPACE} get pods"
echo "  kubectl -n ${NAMESPACE} get gateway,httproute"
