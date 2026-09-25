import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { createTestDrive, listTestDrives, requirePool } from "@retail/automobile-db";

function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/test-drive/info", async () => ({
    service: "test-drive-service",
    domain: "automobile-experience",
    persistence: "postgresql",
  }));

  app.post("/v1/test-drives", async (req) => {
    const body = req.body as { vehicleId: string; dealershipId: string; customerName: string; customerPhone: string; slot: string };
    const booking = await createTestDrive(requirePool(deps.db), body);
    await deps.publish("testdrive.booked", booking);
    return booking;
  });
  app.get("/v1/test-drives", async (req) => {
    const { phone } = req.query as { phone?: string };
    return { items: await listTestDrives(requirePool(deps.db), phone) };
  });
}
