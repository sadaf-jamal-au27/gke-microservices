# Required GitHub status checks (branch protection)

Protect **`main`** only. See **`docs/BRANCHING.md`**.

Enable required checks on **each repo** for PRs into `main`:

| Repo | Required checks |
|------|-----------------|
| **gke-microservices** | Application CI, DevOps CI, infra unit + integration, E2E CI (when paths change), Quality Gate |
| **gke-retail-infra** | `terraform unit (fast)`, `terraform integration (fast)` |
| **gke-retail-application** | Application CI |
| **gke-retail-devops** | DevOps CI |

Optional: **GCP plan/apply** on infra when Environment `dev` secrets exist.

Use **workflow_dispatch** to run deploy/apply without a code push.
