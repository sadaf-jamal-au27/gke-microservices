# GitHub Environments + WIF setup

Org: **`sadaf-jamal-au27`**. GCP dev project: **`ai-rag-agent-project`** (`asia-south1`).

WIF trusts **all platform repos** (see `infra/fast/datasets/<env>/github_wif.tfvars`):

- `gke-retail-infra`
- `gke-retail-application`
- `gke-retail-devops`
- `gke-microservices` (optional monorepo)

Branching: **`docs/BRANCHING.md`**.

## 1. Apply `github_wif` on GCP

```bash
cd infra   # monorepo, or gke-retail-infra root
./scripts/tf.sh dev github_wif init
./scripts/tf.sh dev github_wif apply
./scripts/tf.sh dev github_wif output
```

Edit `fast/datasets/dev/github_wif.tfvars` before apply if org or repo names change.

## 2. Secrets per GitHub Environment

Run (requires `gh auth login` as **sadaf-jamal-au27**):

```bash
export TF_VAR_DATABASE_PASSWORD='same-as-cloudsql-apply'
./scripts/github-set-wif-secrets.sh dev
```

Or set manually on **each repo** → Settings → Environments → **dev**:

| Secret | Source |
|--------|--------|
| `GCP_WIF_PROVIDER` | Terraform output `workload_identity_provider` |
| `GCP_CI_SERVICE_ACCOUNT` | output `ci_service_account_email` |
| `GCP_PROJECT_ID` | e.g. `ai-rag-agent-project` |
| `GCP_REGION` | `asia-south1` |
| `TF_VAR_DATABASE_PASSWORD` | Cloud SQL password ( **infra repo only** required for apply) |

Repeat for `qa`, `test`, `prod` when those GCP envs exist.

## 3. Repository settings

- **Actions → General → Workflow permissions**: Read and write.
- **Environments → dev**: Deployment branches → `develop` + `main`.
- **Environments → prod**: Deployment branches → **`main` only**; add required reviewers.

Optional **Variables** (non-secret, any repo):

| Variable | Example |
|----------|---------|
| `GCP_PROJECT_ID` | `ai-rag-agent-project` |
| `GCP_REGION` | `asia-south1` |

Workflows fall back to these if variables are unset.

## 4. Workflows

| Repo | Workflow | WIF |
|------|----------|-----|
| gke-retail-infra | `infra-ci.yml` | Plan on PR; apply via dispatch |
| gke-retail-application | `application-ci.yml` | Push images on `main` / `develop` |
| gke-retail-devops | `devops-ci.yml` | Helm deploy via dispatch |
| gke-microservices | All lane workflows | Same as split repos |

## 5. Verify WIF

From a repo with secrets, re-run **Actions → infra-ci → Run workflow** (plan, dev) or open a PR touching `infra/**` and confirm job **GCP plan/apply** authenticates without `credentials.json`.

Dev outputs (after apply):

```text
workload_identity_provider = projects/.../providers/github-provider
ci_service_account_email   = github-ci-dev@ai-rag-agent-project.iam.gserviceaccount.com
```
