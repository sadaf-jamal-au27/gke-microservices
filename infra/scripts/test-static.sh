#!/usr/bin/env bash
# Local dev parity with CI static job (.github/actions/terraform-fast command=static).
# All static checks: fmt, validate, terraform test (no GCP).
set -euo pipefail

ENV="${1:-dev}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

"${SCRIPT_DIR}/test-unit.sh" "${ENV}"
"${SCRIPT_DIR}/test-integration.sh" "${ENV}"

echo "Static checks passed."
