# Retail Microservices Platform (GKE)

Production-style **retail** reference implementation with **51 microservices**, **Helm** deployment on **GKE Autopilot**, **GKE Gateway API**, **Cloud SQL PostgreSQL**, **Pub/Sub**, **Cloud Run BFF**, and **React** storefront/admin — suitable for end-to-end client demos with documented security and networking controls.

## What's included

| Layer | Location |
|-------|----------|
| Architecture | [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md) |
| Security audit | [`docs/security/SECURITY-AUDIT.md`](docs/security/SECURITY-AUDIT.md) |
| Deploy runbook | [`docs/runbooks/RUNBOOK-DEPLOY.md`](docs/runbooks/RUNBOOK-DEPLOY.md) |
| 51 backend services | [`services/`](services/) |
| Shared runtime | [`packages/service-core`](packages/service-core) |
| Helm (all services) | [`platform/helm/retail-platform`](platform/helm/retail-platform) |
| Terraform (pure) | [`infra/README.md`](infra/README.md) — `terraform/live/{dev,qa,test,prod}/` |
| Helm commands | [`docs/runbooks/RUNBOOK-HELM.md`](docs/runbooks/RUNBOOK-HELM.md) |
| SQL schema | [`platform/db/migrations`](platform/db/migrations) |
| React storefront | [`apps/storefront`](apps/storefront) |
| React admin | [`apps/admin`](apps/admin) |

## Automobile platform (real PostgreSQL + 10 APIs)

**Not in-memory mock** — vehicles, VIN inventory, bookings, orders, and trade-in estimates persist in **PostgreSQL** (`platform/db/migrations/002_automobile.sql`).

```bash
chmod +x scripts/dev-automobile.sh scripts/db-migrate.sh
pnpm dev:auto   # Docker Postgres + migrate + 10 services + BFF + React UI
```

Open **http://localhost:5173** — AutoDrive Motors storefront (DM Sans / Instrument Serif, sticky nav, DB-backed live stats).

| Layer | Path |
|-------|------|
| DB migrations | `platform/db/migrations/` |
| Repositories | `packages/automobile-db` |
| 10 microservices | `services/vehicle-catalog-service`, … |
| Frontend | `apps/storefront` |

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
