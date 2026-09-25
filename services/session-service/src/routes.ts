import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/session/info", async () => ({
    service: "session-service",
    domain: "identity",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["session.created","session.revoked"],
  }));

  app.get("/v1/session/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
