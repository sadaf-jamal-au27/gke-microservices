import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/returns/info", async () => ({
    service: "returns-service",
    domain: "fulfillment",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["return.requested","return.approved"],
  }));

  app.get("/v1/returns/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
