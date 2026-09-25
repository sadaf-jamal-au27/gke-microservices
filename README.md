# Retail Microservices Platform (GKE)

Production-style **retail** reference implementation with **51 microservices**, **Helm** deployment on **GKE Autopilot**, **GKE Gateway API**, **Cloud SQL PostgreSQL**, **Pub/Sub**, **Cloud Run BFF**, and **React** storefront/admin — suitable for end-to-end client demos with documented security and networking controls.

## What's included

| Layer | Location |
|-------|----------|
| Architecture | [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md) |
| Security audit | [`docs/security/SECURITY-AUDIT.md`](docs/security/SECURITY-AUDIT.md) |
| Deploy runbook | [`docs/runbooks/RUNBOOK-DEPLOY.md`](docs/runbooks/RUNBOOK-DEPLOY.md) |
| Repo layout | [`docs/REPO_STRUCTURE.md`](docs/REPO_STRUCTURE.md) |
| Application | [`application/`](application/) — services, apps, packages |
| DevOps | [`devops/`](devops/) — Helm, migrations, deploy scripts |
| Infrastructure | [`infra/README.md`](infra/README.md) — Fabric FAST |
| Testing & gates | [`testing/`](testing/) — E2E smoke + required checks |
| 51 backend services | [`application/services/`](application/services/) |
| Shared runtime | [`application/packages/service-core`](application/packages/service-core) |
| Helm | [`devops/helm/retail-platform`](devops/helm/retail-platform) |
| SQL schema | [`devops/db/migrations`](devops/db/migrations) |
| React storefront | [`application/apps/storefront`](application/apps/storefront) |
| React admin | [`application/apps/admin`](application/apps/admin) |

## Automobile platform (real PostgreSQL + 10 APIs)

**Not in-memory mock** — vehicles, VIN inventory, bookings, orders, and trade-in estimates persist in **PostgreSQL** (`devops/db/migrations/002_automobile.sql`).

```bash
chmod +x application/scripts/dev-automobile.sh application/scripts/db-migrate.sh
pnpm dev:auto   # Docker Postgres + migrate + 10 services + BFF + React UI
```

Open **http://localhost:5173** — AutoDrive Motors storefront (DM Sans / Instrument Serif, sticky nav, DB-backed live stats).

| Layer | Path |
|-------|------|
| DB migrations | `devops/db/migrations/` |
| Repositories | `application/packages/automobile-db` |
| 10 microservices | `application/services/vehicle-catalog-service`, … |
| Frontend | `application/apps/storefront` |

## CI pipelines

| Workflow | Lane |
|----------|------|
| `application-ci.yml` | Build apps & sample services |
| `devops-ci.yml` | Helm lint/template (+ manual deploy) |
| `infra-ci.yml` | Terraform unit/integration/GCP |
| `e2e-ci.yml` | Smoke E2E |
| `quality-gate.yml` | PR gate summary |

See [`testing/gates/REQUIRED_CHECKS.md`](testing/gates/REQUIRED_CHECKS.md).

## Quick local demo (legacy generic retail)

```bash
pnpm install
pnpm --filter @retail/service-core build
pnpm --filter @retail/product-service dev    # :3010
pnpm --filter @retail/bff-api-service dev    # :3090 — set PRODUCT_SERVICE_URL=http://127.0.0.1:3010
pnpm --filter @retail/storefront dev         # :5173
```

## Regenerate 51 services (after editing generator)

```bash
pnpm generate:services
```

## Client demo talking points

1. **Domain-driven decomposition** — identity, catalog, commerce, fulfillment, customer, platform.
2. **Secure by default** — private SQL, Workload Identity, NetworkPolicies, non-root Distroless images.
3. **Event-driven** — order/checkout events via Pub/Sub for async fulfillment and analytics.
4. **Hybrid edge** — GKE Gateway for primary traffic; Cloud Run BFF for scale-to-zero/burst (optional).
5. **GitOps-ready** — Helm values + generated service matrix for Argo CD/Flux.

## License

MIT — adapt freely for proposals and POCs.
