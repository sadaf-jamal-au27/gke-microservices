# Deploy runbook — Terraform + GKE + Helm

## Prerequisites

- GCP projects for **dev / qa / test / prod**
- Tools: `gcloud`, `kubectl`, `helm`, `terraform`, `pnpm`, `docker` (no Terragrunt)
- GitHub Environments + WIF secrets after `github_wif` stack (see `infra/README.md`)

## 1. Configure

```bash
node infra/scripts/generate-tf-live.mjs
```

Edit:

- `infra/terraform/live/<env>/env.tfvars` — `project_id`, `github_org`, `github_repo`
- `infra/terraform/live/<env>/<stack>/<stack>.tfvars` — module overrides

## 2. Bootstrap GCP

```bash
./infra/scripts/gcp-bootstrap.sh dev
export TF_VAR_database_password='strong-password'
```

## 3. Terraform apply

```bash
./infra/scripts/tf-apply-all.sh dev plan
./infra/scripts/tf-apply-all.sh dev apply
```

Single stack:

```bash
./infra/scripts/tf.sh dev network plan
./infra/scripts/tf.sh dev network apply
```

Outputs:

```bash
./infra/scripts/tf.sh dev github_wif output
```

## 4. kubectl + images + Helm

See [`RUNBOOK-HELM.md`](./RUNBOOK-HELM.md) and [`infra/README.md`](../../infra/README.md).

```bash
gcloud container clusters get-credentials retail-dev --region asia-south1
./scripts/build-all-images.sh
./scripts/helm-deploy.sh dev
```
