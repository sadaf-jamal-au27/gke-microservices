import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/promotion/info", async () => ({
    service: "promotion-service",
    domain: "catalog",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["promotion.started","promotion.ended"],
  }));

  app.get("/v1/promotion/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
