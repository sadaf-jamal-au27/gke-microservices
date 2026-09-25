#!/usr/bin/env bash
# Split monorepo into 3 GitHub repos and push (login gh as target owner first).
set -euo pipefail

OWNER="${GITHUB_OWNER:-sadaf-jamal-au27}"
MONO="$(cd "$(dirname "$0")/../.." && pwd)"
PARENT="$(dirname "$MONO")"

APP_DIR="${PARENT}/gke-retail-application"
DEVOPS_DIR="${PARENT}/gke-retail-devops"
INFRA_DIR="${PARENT}/gke-retail-infra"

ACTIVE="$(gh api user --jq .login 2>/dev/null || true)"
if [[ "${ACTIVE}" != "${OWNER}" ]]; then
  echo "GitHub CLI is '${ACTIVE}' — need '${OWNER}'. Run: gh auth login -h github.com"
  exit 1
fi

rm -rf "${APP_DIR}" "${DEVOPS_DIR}" "${INFRA_DIR}"
mkdir -p "${APP_DIR}" "${DEVOPS_DIR}" "${INFRA_DIR}"

echo "→ Application (${APP_DIR})"
rsync -a --exclude node_modules --exclude dist --exclude .terraform \
  "${MONO}/application/" "${APP_DIR}/"
rsync -a "${MONO}/testing/" "${APP_DIR}/testing/" 2>/dev/null || mkdir -p "${APP_DIR}/testing/e2e"
[[ -f "${MONO}/testing/e2e/run-smoke.sh" ]] && cp "${MONO}/testing/e2e/run-smoke.sh" "${APP_DIR}/testing/e2e/"
cp "${MONO}/pnpm-lock.yaml" "${MONO}/tsconfig.base.json" "${MONO}/docker-compose.yml" "${MONO}/.gitignore" "${APP_DIR}/"
mkdir -p "${APP_DIR}/db/migrations"
rsync -a "${MONO}/devops/db/migrations/" "${APP_DIR}/db/migrations/"
mkdir -p "${APP_DIR}/.github/workflows"

cat > "${APP_DIR}/pnpm-workspace.yaml" <<'EOF'
packages:
  - "packages/*"
  - "services/*"
  - "apps/*"
EOF

