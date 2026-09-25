import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/email/info", async () => ({
    service: "email-service",
    domain: "engagement",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["email.queued","email.delivered"],
  }));

  app.get("/v1/email/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
