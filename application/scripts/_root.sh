#!/usr/bin/env bash
# Fix repo-root paths from application/scripts/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"
exec "$@"
