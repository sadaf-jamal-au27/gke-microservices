#!/usr/bin/env bash
# Create github.com/sadaf-jamal-au27/gke-microservices and push.
# Must run while GitHub CLI is logged in as sadaf-jamal-au27 (not sadafp-ops).
set -euo pipefail

OWNER="sadaf-jamal-au27"
REPO="gke-microservices"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "${ROOT}"

ACTIVE="$(gh api user --jq .login)"
if [[ "${ACTIVE}" != "${OWNER}" ]]; then
  echo "GitHub CLI is logged in as '${ACTIVE}', not '${OWNER}'."
  echo ""
  echo "Fix:"
  echo "  gh auth login -h github.com   # sign in as ${OWNER}"
  echo "  ./scripts/create-github-repo.sh"
  echo ""
  echo "If a repo was created on sadafp-ops, accept the transfer invite on"
  echo "https://github.com/${OWNER} (notifications) OR delete it and re-run here."
  exit 1
fi

git remote set-url origin "https://github.com/${OWNER}/${REPO}.git"

if gh repo view "${OWNER}/${REPO}" >/dev/null 2>&1; then
  echo "Repo already exists: https://github.com/${OWNER}/${REPO}"
else
  gh repo create "${OWNER}/${REPO}" \
    --public \
    --description "GKE retail microservices — Terraform, Helm, automobile demo"
fi

git push -u origin main

echo ""
echo "Done: https://github.com/${OWNER}/${REPO}"
