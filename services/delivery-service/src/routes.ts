import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/delivery/info", async () => ({
    service: "delivery-service",
    domain: "fulfillment",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["delivery.scheduled","delivery.completed"],
  }));

  app.get("/v1/delivery/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
