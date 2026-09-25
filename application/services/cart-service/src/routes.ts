import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/cart/info", async () => ({
    service: "cart-service",
    domain: "commerce",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["cart.updated","cart.abandoned"],
  }));

  app.post("/v1/carts", async (req) => {
    const body = req.body as { customerId?: string };
    const cart = { id: crypto.randomUUID(), customerId: body.customerId ?? "guest", items: [], totalCents: 0 };
    await deps.publish("cart.updated", cart);
    return cart;
  });

  app.post("/v1/carts/:id/items", async (req) => {
    const { id } = req.params as { id: string };
    const item = req.body as { productId: string; quantity: number; unitPriceCents: number };
    const line = { ...item, lineTotalCents: item.quantity * item.unitPriceCents };
    await deps.publish("cart.updated", { cartId: id, line });
    return { cartId: id, line };
  });
}
