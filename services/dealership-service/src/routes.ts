import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { listDealerships, getDealership, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/dealership/info", async () => ({
    service: "dealership-service",
    domain: "automobile-dealer",
    persistence: "postgresql",
  }));

  app.get("/v1/dealerships", async (req) => {
    const { city } = req.query as { city?: string };
    return { items: await listDealerships(requirePool(deps.db), city) };
  });
  app.get("/v1/dealerships/:id", async (req, reply) => {
    const d = await getDealership(requirePool(deps.db), (req.params as { id: string }).id);
    return d ?? reply404(reply);
  });
}
