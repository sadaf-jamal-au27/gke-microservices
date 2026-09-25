import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/integration-hub/info", async () => ({
    service: "integration-hub-service",
    domain: "platform",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["integration.sync.completed"],
  }));

  app.get("/v1/integration-hub/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
