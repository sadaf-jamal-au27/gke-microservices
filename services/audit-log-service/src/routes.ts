import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/audit-log/info", async () => ({
    service: "audit-log-service",
    domain: "platform",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["audit.entry.recorded"],
  }));

  app.get("/v1/audit-log/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
