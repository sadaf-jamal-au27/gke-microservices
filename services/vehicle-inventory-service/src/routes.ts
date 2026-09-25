import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { listInventory, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/vehicle-inventory/info", async () => ({
    service: "vehicle-inventory-service",
    domain: "automobile-inventory",
    persistence: "postgresql",
  }));

  app.get("/v1/inventory", async (req) => {
    const q = req.query as { vehicleId?: string; dealershipId?: string };
    return { items: await listInventory(requirePool(deps.db), q.vehicleId, q.dealershipId) };
  });
  app.get("/v1/inventory/vin/:vin", async (req, reply) => {
    const items = await listInventory(requirePool(deps.db));
    return items.find((u) => u.vin === (req.params as { vin: string }).vin) ?? reply404(reply);
  });
}
