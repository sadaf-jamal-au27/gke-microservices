# Infrastructure — pure Terraform (no Terragrunt)

Reusable modules: `terraform/modules/<name>/`  
Live stacks per environment: `terraform/live/<env>/<stack>/`

## Layout

```text
infra/terraform/live/dev/
  env.tfvars                 # project_id, region, env, state_bucket, github_*
  project_services/
    backend.tf versions.tf provider.tf variables.tf main.tf outputs.tf
    project_services.tfvars
  network/
    network.tfvars
  ... (cloud_storage, github_wif, gke, cloudsql, pubsub, cloudrun)
```

Each stack = **separate GCS state**: `gs://{project}-retail-tfstate-{env}/{env}/{stack}/`

Module file standard: see [`terraform/modules/README.md`](terraform/modules/README.md).

> **Note:** `infra/terragrunt/` is **deprecated** — use `terraform/live/` only.

## Regenerate live stacks

```bash
node infra/scripts/generate-tf-live.mjs
```

## Bootstrap (once per env)

```bash
./infra/scripts/gcp-bootstrap.sh dev
export TF_VAR_database_password='strong-password'   # required for cloudsql apply
```

Step-by-step guide: [`docs/INFRA_SETUP.md`](../docs/INFRA_SETUP.md)

## Commands

Single stack:

```bash
./infra/scripts/tf.sh dev project_services init
./infra/scripts/tf.sh dev project_services plan
./infra/scripts/tf.sh dev project_services apply
```

All stacks in order:

```bash
./infra/scripts/tf-apply-all.sh dev plan
./infra/scripts/tf-apply-all.sh dev apply
```

Apply order (dependencies): `project_services` → `cloud_storage` → `github_wif` → `network` → `gke` → `cloudsql` → `pubsub` → `cloudrun`

## Manual terraform (same as tf.sh)

```bash
cd infra/terraform/live/dev/network
terraform init -reconfigure \
  -backend-config="bucket=ai-rag-agent-project-retail-tfstate-dev" \
  -backend-config="prefix=dev/network"
terraform plan -var-file=../env.tfvars -var-file=network.tfvars
```

## GitHub Actions

Workflow: `.github/workflows/terraform-live.yml` (Terraform only, WIF auth).

Secrets per GitHub Environment: `GCP_WIF_PROVIDER`, `GCP_CI_SERVICE_ACCOUNT`, `GCP_PROJECT_ID`, `GCP_REGION`, `TF_VAR_database_password`.

After `github_wif` apply, copy outputs into GitHub secrets (see [`.github/GITHUB_SETUP.md`](../.github/GITHUB_SETUP.md)).
