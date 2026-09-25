import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { upsertCart, getCart, addCartLine, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/auto-cart/info", async () => ({
    service: "auto-cart-service",
    domain: "automobile-commerce",
    persistence: "postgresql",
  }));

  app.post("/v1/carts", async (req) => {
    const body = req.body as { customerId?: string; vehicleId?: string };
    const cart = await upsertCart(requirePool(deps.db), {
      id: crypto.randomUUID(),
      customerId: body.customerId ?? "guest",
      vehicleId: body.vehicleId,
    });
    return cart;
  });
  app.get("/v1/carts/:id", async (req, reply) => {
    const cart = await getCart(requirePool(deps.db), (req.params as { id: string }).id);
    return cart ?? reply404(reply);
  });
  app.post("/v1/carts/:id/accessories", async (req, reply) => {
    const id = (req.params as { id: string }).id;
    const line = req.body as { sku: string; name: string; priceInr: number; qty: number };
    const cart = await addCartLine(requirePool(deps.db), id, line);
    return cart ?? reply404(reply);
  });
}
