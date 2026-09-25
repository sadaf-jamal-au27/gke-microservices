#!/usr/bin/env bash
set -euo pipefail

ENV="${1:?Usage: tf.sh <dev|qa|test|prod> <stack> <init|plan|apply|destroy|output>}"
STACK="${2:?stack: project_services|cloud_storage|github_wif|network|gke|cloudsql|pubsub|cloudrun}"
ACTION="${3:-plan}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="${ROOT}/terraform/live/${ENV}/${STACK}"
ENV_TFVARS="${ROOT}/terraform/live/${ENV}/env.tfvars"
STACK_TFVARS="${DIR}/${STACK}.tfvars"

if [[ ! -d "${DIR}" ]]; then
  echo "Missing stack: ${DIR}. Run: node infra/scripts/generate-tf-live.mjs"
  exit 1
fi

PROJECT_ID="$(grep '^project_id' "${ENV_TFVARS}" | head -1 | cut -d'"' -f2)"
if [[ -z "${PROJECT_ID}" ]]; then
  echo "Could not read project_id from ${ENV_TFVARS}"
  exit 1
fi
STATE_BUCKET="${PROJECT_ID}-retail-tfstate-${ENV}"
PREFIX="${ENV}/${STACK}"

cd "${DIR}"

if [[ ! -d .terraform ]] || [[ "${ACTION}" == "init" ]]; then
  terraform init -reconfigure \
    -backend-config="bucket=${STATE_BUCKET}" \
    -backend-config="prefix=${PREFIX}"
fi

if [[ "${ACTION}" == "init" ]]; then
  exit 0
fi

VAR_ARGS=(-var-file="${ENV_TFVARS}")
if [[ -f "${STACK_TFVARS}" ]]; then
  VAR_ARGS+=(-var-file="${STACK_TFVARS}")
fi

case "${ACTION}" in
  plan|apply|destroy|refresh)
    extra=(-input=false)
    if [[ "${ACTION}" == "apply" || "${ACTION}" == "destroy" ]]; then
      extra+=(-auto-approve)
    fi
    terraform "${ACTION}" "${VAR_ARGS[@]}" "${extra[@]}"
    ;;
  output|validate|fmt)
    terraform "${ACTION}" "$@"
    ;;
  *)
    terraform "${ACTION}" "${VAR_ARGS[@]}"
    ;;
esac
