import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/wishlist/info", async () => ({
    service: "wishlist-service",
    domain: "customer",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["wishlist.updated"],
  }));

  app.get("/v1/wishlist/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));
}
