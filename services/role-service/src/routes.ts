import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/role/info", async () => ({
    service: "role-service",
    domain: "identity",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["role.assigned"],
  }));

  app.get("/v1/role/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
