# gke-banking-infra

Audit-oriented GCP landing zone for Apex Bank (native Terraform — no Fabric FAST).

## Layout

```text
terraform/modules/     # kms, iam, network (PSC+DNS), vpc_sc, gke, cloudsql, …
terraform/live/dev/    # 00-foundation → 06-data, shared.tfvars, per-stack GCS state
docs/LANDING_ZONE.md
```

```text
cp terraform/live/dev/shared.tfvars.example terraform/live/dev/shared.tfvars
export TF_VAR_database_password='...'
node scripts/terraform-stacks.mjs init dev
node scripts/terraform-stacks.mjs plan dev
```

CI: `.github/workflows/infra-plan.yml` · `infra-apply.yml`
