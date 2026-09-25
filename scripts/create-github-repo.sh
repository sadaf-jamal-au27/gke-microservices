#!/usr/bin/env bash
# Create github.com/sadaf-jamal-au27/gke-microservices and push (run while logged in as that user).
set -euo pipefail

OWNER="sadaf-jamal-au27"
REPO="gke-microservices"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "${ROOT}"

ACTIVE="$(gh api user --jq .login)"
if [[ "${ACTIVE}" != "${OWNER}" ]]; then
  echo "GitHub CLI is logged in as '${ACTIVE}', not '${OWNER}'."
  echo "Run:  gh auth login -h github.com"
  echo "Then sign in as ${OWNER} and run this script again."
  exit 1
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin already set: $(git remote get-url origin)"
else
  gh repo create "${OWNER}/${REPO}" \
    --public \
    --description "GKE retail microservices — Terraform, Helm, automobile demo" \
    --source=. \
    --remote=origin
fi

git push -u origin main

echo ""
echo "Repo: https://github.com/${OWNER}/${REPO}"
