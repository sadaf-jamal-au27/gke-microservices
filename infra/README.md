# Infrastructure — Fabric FAST landing zone

Pure Terraform (no Terragrunt). Stages under `fast/stages/`; modules under `fast/modules/` (network via [Cloud Foundation Fabric](https://github.com/GoogleCloudPlatform/cloud-foundation-fabric) `net-vpc`).

## Layout

```text
infra/fast/datasets/dev/env.tfvars
infra/fast/stages/0-bootstrap|1-network|2-platform/<stack>/
```

Apply order: `project_services` → `cloud_storage` → `github_wif` → `network` → `gke` → `cloudsql` → `pubsub`  
(`cloudrun` is optional — apply manually after the application repo pushes images.)

## Bootstrap

```bash
./infra/scripts/gcp-bootstrap.sh dev
export TF_VAR_database_password='strong-password'
```

## Terraform

```bash
./infra/scripts/tf.sh dev network init
./infra/scripts/tf-apply-all.sh dev plan
./infra/scripts/tf-apply-all.sh dev apply
```

Regenerate stage roots after module changes:

```bash
node infra/scripts/generate-fast-stages.mjs
```

## CI

Workflow [`.github/workflows/infra-ci.yml`](../.github/workflows/infra-ci.yml):

1. **Terraform static checks** — `fmt`, `validate`, `terraform test` (no GCP)
2. **Terraform plan (GCP)** — PR / manual: remote `init` + plan all stacks, upload plan artifacts
3. **Terraform apply (GCP)** — push `develop`/`main`: plan → apply saved plans in one job

```bash
./infra/scripts/test-static.sh dev          # local
./infra/scripts/tf-plan-all.sh dev          # local plan (GCP auth)
./infra/scripts/ci-gcp-plan.sh dev          # same as CI plan job
```

Guide: [`docs/PLATFORM_GUIDE.md`](../docs/PLATFORM_GUIDE.md), [`docs/INFRA_SETUP.md`](../docs/INFRA_SETUP.md)

## Tests (local)

```bash
./infra/scripts/test-static.sh dev
```
