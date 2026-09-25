import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { bookService, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/service-appointment/info", async () => ({
    service: "service-appointment-service",
    domain: "automobile-aftersales",
    persistence: "postgresql",
  }));

  app.post("/v1/service/appointments", async (req) => {
    const body = req.body as { customerName: string; phone: string; vehicleReg: string; serviceType: string; slot: string; dealershipId: string };
    const appt = await bookService(requirePool(deps.db), body);
    await deps.publish("service.scheduled", appt);
    return appt;
  });
}
