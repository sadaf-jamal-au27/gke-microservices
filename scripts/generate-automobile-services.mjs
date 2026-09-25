#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const servicesDir = path.join(root, "services");

const AUTO_SERVICES = [
  { name: "vehicle-catalog-service", port: 3101, domain: "automobile-catalog" },
  { name: "dealership-service", port: 3102, domain: "automobile-dealer" },
  { name: "vehicle-inventory-service", port: 3103, domain: "automobile-inventory" },
  { name: "auto-pricing-service", port: 3104, domain: "automobile-pricing" },
  { name: "test-drive-service", port: 3105, domain: "automobile-experience" },
  { name: "auto-cart-service", port: 3106, domain: "automobile-commerce" },
  { name: "auto-order-service", port: 3107, domain: "automobile-commerce" },
  { name: "auto-finance-service", port: 3108, domain: "automobile-finance" },
  { name: "service-appointment-service", port: 3109, domain: "automobile-aftersales" },
  { name: "trade-in-service", port: 3110, domain: "automobile-tradein" },
];

const routeImpl = {
  "vehicle-catalog-service": `  app.get("/v1/vehicles", async (req) => {
    const pool = requirePool(deps.db);
    const q = req.query as { make?: string; fuelType?: string; bodyType?: string; maxPriceInr?: string };
    const items = await listVehicles(pool, {
      make: q.make,
      fuelType: q.fuelType,
      bodyType: q.bodyType,
      maxPriceInr: q.maxPriceInr ? Number(q.maxPriceInr) : undefined,
    });
    return { items, count: items.length };
  });
  app.get("/v1/vehicles/:id", async (req, reply) => {
    const pool = requirePool(deps.db);
    const { id } = req.params as { id: string };
    const v = await getVehicle(pool, id);
    if (!v) return reply404(reply);
    return v;
  });
  app.get("/v1/vehicles/:id/realtime", async (req) => {
    const pool = requirePool(deps.db);
    const { id } = req.params as { id: string };
    const sessionId = (req.headers["x-session-id"] as string) ?? crypto.randomUUID();
    await recordPageView(pool, id, sessionId);
    const viewersNow = await liveViewers(pool, id);
    return { vehicleId: id, viewersNow, updatedAt: new Date().toISOString() };
  });
  app.get("/v1/platform/stats", async () => platformStats(requirePool(deps.db)));`,

  "dealership-service": `  app.get("/v1/dealerships", async (req) => {
    const { city } = req.query as { city?: string };
    return { items: await listDealerships(requirePool(deps.db), city) };
  });
  app.get("/v1/dealerships/:id", async (req, reply) => {
    const d = await getDealership(requirePool(deps.db), (req.params as { id: string }).id);
    return d ?? reply404(reply);
  });`,

  "vehicle-inventory-service": `  app.get("/v1/inventory", async (req) => {
    const q = req.query as { vehicleId?: string; dealershipId?: string };
    return { items: await listInventory(requirePool(deps.db), q.vehicleId, q.dealershipId) };
  });
  app.get("/v1/inventory/vin/:vin", async (req, reply) => {
    const items = await listInventory(requirePool(deps.db));
    return items.find((u) => u.vin === (req.params as { vin: string }).vin) ?? reply404(reply);
  });`,

  "auto-pricing-service": `  app.post("/v1/pricing/quote", async (req, reply) => {
    const body = req.body as { vehicleId: string; insuranceInr?: number; registrationInr?: number; discountInr?: number };
    const quote = await priceQuoteFromDb(requirePool(deps.db), body);
    if (!quote) return reply404(reply);
    await deps.publish("price.quoted", quote);
    return quote;
  });`,

  "test-drive-service": `  app.post("/v1/test-drives", async (req) => {
    const body = req.body as { vehicleId: string; dealershipId: string; customerName: string; customerPhone: string; slot: string };
    const booking = await createTestDrive(requirePool(deps.db), body);
    await deps.publish("testdrive.booked", booking);
    return booking;
  });
  app.get("/v1/test-drives", async (req) => {
    const { phone } = req.query as { phone?: string };
    return { items: await listTestDrives(requirePool(deps.db), phone) };
  });`,

  "auto-cart-service": `  app.post("/v1/carts", async (req) => {
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
  });`,

  "auto-order-service": `  app.post("/v1/orders", async (req) => {
    const body = req.body as { customerId: string; vehicleId: string; dealershipId: string; totalInr: number };
    const order = await createOrder(requirePool(deps.db), body);
    await deps.publish("order.placed", order);
    return order;
  });
  app.get("/v1/orders/:id", async (req, reply) => {
    const order = await getOrder(requirePool(deps.db), (req.params as { id: string }).id);
    return order ?? reply404(reply);
  });`,

  "auto-finance-service": `  app.post("/v1/finance/emi", async (req, reply) => {
    const body = req.body as { onRoadPriceInr: number; downPaymentInr: number; tenureMonths: number; aprPercent?: number };
    const quote = financeQuote(body);
    if (!quote) return reply.code(400).send({ error: "invalid_input" });
    return quote;
  });`,

  "service-appointment-service": `  app.post("/v1/service/appointments", async (req) => {
    const body = req.body as { customerName: string; phone: string; vehicleReg: string; serviceType: string; slot: string; dealershipId: string };
    const appt = await bookService(requirePool(deps.db), body);
    await deps.publish("service.scheduled", appt);
    return appt;
  });`,

  "trade-in-service": `  app.post("/v1/trade-in/estimate", async (req) => {
    const body = req.body as { make: string; model: string; year: number; kmDriven: number; condition: string };
    return tradeInEstimate(requirePool(deps.db), body);
  });`,
};

