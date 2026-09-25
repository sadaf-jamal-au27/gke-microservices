import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/procurement/info", async () => ({
    service: "procurement-service",
    domain: "supply",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["purchase.order.created"],
  }));

  app.get("/v1/procurement/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
