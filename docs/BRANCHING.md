# Branching and release strategy

This platform uses **GitHub Flow with a long-lived `develop` branch** for integration and **`main` for production-ready** code. The same rules apply to all four repos (`gke-retail-infra`, `gke-retail-application`, `gke-retail-devops`, optional monorepo `gke-microservices`).

## Branches

| Branch | Purpose | Deploy target |
|--------|---------|----------------|
| `main` | Production-ready; protected | GCP env **prod** (manual workflow) |
| `develop` | Daily integration | GCP env **dev** (manual workflow + PR plans) |
| `feature/*` | New work | None (CI only) |
| `fix/*` | Bugfixes | None (CI only) |
| `release/*` | Stabilize before prod | QA / **test** env (optional) |
| `hotfix/*` | Urgent prod fix | **prod** after PR to `main` |

## Workflow

```text
feature/fix ──PR──► develop ──PR──► main
                      │              │
                      │              └── hotfix/* ──PR──► main
                      └── release/* (optional) ──PR──► main
```

1. Branch from **`develop`** for features (`feature/short-name`).
2. Open PR into **`develop`**. Required checks must pass (see `testing/gates/REQUIRED_CHECKS.md`).
3. When integrating to production, open PR **`develop` → `main`** (or use `release/x.y`).
4. **Hotfixes:** branch from `main`, PR to `main`, then merge `main` back into `develop`.

## GitHub Environments

Create **Environments** on each repo: `dev`, `qa`, `test`, `prod`.

| Environment | Used by | Deployment branches (GitHub UI) |
|-------------|---------|----------------------------------|
| `dev` | PR terraform **plan**, dev deploy dispatch | `develop`, `main` |
| `qa` / `test` | Optional mid-stage | `release/*`, `develop` |
| `prod` | Prod terraform apply / Helm | **`main` only** + required reviewers |

## CI behavior by event

| Event | Application | DevOps | Infra |
|-------|-------------|--------|-------|
| PR → `develop` / `main` | Build + test | Helm lint/template | Unit + integration + **GCP plan** (needs `dev` secrets) |
| Push `develop` | Build; optional image push to AR | Lint | Unit + integration |
| Push `main` | Build + image push (env **dev** or **prod** via workflow) | Lint | Unit + integration |
| `workflow_dispatch` | — | Helm **deploy** | Terraform **apply** |

## One-time setup

```bash
# Create develop on each repo (from default branch)
for r in gke-retail-infra gke-retail-application gke-retail-devops gke-microservices; do
  gh repo clone "sadaf-jamal-au27/${r}" "/tmp/${r}" 2>/dev/null || true
  cd "/tmp/${r}" && git checkout -b develop 2>/dev/null && git push -u origin develop || true
done
```

Protect **`main`** and **`develop`**: require PR, required status checks, no force-push.

## WIF and secrets

All repos share one GCP CI service account per environment. WIF allows multiple GitHub repos — see `infra/fast/datasets/dev/github_wif.tfvars` and `.github/GITHUB_SETUP.md`.

After `github_wif` apply:

```bash
cd ~/Projects/gke-retail-infra   # or monorepo infra/
export TF_VAR_DATABASE_PASSWORD='your-dev-db-password'
chmod +x scripts/github-set-wif-secrets.sh
./scripts/github-set-wif-secrets.sh dev
```
