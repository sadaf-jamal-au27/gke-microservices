import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { listVehicles, getVehicle, recordPageView, liveViewers, platformStats, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/vehicle-catalog/info", async () => ({
    service: "vehicle-catalog-service",
    domain: "automobile-catalog",
    persistence: "postgresql",
  }));

  app.get("/v1/vehicles", async (req) => {
    const pool = requirePool(deps.db);
    const q = req.query as { make?: string; fuelType?: string; bodyType?: string; maxPriceInr?: string };
    const items = await listVehicles(pool, {
      make: q.make,
      fuelType: q.fuelType,
      bodyType: q.bodyType,
      maxPriceInr: q.maxPriceInr ? Number(q.maxPriceInr) : undefined,
    });
    return { items, count: items.length };
  });
  app.get("/v1/vehicles/:id", async (req, reply) => {
    const pool = requirePool(deps.db);
    const { id } = req.params as { id: string };
    const v = await getVehicle(pool, id);
    if (!v) return reply404(reply);
    return v;
  });
  app.get("/v1/vehicles/:id/realtime", async (req) => {
    const pool = requirePool(deps.db);
    const { id } = req.params as { id: string };
    const sessionId = (req.headers["x-session-id"] as string) ?? crypto.randomUUID();
    await recordPageView(pool, id, sessionId);
    const viewersNow = await liveViewers(pool, id);
    return { vehicleId: id, viewersNow, updatedAt: new Date().toISOString() };
  });
  app.get("/v1/platform/stats", async () => platformStats(requirePool(deps.db)));
}
