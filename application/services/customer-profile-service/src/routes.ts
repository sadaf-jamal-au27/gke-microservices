import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/customer-profile/info", async () => ({
    service: "customer-profile-service",
    domain: "customer",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["profile.updated"],
  }));

  app.get("/v1/customer-profile/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
