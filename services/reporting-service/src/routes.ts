import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/reporting/info", async () => ({
    service: "reporting-service",
    domain: "platform",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["report.generated"],
  }));

  app.get("/v1/reporting/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
