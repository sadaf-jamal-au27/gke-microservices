#!/usr/bin/env bash
# Free local dev ports (previous pnpm dev / background agents).
set -euo pipefail

PORTS=(3090 3101 3102 3103 3104 3105 3106 3107 3108 3109 3110 5173 5174)

killed=0
for port in "${PORTS[@]}"; do
  pids=$(lsof -ti tcp:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "${pids}" ]]; then
    echo "Stopping port ${port}: ${pids}"
    kill ${pids} 2>/dev/null || true
    killed=1
  fi
done

# concurrently parent sometimes survives
pkill -f "concurrently.*catalog,dealer" 2>/dev/null || true
pkill -f "tsx watch src/index.ts" 2>/dev/null || true

if [[ "${killed}" -eq 1 ]]; then
  sleep 1
  echo "Ports cleared."
else
  echo "No dev listeners found on standard ports."
fi
