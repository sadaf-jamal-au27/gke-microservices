# Repository layout

Monorepo split into four lanes, each with its own GitHub workflow and ownership boundary.

```text
application/          # Runtime code (microservices, BFF, React apps)
devops/               # Helm, DB migrations, deploy & image scripts
infra/                # Fabric FAST Terraform landing zone
testing/              # E2E smoke + quality gate documentation
docs/                 # Architecture, runbooks, setup guides
.github/workflows/    # Dedicated pipelines per lane + quality gate
```

## Application (`application/`)

| Path | Purpose |
|------|---------|
| `application/apps/` | Storefront & admin (Vite/React) |
| `application/services/` | Microservices + BFF |
| `application/packages/` | Shared libraries (`service-core`, `automobile-db`, …) |
| `application/scripts/` | Local dev, generators, DB migrate helper |

**Pipeline:** `.github/workflows/application-ci.yml`  
**Local:** `pnpm setup`, `pnpm dev` (from repo root)

## DevOps (`devops/`)

| Path | Purpose |
|------|---------|
| `devops/helm/retail-platform/` | Umbrella Helm chart |
| `devops/db/migrations/` | PostgreSQL schema |
| `devops/scripts/` | `helm-deploy.sh`, `validate-helm.sh`, `build-all-images.sh` |

**Pipeline:** `.github/workflows/devops-ci.yml` (lint/template; manual deploy via `workflow_dispatch`)

## Infrastructure (`infra/`)

Fabric FAST stages under `infra/fast/` — see [`infra/README.md`](infra/README.md).

**Pipeline:** `.github/workflows/infra-ci.yml` (unit → integration → optional GCP plan/apply)

## Testing (`testing/`)

| Path | Purpose |
|------|---------|
| `testing/e2e/run-smoke.sh` | Postgres + catalog + BFF HTTP smoke |
| `testing/gates/REQUIRED_CHECKS.md` | Branch protection checklist |

**Pipeline:** `.github/workflows/e2e-ci.yml`  
**Local:** `pnpm test:e2e`

## Quality gate

**Pipeline:** `.github/workflows/quality-gate.yml` — runs on every PR; configure GitHub branch protection using `testing/gates/REQUIRED_CHECKS.md`.
