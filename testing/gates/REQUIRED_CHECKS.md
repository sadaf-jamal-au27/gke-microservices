# Required GitHub status checks (branch protection)

Protect **`main`** only. See **`docs/BRANCHING.md`**.

Enable required checks on **each repo** for PRs into `main`:

| Repo | Required checks |
|------|-----------------|
| **gke-microservices** | Application CI, DevOps CI, infra unit + integration, E2E CI (when paths change), Quality Gate |
| **gke-retail-infra** | unit, integration, **GCP terraform plan** (PR); **GCP terraform apply** (push to main) |
| **gke-retail-application** | Application CI |
| **gke-retail-devops** | DevOps CI |

**GCP apply** runs on **push to `main`** (dev) or **workflow_dispatch** (any env). Requires WIF + `TF_VAR_DATABASE_PASSWORD` on that GitHub Environment.

Use **workflow_dispatch** to run deploy/apply without a code push.
