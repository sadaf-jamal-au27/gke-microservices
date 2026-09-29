# Banking — infra handoff (landing zone)

Infra repo uses **standard Terraform modules**, not Fabric FAST.  
See [LANDING_ZONE.md](LANDING_ZONE.md) for full design.

## After `terraform apply` (dev)

| Output | Use |
|--------|-----|
| `06-data` `cloudsql_private_ip` (PSC) | Helm `global.cloudSql.privateIp` |
| `cluster_name` | `gcloud container clusters get-credentials banking-dev` |
| `artifact_registry_url` | Push images from application CI |
| `workload_service_account_email` | WI annotation on K8s SA |
| `k8s_workload_identity` | namespace `banking-dev`, SA `banking-app` |

## Application services on GKE (phase 1)

Deploy with DB: identity, account, ledger, transfer, payment, card  
Edge: bff-api-service, customer-web  
No DB: bff, notification (optional)

Run SQL migrations from `gke-banking-application/db/migrations/` against Cloud SQL.

## Security baseline (infra)

- Cloud SQL: **PSC** (no public IP), CMEK, REGIONAL HA, backups in `dr_region`  
- GKE: private nodes **and private endpoint**, Workload Identity, etcd CMEK  
- VPC-SC perimeter + Restricted Google APIs via PSC  
- Secrets: Secret Manager CMEK → synced to K8s by devops  
- Pub/Sub: async domain events (optional locally)