cat > "${APP_DIR}/package.json" <<'EOF'
{
  "name": "gke-retail-application",
  "private": true,
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "generate:services": "node scripts/generate-services.mjs",
    "generate:auto": "node scripts/generate-automobile-services.mjs",
    "setup": "bash scripts/setup-local.sh",
    "dev": "bash scripts/dev-local.sh",
    "dev:stop": "bash scripts/dev-stop.sh",
    "dev:auto": "bash scripts/dev-automobile.sh",
    "build": "pnpm -r build",
    "test:e2e": "bash testing/e2e/run-smoke.sh"
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
EOF

for f in "${APP_DIR}/scripts/"*.sh; do
  [[ -f "$f" ]] || continue
  sed -i '' \
    -e 's|$(dirname "$0")/../..|$(dirname "$0")/..|g' \
    -e 's|application/scripts/|scripts/|g' \
    -e 's|devops/db/migrations|db/migrations|g' "$f"
done

find "${APP_DIR}/services" -name Dockerfile | while read -r f; do
  sed -i '' \
    -e 's|COPY application/packages/|COPY packages/|g' \
    -e 's|COPY application/services/|COPY services/|g' \
    -e 's|/app/application/services/|/app/services/|g' "$f"
done

sed -i '' \
  -e 's|path.join(root, "application", "services")|path.join(root, "services")|g' \
  -e 's|application/packages/|packages/|g' \
  -e 's|application/services/|services/|g' \
  -e 's|/app/application/services/|/app/services/|g' \
  -e 's|../../../tsconfig.base.json|../../tsconfig.base.json|g' \
  "${APP_DIR}/scripts/generate-services.mjs" "${APP_DIR}/scripts/generate-automobile-services.mjs" 2>/dev/null || true

find "${APP_DIR}" -name tsconfig.json -exec sed -i '' \
  's|"extends": "../../../tsconfig.base.json"|"extends": "../../tsconfig.base.json"|g' {} \;

sed -i '' \
  -e 's|$(dirname "$0")/../..|$(dirname "$0")/..|g' \
  -e 's|bash application/scripts/|bash scripts/|g' \
  "${APP_DIR}/testing/e2e/run-smoke.sh" 2>/dev/null || true

cat > "${APP_DIR}/.github/workflows/application-ci.yml" <<'EOF'
name: Application CI
on:
  push:
    branches: [main]
    paths: ["apps/**", "services/**", "packages/**", "scripts/**", "package.json", "pnpm-lock.yaml"]
  pull_request:
    paths: ["apps/**", "services/**", "packages/**", "scripts/**", "package.json", "pnpm-lock.yaml"]
jobs:
  build:
    name: Application CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --no-frozen-lockfile
      - run: |
          pnpm --filter @retail/service-core build
          pnpm --filter @retail/bff-api-service build
          pnpm --filter @retail/storefront build
EOF

cat > "${APP_DIR}/.github/workflows/e2e-ci.yml" <<'EOF'
name: E2E CI
on:
  push:
    branches: [main]
  pull_request:
jobs:
  smoke:
    name: E2E CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: chmod +x testing/e2e/run-smoke.sh scripts/*.sh && bash testing/e2e/run-smoke.sh
EOF

cat > "${APP_DIR}/README.md" <<EOF
# gke-retail-application

Microservices, BFF, React storefront/admin, local dev + E2E.

Sibling repos: [gke-retail-devops](https://github.com/${OWNER}/gke-retail-devops) · [gke-retail-infra](https://github.com/${OWNER}/gke-retail-infra)

\`\`\`bash
pnpm install && pnpm setup && pnpm dev
\`\`\`
EOF

echo "→ DevOps (${DEVOPS_DIR})"
rsync -a "${MONO}/devops/" "${DEVOPS_DIR}/"
rm -f "${DEVOPS_DIR}/scripts/split-push-three-repos.sh"
cp "${MONO}/.gitignore" "${DEVOPS_DIR}/"
mkdir -p "${DEVOPS_DIR}/.github/workflows"
for f in "${DEVOPS_DIR}/scripts/"*.sh; do
  sed -i '' \
    -e 's|$(dirname "$0")/../..|$(dirname "$0")/..|g' \
    -e 's|${ROOT}/devops/helm|${ROOT}/helm|g' "$f"
done

cat > "${DEVOPS_DIR}/scripts/build-all-images.sh" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID}"
REGION="${REGION:-asia-south1}"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/retail"
APP_ROOT="${APPLICATION_ROOT:-$(cd "$(dirname "$0")/../../gke-retail-application" 2>/dev/null && pwd)}"
[[ -d "${APP_ROOT}/services" ]] || { echo "Set APPLICATION_ROOT to gke-retail-application clone"; exit 1; }
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
cd "${APP_ROOT}"
pnpm install --no-frozen-lockfile
pnpm --filter @retail/service-core build
for dir in services/*/; do
  name="$(basename "$dir")"
  docker build -f "services/${name}/Dockerfile" -t "${REGISTRY}/${name}:1.0.0" .
  docker push "${REGISTRY}/${name}:1.0.0"
done
EOF
chmod +x "${DEVOPS_DIR}/scripts/build-all-images.sh"

cat > "${DEVOPS_DIR}/.github/workflows/devops-ci.yml" <<'EOF'
name: DevOps CI
on:
  push:
    branches: [main]
    paths: ["helm/**", "db/**", "scripts/**"]
  pull_request:
    paths: ["helm/**", "db/**", "scripts/**"]
jobs:
  helm:
    name: DevOps CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/setup-helm@v4
        with: { version: v3.16.3 }
      - run: chmod +x scripts/validate-helm.sh && ./scripts/validate-helm.sh dev
EOF

cat > "${DEVOPS_DIR}/README.md" <<EOF
# gke-retail-devops

Helm, DB migrations, cluster deploy scripts.

\`\`\`bash
./scripts/validate-helm.sh dev
\`\`\`
EOF

echo "→ Infra (${INFRA_DIR})"
rsync -a --exclude .terraform "${MONO}/infra/" "${INFRA_DIR}/"
cp "${MONO}/.gitignore" "${INFRA_DIR}/"
mkdir -p "${INFRA_DIR}/docs"
cp "${MONO}/docs/INFRA_SETUP.md" "${INFRA_DIR}/docs/" 2>/dev/null || true
mkdir -p "${INFRA_DIR}/.github/workflows"
cp "${MONO}/.github/workflows/infra-ci.yml" "${INFRA_DIR}/.github/workflows/"
sed -i '' \
  -e 's|infra/scripts/|scripts/|g' \
  -e 's|chmod +x infra/|chmod +x |g' \
  -e 's|"infra/\*\*"|"**"|g' \
  "${INFRA_DIR}/.github/workflows/infra-ci.yml"

cat > "${INFRA_DIR}/README.md" <<'EOF'
# gke-retail-infra

Fabric FAST Terraform — see docs/INFRA_SETUP.md

```bash
./scripts/gcp-bootstrap.sh dev
./scripts/test-unit.sh dev
```
EOF

push_repo() {
  local dir=$1 name=$2
  echo "==== ${OWNER}/${name} ===="
  cd "${dir}"
  git init -b main
  git add -A
  git commit -m "Initial commit: ${name} split from gke-microservices monorepo."
  if gh repo view "${OWNER}/${name}" >/dev/null 2>&1; then
    git remote add origin "https://github.com/${OWNER}/${name}.git" 2>/dev/null || git remote set-url origin "https://github.com/${OWNER}/${name}.git"
    git push -u origin main --force
  else
    gh repo create "${OWNER}/${name}" --public --description "GKE retail — ${name}" --source=. --remote=origin --push
  fi
}

push_repo "${APP_DIR}" "gke-retail-application"
push_repo "${DEVOPS_DIR}" "gke-retail-devops"
push_repo "${INFRA_DIR}" "gke-retail-infra"

echo ""
echo "Application: https://github.com/${OWNER}/gke-retail-application"
echo "DevOps:      https://github.com/${OWNER}/gke-retail-devops"
echo "Infra:       https://github.com/${OWNER}/gke-retail-infra"