const imports = {
  "vehicle-catalog-service": "listVehicles, getVehicle, recordPageView, liveViewers, platformStats, requirePool",
  "dealership-service": "listDealerships, getDealership, requirePool",
  "vehicle-inventory-service": "listInventory, requirePool",
  "auto-pricing-service": "priceQuoteFromDb, requirePool",
  "test-drive-service": "createTestDrive, listTestDrives, requirePool",
  "auto-cart-service": "upsertCart, getCart, addCartLine, requirePool",
  "auto-order-service": "createOrder, getOrder, requirePool",
  "auto-finance-service": "financeQuote",
  "service-appointment-service": "bookService, requirePool",
  "trade-in-service": "tradeInEstimate, requirePool",
};

function reply404Helper() {
  return `function reply404(reply: { code: (n: number) => { send: (b: unknown) => unknown } }) {
  return reply.code(404).send({ error: "not_found" });
}`;
}

for (const s of AUTO_SERVICES) {
  const dir = path.join(servicesDir, s.name);
  fs.mkdirSync(path.join(dir, "src"), { recursive: true });

  fs.writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify(
      {
        name: `@retail/${s.name}`,
        version: "1.0.0",
        private: true,
        type: "module",
        scripts: { dev: "tsx watch src/index.ts", build: "tsc -p tsconfig.json", start: "node dist/index.js" },
        dependencies: {
          "@retail/service-core": "workspace:*",
          "@retail/automobile-db": "workspace:*",
          fastify: "^5.2.1",
          "@fastify/cors": "^10.0.2",
          "@fastify/helmet": "^13.0.1",
          "@fastify/rate-limit": "^10.2.2",
        },
        devDependencies: { typescript: "^5.7.3", tsx: "^4.19.2", "@types/node": "^22.10.5" },
      },
      null,
      2
    )
  );

  fs.writeFileSync(
    path.join(dir, "tsconfig.json"),
    JSON.stringify({ extends: "../../tsconfig.base.json", compilerOptions: { outDir: "dist", rootDir: "src" }, include: ["src/**/*"] }, null, 2)
  );

  fs.writeFileSync(
    path.join(dir, "src/index.ts"),
    `import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";
const service = createService({
  name: "${s.name}",
  domain: "${s.domain}",
  port: Number(process.env.PORT ?? "${s.port}"),
  pubsubEvents: ["automobile.event"],
  enableDatabase: true,
});
registerRoutes(service.app, service.deps);
await service.start();
`
  );

  const needsReply = s.name !== "auto-finance-service";
  fs.writeFileSync(
    path.join(dir, "src/routes.ts"),
    `import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";
import { ${imports[s.name]} } from "@retail/automobile-db";

${needsReply ? reply404Helper() : ""}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/${s.name.replace("-service", "")}/info", async () => ({
    service: "${s.name}",
    domain: "${s.domain}",
    persistence: "postgresql",
  }));

${routeImpl[s.name].replace(/reply404\(reply\)/g, needsReply ? "reply404(reply)" : '({ error: "not_found" })')}
}
`
  );
}

console.log("Regenerated 10 PostgreSQL-backed automobile services");
