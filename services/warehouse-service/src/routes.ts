import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/warehouse/info", async () => ({
    service: "warehouse-service",
    domain: "catalog",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["warehouse.stock.moved"],
  }));

  app.get("/v1/warehouse/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
