import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/gift-card/info", async () => ({
    service: "gift-card-service",
    domain: "engagement",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["giftcard.issued","giftcard.redeemed"],
  }));

  app.get("/v1/gift-card/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
