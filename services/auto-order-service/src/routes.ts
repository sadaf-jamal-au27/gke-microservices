import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { createOrder, getOrder, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/auto-order/info", async () => ({
    service: "auto-order-service",
    domain: "automobile-commerce",
    persistence: "postgresql",
  }));

  app.post("/v1/orders", async (req) => {
    const body = req.body as { customerId: string; vehicleId: string; dealershipId: string; totalInr: number };
    const order = await createOrder(requirePool(deps.db), body);
    await deps.publish("order.placed", order);
    return order;
  });
  app.get("/v1/orders/:id", async (req, reply) => {
    const order = await getOrder(requirePool(deps.db), (req.params as { id: string }).id);
    return order ?? reply404(reply);
  });
}
