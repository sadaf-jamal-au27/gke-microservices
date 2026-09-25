import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/webhook-dispatcher/info", async () => ({
    service: "webhook-dispatcher-service",
    domain: "platform",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["webhook.dispatched"],
  }));

  app.get("/v1/webhook-dispatcher/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
