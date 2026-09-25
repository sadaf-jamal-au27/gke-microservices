import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/coupon/info", async () => ({
    service: "coupon-service",
    domain: "catalog",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["coupon.redeemed"],
  }));

  app.get("/v1/coupon/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
