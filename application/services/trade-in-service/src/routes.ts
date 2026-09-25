import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { tradeInEstimate, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/trade-in/info", async () => ({
    service: "trade-in-service",
    domain: "automobile-tradein",
    persistence: "postgresql",
  }));

  app.post("/v1/trade-in/estimate", async (req) => {
    const body = req.body as { make: string; model: string; year: number; kmDriven: number; condition: string };
    return tradeInEstimate(requirePool(deps.db), body);
  });
}
