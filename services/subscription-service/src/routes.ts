import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/subscription/info", async () => ({
    service: "subscription-service",
    domain: "engagement",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["subscription.renewed"],
  }));

  app.get("/v1/subscription/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
