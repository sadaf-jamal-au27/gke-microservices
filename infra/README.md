# Infrastructure — Fabric FAST landing zone

Pure Terraform (no Terragrunt). Stages under `fast/stages/`; modules under `fast/modules/` (network via [Cloud Foundation Fabric](https://github.com/GoogleCloudPlatform/cloud-foundation-fabric) `net-vpc`).

## Layout

```text
infra/fast/datasets/dev/env.tfvars
infra/fast/stages/0-bootstrap|1-network|2-platform/<stack>/
```

Apply order: `project_services` → `cloud_storage` → `github_wif` → `network` → `gke` → `cloudsql` → `pubsub` → `cloudrun`

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

1. **unit** — `fmt -check`, `validate`, plan (bootstrap stacks only)
2. **integration** — unit + `terraform test`
3. **terraform-live** — GCP `plan` on PR / manual `apply` (needs GitHub Environment secrets)

## Tests (local)

```bash
./infra/scripts/test-unit.sh dev
./infra/scripts/test-integration.sh dev
```

Guide: [`docs/INFRA_SETUP.md`](../docs/INFRA_SETUP.md)
