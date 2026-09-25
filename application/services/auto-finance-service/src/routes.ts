import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { financeQuote } from "@retail/automobile-db";



export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/auto-finance/info", async () => ({
    service: "auto-finance-service",
    domain: "automobile-finance",
    persistence: "postgresql",
  }));

  app.post("/v1/finance/emi", async (req, reply) => {
    const body = req.body as { onRoadPriceInr: number; downPaymentInr: number; tenureMonths: number; aprPercent?: number };
    const quote = financeQuote(body);
    if (!quote) return reply.code(400).send({ error: "invalid_input" });
    return quote;
  });
}
