import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/tax/info", async () => ({
    service: "tax-service",
    domain: "commerce",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["tax.calculated"],
  }));

  app.get("/v1/tax/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
