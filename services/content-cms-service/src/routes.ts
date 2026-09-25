import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/content-cms/info", async () => ({
    service: "content-cms-service",
    domain: "content",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["content.published"],
  }));

  app.get("/v1/content-cms/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
