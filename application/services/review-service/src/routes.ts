import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/review/info", async () => ({
    service: "review-service",
    domain: "customer",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["review.submitted"],
  }));

  app.get("/v1/review/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
