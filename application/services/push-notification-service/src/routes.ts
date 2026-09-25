import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/push-notification/info", async () => ({
    service: "push-notification-service",
    domain: "engagement",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["push.sent"],
  }));

  app.get("/v1/push-notification/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
