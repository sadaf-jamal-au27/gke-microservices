#!/usr/bin/env bash
set -euo pipefail

ENV="${1:?Usage: tg.sh <dev|qa|test|prod> <stack> <init|plan|apply|destroy|output>}"
STACK="${2:?stack name, e.g. network}"
ACTION="${3:-plan}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIR="${ROOT}/terragrunt/environments/${ENV}/${STACK}"
CFG="${DIR}/${STACK}.hcl"

if [[ ! -f "${CFG}" ]]; then
  echo "Not found: ${CFG}"
  exit 1
fi

cd "${DIR}"
terragrunt "${ACTION}" --non-interactive
