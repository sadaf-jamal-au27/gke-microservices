import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/inventory/info", async () => ({
    service: "inventory-service",
    domain: "catalog",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["inventory.adjusted","inventory.low"],
  }));

  app.post("/v1/inventory/adjust", async (req) => {
    const body = req.body as { sku: string; delta: number };
    await deps.publish("inventory.adjusted", body);
    return { sku: body.sku, delta: body.delta, applied: true };
  });
}
