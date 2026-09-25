# GitHub Environments + WIF setup

Create GitHub **Environments**: `dev`, `qa`, `test`, `prod`.

## 1. Apply `github_wif` on GCP

Set real values in `infra/terraform/live/<env>/env.tfvars`:

```hcl
github_org  = "your-org"
github_repo = "your-repo"
```

Then:

```bash
./infra/scripts/tf.sh dev github_wif init
./infra/scripts/tf.sh dev github_wif apply
./infra/scripts/tf.sh dev github_wif output
```

## 2. Add secrets per environment

| Secret | Source |
|--------|--------|
| `GCP_WIF_PROVIDER` | output `workload_identity_provider` |
| `GCP_CI_SERVICE_ACCOUNT` | output `ci_service_account_email` |
| `GCP_PROJECT_ID` | e.g. `ai-rag-agent-project` |
| `GCP_REGION` | `asia-south1` |
| `TF_VAR_DATABASE_PASSWORD` | same password used for Cloud SQL `cloudsql` stack |

## 3. GitHub repo settings

- **Actions → General → Workflow permissions**: Read and write (if using environment protection rules).
- **Environments → dev → Deployment branches**: limit to `main` or your default branch.
- Optional: required reviewers on `prod`.

## 4. Run workflows

- **terraform-live** — `workflow_dispatch` → env + plan/apply
- **helm-deploy** — `workflow_dispatch` → env

PRs touching `infra/terraform/**` run Terraform **plan** on `dev` (requires `dev` environment secrets).
