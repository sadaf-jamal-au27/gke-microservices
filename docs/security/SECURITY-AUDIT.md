# Security audit checklist — Retail GKE Platform

Use this document for client security reviews and internal go-live gates.

## Network & perimeter

| Control | Implementation | Status |
|---------|----------------|--------|
| Private GKE nodes | `enable_private_nodes` in Terraform GKE module | Required |
| Restricted master access | Replace `0.0.0.0/0` in `master_authorized_networks_config` with VPN/office CIDR | **Action before prod** |
| Cloud SQL no public IP | `ipv4_enabled = false` + PSA peering | Required |
| Serverless egress | Cloud Run VPC connector `PRIVATE_RANGES_ONLY` | Required |
| Micro-segmentation | Kubernetes `NetworkPolicy` default deny + BFF ingress rules | Required |
| Edge protection | Enable **Cloud Armor** on external Gateway/LB (WAF, rate limit, geo) | Recommended |
| TLS | Gateway API HTTPS listeners + cert-manager or Certificate Manager map | Required |

## Identity & secrets

| Control | Implementation | Status |
|---------|----------------|--------|
| No JSON keys in images | Workload Identity for GKE + dedicated GSA | Required |
| DB credentials | Kubernetes Secret `retail-db` sourced from Secret Manager (External Secrets Operator) | **Wire in prod** |
| Least privilege IAM | Separate roles: `cloudsql.client`, `pubsub.publisher/subscriber`, `secretAccessor` | Required |
| Cloud Run auth | Replace `allUsers` invoker with IAM + Identity-Aware Proxy for admin paths | **Action before prod** |
| Service auth | Enable `REQUIRE_AUTH=true` on internal services; BFF validates JWT | Recommended |

## Application security

| Control | Implementation | Status |
|---------|----------------|--------|
| Security headers | `@fastify/helmet` in `service-core` | Done |
| Rate limiting | `@fastify/rate-limit` per service | Done |
| Log redaction | Pino redact for `authorization`, passwords, tokens | Done |
| Input validation | Add JSON schema validation on write endpoints (next hardening sprint) | Planned |
| Dependency scanning | GitHub Actions + Artifact Analysis / Snyk | CI template included |
| Container hardening | Distroless runtime, non-root, dropped capabilities | Done |

## Data & compliance

| Control | Implementation | Status |
|---------|----------------|--------|
| Encryption at rest | Cloud SQL + Pub/Sub default Google encryption | Built-in |
| Encryption in transit | TLS edge + Cloud SQL Auth Proxy | Required |
| PITR backups | Cloud SQL PITR enabled (7-day logs) | Required |
| Audit trail | `audit-log-service` + Cloud Logging sinks to BigQuery | Recommended |
| Fraud signals | `fraud-detection-service` consumes checkout events | Architecture ready |

## Observability & incident response

- **Metrics**: Google Managed Prometheus scraping `/metrics` on each service.
- **Tracing**: Cloud Trace via OpenTelemetry collector (add DaemonSet).
- **Alerts**: SLO burn alerts on BFF latency, order error rate, SQL connection saturation.
- **Runbook**: See `docs/runbooks/RUNBOOK-INCIDENT.md`.

## Pre-demo client checklist

1. Replace all `YOUR_GCP_PROJECT_ID` placeholders in Helm/Terraform.
2. Restrict GKE master authorized networks.
3. Remove public Cloud Run invoker; use signed requests from storefront CDN.
4. Create Secret Manager secret `retail-db-password` and sync to K8s.
5. Run `gcloud sql connect` migration `platform/db/migrations/001_core.sql`.
6. Validate Gateway HTTPRoute returns 200 for `/api/v1/storefront/catalog`.
