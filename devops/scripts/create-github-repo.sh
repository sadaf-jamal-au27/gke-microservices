#!/usr/bin/env bash
# Create github.com/sadaf-jamal-au27/gke-microservices and push.
set -euo pipefail

OWNER="sadaf-jamal-au27"
REPO="gke-microservices"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

cd "${ROOT}"

ACTIVE="$(gh api user --jq .login 2>/dev/null || true)"
if [[ "${ACTIVE}" != "${OWNER}" ]]; then
  echo "GitHub CLI must be logged in as '${OWNER}' (currently: '${ACTIVE:-none}')."
  echo "  gh auth logout -h github.com"
  echo "  gh auth login -h github.com"
  exit 1
fi

git remote set-url origin "https://github.com/${OWNER}/${REPO}.git"

if gh repo view "${OWNER}/${REPO}" >/dev/null 2>&1; then
  echo "Repo: https://github.com/${OWNER}/${REPO}"
else
  gh repo create "${OWNER}/${REPO}" \
    --public \
    --description "GKE retail microservices — Terraform, Helm, automobile demo"
fi

git push -u origin main

echo "Done: https://github.com/${OWNER}/${REPO}"
