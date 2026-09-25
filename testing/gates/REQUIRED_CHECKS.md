# Required GitHub status checks (branch protection)

Protect **`main`** and **`develop`**. See **`docs/BRANCHING.md`**.

Enable these **required status checks** on PRs into `develop` and `main`:

| Check name | Workflow | Scope |
|------------|----------|--------|
| Application CI | `application-ci.yml` | `application/**` |
| DevOps CI | `devops-ci.yml` | `devops/**` |
| Infra CI / unit | `infra-ci.yml` → job `terraform unit (fast)` | `infra/**` |
| Infra CI / integration | `infra-ci.yml` → job `terraform integration (fast)` | `infra/**` |
| E2E CI | `e2e-ci.yml` | `testing/e2e/**` + app paths |
| Quality Gate | `quality-gate.yml` | All PRs (summary) |

Infra **GCP plan** runs on PR when GitHub Environment `dev` secrets exist (optional until WIF is applied).

Skipped workflows (path filters) do not block merge if configured as “do not require” in GitHub; prefer requiring **Quality Gate** which runs on every PR.
