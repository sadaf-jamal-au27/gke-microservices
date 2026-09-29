# Branching: feature → develop → main

Apex Bank **infra** only (`banking-infra/gke-banking-infra`). Retail is not part of this product.

```text
feature/<name>  ──PR──►  develop  ──PR──►  main
                     │                 │
                     │                 └─ GitHub env `dev` until a real prod project exists
                     └─ GitHub Environment **dev** (WIF + DB password)
```

| Branch | Role |
|--------|------|
| **`feature/<name>`** | Short-lived. **PR into `develop` only.** |
| **`develop`** | Integration. Infra **plan** on every PR. **Apply** on merge (or Actions → Run workflow). |
| **`main`** | Release gate. Only **`develop` → `main`** PRs. |

Do **not** push directly to `develop` or `main`.

## CI (this GitHub repo)

Workflows live at **repo root** `.github/workflows/` (GitHub ignores nested `.github` until this tree is its own repo).

| Event | Workflow | Job |
|-------|----------|-----|
| PR → `develop` / `main` (infra paths) | `banking-infra-plan.yml` | fmt/validate (no GCP) then plan (needs WIF) |
| PR merged, or **workflow_dispatch** | `banking-infra-apply.yml` | plan + apply stacks `00`→`06` |
| App paths | `banking-app-ci.yml` | separate — not this infra PR |

GitHub Environment: **`dev`** (secrets `GCP_WIF_PROVIDER`, `GCP_CI_SERVICE_ACCOUNT`, `TF_VAR_DATABASE_PASSWORD`).

First WIF apply is from a laptop (`00-foundation` + `01-iam`). Until then plan/apply auth fails; fmt/validate still run.

## Daily

```bash
git checkout develop && git pull
git checkout -b feature/my-infra-change
# edit banking-infra/gke-banking-infra
git push -u origin HEAD
# Open PR → develop → wait for "Terraform fmt & validate"
```

Protect **`develop`** and **`main`** on GitHub (PR required; no direct push).
