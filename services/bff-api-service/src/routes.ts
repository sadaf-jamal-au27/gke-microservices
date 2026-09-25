import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

const u = (key: string, port: number) => process.env[key] ?? `http://127.0.0.1:${port}`;

const URLS = {
  catalog: u("VEHICLE_CATALOG_URL", 3101),
  dealer: u("DEALERSHIP_URL", 3102),
  inventory: u("VEHICLE_INVENTORY_URL", 3103),
  pricing: u("AUTO_PRICING_URL", 3104),
  testDrive: u("TEST_DRIVE_URL", 3105),
  cart: u("AUTO_CART_URL", 3106),
  order: u("AUTO_ORDER_URL", 3107),
  finance: u("AUTO_FINANCE_URL", 3108),
  service: u("SERVICE_APPOINTMENT_URL", 3109),
  tradeIn: u("TRADE_IN_URL", 3110),
};

async function proxyJson(url: string, init?: RequestInit) {
  const res = await fetch(url, { ...init, headers: { "content-type": "application/json", ...(init?.headers ?? {}) } });
  return res.json();
}

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/bff/info", async () => ({
    service: "bff-api-service",
    domain: "automobile-retail",
    microservices: Object.keys(URLS),
  }));

  app.get("/v1/storefront/realtime", async () => proxyJson(`${URLS.catalog}/v1/platform/stats`));

  app.get("/v1/storefront/vehicles", async (req) => {
    const q = new URLSearchParams(req.query as Record<string, string>).toString();
    return proxyJson(`${URLS.catalog}/v1/vehicles${q ? `?${q}` : ""}`, {
      headers: { "x-session-id": (req.headers["x-session-id"] as string) ?? "" },
    });
  });

  app.get("/v1/storefront/vehicles/:id", async (req) => {
    const { id } = req.params as { id: string };
    const session = (req.headers["x-session-id"] as string) ?? crypto.randomUUID();
    const [vehicle, live, inventory] = await Promise.all([
      proxyJson(`${URLS.catalog}/v1/vehicles/${id}`),
      proxyJson(`${URLS.catalog}/v1/vehicles/${id}/realtime`, { headers: { "x-session-id": session } }),
      proxyJson(`${URLS.inventory}/v1/inventory?vehicleId=${id}`),
    ]);
    return { vehicle, live, inventory };
  });

  app.get("/v1/storefront/dealerships", async (req) => {
    const q = new URLSearchParams(req.query as Record<string, string>).toString();
    return proxyJson(`${URLS.dealer}/v1/dealerships${q ? `?${q}` : ""}`);
  });

  app.post("/v1/storefront/pricing/quote", async (req) =>
    proxyJson(`${URLS.pricing}/v1/pricing/quote`, { method: "POST", body: JSON.stringify(req.body ?? {}) })
  );

  app.post("/v1/storefront/finance/emi", async (req) =>
    proxyJson(`${URLS.finance}/v1/finance/emi`, { method: "POST", body: JSON.stringify(req.body ?? {}) })
  );

  app.post("/v1/storefront/test-drives", async (req) =>
    proxyJson(`${URLS.testDrive}/v1/test-drives`, { method: "POST", body: JSON.stringify(req.body ?? {}) })
  );

  app.post("/v1/storefront/service/appointments", async (req) =>
    proxyJson(`${URLS.service}/v1/service/appointments`, { method: "POST", body: JSON.stringify(req.body ?? {}) })
  );

  app.post("/v1/storefront/trade-in/estimate", async (req) =>
    proxyJson(`${URLS.tradeIn}/v1/trade-in/estimate`, { method: "POST", body: JSON.stringify(req.body ?? {}) })
  );

  app.post("/v1/storefront/carts", async (req) =>
    proxyJson(`${URLS.cart}/v1/carts`, { method: "POST", body: JSON.stringify(req.body ?? {}) })
  );

  app.post("/v1/storefront/checkout", async (req) => {
    const body = req.body as {
      customerId: string;
      vehicleId: string;
      dealershipId: string;
      onRoadPriceInr: number;
    };
    const quote = await proxyJson(`${URLS.pricing}/v1/pricing/quote`, {
      method: "POST",
      body: JSON.stringify({ vehicleId: body.vehicleId }),
    });
    const order = await proxyJson(`${URLS.order}/v1/orders`, {
      method: "POST",
      body: JSON.stringify({
        customerId: body.customerId,
        vehicleId: body.vehicleId,
        dealershipId: body.dealershipId,
        totalInr: body.onRoadPriceInr ?? (quote as { onRoadPriceInr?: number }).onRoadPriceInr ?? 0,
      }),
    });
    await deps.publish("bff.checkout.completed", { orderId: (order as { id?: string }).id });
    return { quote, order };
  });
}
