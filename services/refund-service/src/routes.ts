import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/refund/info", async () => ({
    service: "refund-service",
    domain: "commerce",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["refund.processed"],
  }));

  app.get("/v1/refund/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
