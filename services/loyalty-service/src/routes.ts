import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/loyalty/info", async () => ({
    service: "loyalty-service",
    domain: "customer",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["loyalty.points.earned","loyalty.tier.changed"],
  }));

  app.get("/v1/loyalty/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
