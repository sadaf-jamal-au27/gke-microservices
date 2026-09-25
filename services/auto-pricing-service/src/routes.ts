import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { priceQuoteFromDb, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/auto-pricing/info", async () => ({
    service: "auto-pricing-service",
    domain: "automobile-pricing",
    persistence: "postgresql",
  }));

  app.post("/v1/pricing/quote", async (req, reply) => {
    const body = req.body as { vehicleId: string; insuranceInr?: number; registrationInr?: number; discountInr?: number };
    const quote = await priceQuoteFromDb(requirePool(deps.db), body);
    if (!quote) return reply404(reply);
    await deps.publish("price.quoted", quote);
    return quote;
  });
}
