import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/user/info", async () => ({
    service: "user-service",
    domain: "identity",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["user.created","user.updated"],
  }));

  app.get("/v1/user/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
