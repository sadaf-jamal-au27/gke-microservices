import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/order/info", async () => ({
    service: "order-service",
    domain: "commerce",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["order.placed","order.cancelled"],
  }));

  app.post("/v1/orders", async (req) => {
    const body = req.body as { cartId: string; customerId: string; totalCents: number };
    const order = {
      id: crypto.randomUUID(),
      status: "PLACED",
      ...body,
      createdAt: new Date().toISOString(),
    };
    await deps.db?.query(
      "INSERT INTO orders (id, customer_id, cart_id, status, total_cents) VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING",
      [order.id, order.customerId, order.cartId, order.status, order.totalCents]
    );
    await deps.publish("order.placed", order);
    return order;
  });

  app.get("/v1/orders/:id", async (req) => {
    const { id } = req.params as { id: string };
    const result = await deps.db?.query("SELECT * FROM orders WHERE id = $1", [id]);
    return result?.rows[0] ?? { id, status: "UNKNOWN" };
  });
}
