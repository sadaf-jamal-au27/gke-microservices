# Banking landing zone — audit-grade, environment-specific state

**Environment:** `dev` only in this repo path. Prod = copy `live/dev` → `live/prod` and change GCS prefixes to `banking/prod/*`.

## Stacks (separate remote state)

| Stack | State prefix | Owns |
|-------|----------------|------|
| `00-foundation` | `banking/dev/00-foundation` | APIs, **CMEK**, assets + **audit** buckets, org policies |
| `01-iam` | `banking/dev/01-iam` | GitHub WIF CI SA (**no editor**), break-glass SA |
| `02-network` | `banking/dev/02-network` | VPC (global routing), subnets, firewall, NAT, **PSC Restricted APIs**, private DNS |
| `03-vpcsc` | `banking/dev/03-vpcsc` | VPC Service Controls regular perimeter |
| `04-security` | `banking/dev/04-security` | Cloud Audit + platform log sinks, IAM audit config |
| `05-platform` | `banking/dev/05-platform` | GKE Autopilot (**private endpoint**), GAR CMEK, WI, Pub/Sub |
| `06-data` | `banking/dev/06-data` | Cloud SQL **PSC** + CMEK + REGIONAL HA + backups in `dr_region` |

Apply order is the table order. Later stacks `terraform_remote_state` earlier prefixes.

## Controls

- **IAM:** CI uses network/sql/gke admin roles — not `roles/editor`. Break-glass is a separate SA with no WIF.
- **Network:** Allow-list firewall only (implicit deny). IAP CIDR for bastion. PSC for Google APIs (`vpc-sc-restricted`) + Cloud SQL consumer endpoint.
- **VPC-SC:** Project inside a regular perimeter; Restricted Services; CI SA ingress.
- **DR:** SQL `REGIONAL` HA, backups stored in `dr_region`, audit bucket dual-region `ASIA` + CMEK, KMS key rotation 90 days.
- **GKE:** Private nodes + **private control plane**, authorized CIDRs only, etcd CMEK, Binary Auth policy (dry-run in dev).
- **SQL:** No public IP, SSL encrypted-only, PSC IP as `DB_HOST`, IAM DB user for workload SA.

## Bootstrap

1. Create state bucket (versioning on):  
   `gcloud storage buckets create gs://PROJECT-banking-tfstate-dev --location=asia-south1 --uniform-bucket-level-access --public-access-prevention`
2. Copy `terraform/live/dev/shared.tfvars.example` → `shared.tfvars` (gitignored).
3. Fill `org_id`, `access_policy_id`, VPN CIDR. Put the same bucket name in each stack `backend.hcl`.
4. `export TF_VAR_database_password='...'`  
   `node scripts/terraform-stacks.mjs init dev`  
   `node scripts/terraform-stacks.mjs plan dev`
5. First apply of `00-foundation` is often done by a human (WIF does not exist yet).

kubectl to the private master requires a runner **inside the VPC** (or IAP tunnel), not GitHub-hosted.

## Helm

| Output | Use |
|--------|-----|
| `06-data` `cloudsql_psc_ip` / `postgres.sql.internal.` | `DB_HOST` |
| `05-platform` `artifact_registry_url` | images |
| `05-platform` `k8s_workload_identity` | `banking-dev/banking-app` |
