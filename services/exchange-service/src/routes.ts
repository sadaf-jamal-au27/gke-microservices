import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/exchange/info", async () => ({
    service: "exchange-service",
    domain: "fulfillment",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["exchange.processed"],
  }));

  app.get("/v1/exchange/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
