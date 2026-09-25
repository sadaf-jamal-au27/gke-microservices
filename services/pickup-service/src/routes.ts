import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/pickup/info", async () => ({
    service: "pickup-service",
    domain: "fulfillment",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["pickup.ready"],
  }));

  app.get("/v1/pickup/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
