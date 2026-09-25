import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/recommendation/info", async () => ({
    service: "recommendation-service",
    domain: "customer",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["recommendation.generated"],
  }));

  app.get("/v1/recommendation/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
