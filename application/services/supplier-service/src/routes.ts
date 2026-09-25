import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/supplier/info", async () => ({
    service: "supplier-service",
    domain: "supply",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["supplier.onboarded"],
  }));

  app.get("/v1/supplier/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
