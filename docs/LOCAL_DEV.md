# Local development (developer workflow)

## Prerequisites

- **Node 22+**, **pnpm**, **Docker Desktop**
- Ports free: `5173` (UI), `3090` (BFF), `3101–3110` (microservices), `5432` (Postgres)

## First time

```bash
chmod +x scripts/setup-local.sh scripts/dev-local.sh
./scripts/setup-local.sh
```

## Every day (one terminal — like `npm run dev`)

```bash
pnpm dev:stop   # if you see EADDRINUSE or ran dev twice
pnpm dev
```

| URL | What |
|-----|------|
| http://localhost:5173 | **Frontend** (AutoDrive storefront) |
| http://localhost:3090/v1/storefront/vehicles | **BFF** → catalog |
| http://localhost:3101/v1/vehicles | vehicle-catalog-service direct |
| http://localhost:3101/health/ready | health check |

Frontend calls `/api/*` → Vite proxy → BFF `http://localhost:3090/v1/*`.

## Split terminals (optional)

```bash
# T1 — database
docker compose up postgres

# T2 — all backends + BFF
./scripts/dev-local.sh
# (or run services individually with PORT=3101 pnpm --filter @retail/vehicle-catalog-service dev)

# T3 — frontend only
pnpm dev:storefront
```

## Verify backend

```bash
curl -s http://localhost:3090/v1/storefront/vehicles | head -c 400
curl -s http://localhost:3101/v1/platform/stats
```

## Admin (service health on ports)

```bash
pnpm dev:admin   # http://localhost:5174
```
