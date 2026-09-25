# Terraform module layout (reusable child modules)

Reusable modules under `infra/terraform/modules/<name>/`:

| File | Purpose |
|------|---------|
| `versions.tf` | `required_version` and `required_providers` |
| `provider.tf` | Provider config (used when module is the root; ignored as child except inheritance) |
| `variables.tf` | Inputs |
| `main.tf` | Resources and `locals` |
| `outputs.tf` | Outputs |

**GCS backend** (`backend.tf`) lives only in **live stacks**: `infra/terraform/live/<env>/<stack>/`.

Live stack = same files **plus** `backend.tf` and `<stack>.tfvars`.

Sync module scaffold:

```bash
node infra/scripts/sync-module-scaffold.mjs
```

Generate live environments:

```bash
node infra/scripts/generate-tf-live.mjs
```
