#!/usr/bin/env node
/**
 * Generates retail microservice scaffolds from shared template.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const servicesDir = path.join(root, "application", "services");

const SERVICES = [
  { name: "auth-service", domain: "identity", port: 3001, events: ["user.authenticated", "user.logout"] },
  { name: "user-service", domain: "identity", port: 3002, events: ["user.created", "user.updated"] },
  { name: "role-service", domain: "identity", port: 3003, events: ["role.assigned"] },
  { name: "session-service", domain: "identity", port: 3004, events: ["session.created", "session.revoked"] },
  { name: "product-service", domain: "catalog", port: 3010, events: ["product.created", "product.updated"] },
  { name: "category-service", domain: "catalog", port: 3011, events: ["category.updated"] },
  { name: "brand-service", domain: "catalog", port: 3012, events: ["brand.updated"] },
  { name: "inventory-service", domain: "catalog", port: 3013, events: ["inventory.adjusted", "inventory.low"] },
  { name: "warehouse-service", domain: "catalog", port: 3014, events: ["warehouse.stock.moved"] },
  { name: "pricing-service", domain: "catalog", port: 3015, events: ["price.changed"] },
  { name: "promotion-service", domain: "catalog", port: 3016, events: ["promotion.started", "promotion.ended"] },
  { name: "coupon-service", domain: "catalog", port: 3017, events: ["coupon.redeemed"] },
  { name: "catalog-search-service", domain: "catalog", port: 3018, events: ["search.index.updated"] },
  { name: "media-asset-service", domain: "catalog", port: 3019, events: ["asset.uploaded"] },
  { name: "cart-service", domain: "commerce", port: 3020, events: ["cart.updated", "cart.abandoned"] },
  { name: "checkout-service", domain: "commerce", port: 3021, events: ["checkout.started", "checkout.completed"] },
  { name: "order-service", domain: "commerce", port: 3022, events: ["order.placed", "order.cancelled"] },
  { name: "order-fulfillment-service", domain: "commerce", port: 3023, events: ["fulfillment.started", "fulfillment.completed"] },
  { name: "payment-service", domain: "commerce", port: 3024, events: ["payment.authorized", "payment.captured"] },
  { name: "payment-gateway-adapter", domain: "commerce", port: 3025, events: ["gateway.callback.received"] },
  { name: "refund-service", domain: "commerce", port: 3026, events: ["refund.processed"] },
  { name: "invoice-service", domain: "commerce", port: 3027, events: ["invoice.issued"] },
  { name: "tax-service", domain: "commerce", port: 3028, events: ["tax.calculated"] },
  { name: "shipping-service", domain: "fulfillment", port: 3030, events: ["shipment.created"] },
  { name: "delivery-service", domain: "fulfillment", port: 3031, events: ["delivery.scheduled", "delivery.completed"] },
  { name: "pickup-service", domain: "fulfillment", port: 3032, events: ["pickup.ready"] },
  { name: "store-locator-service", domain: "fulfillment", port: 3033, events: ["store.updated"] },
  { name: "returns-service", domain: "fulfillment", port: 3034, events: ["return.requested", "return.approved"] },
  { name: "exchange-service", domain: "fulfillment", port: 3035, events: ["exchange.processed"] },
  { name: "supplier-service", domain: "supply", port: 3040, events: ["supplier.onboarded"] },
  { name: "procurement-service", domain: "supply", port: 3041, events: ["purchase.order.created"] },
  { name: "customer-profile-service", domain: "customer", port: 3050, events: ["profile.updated"] },
  { name: "loyalty-service", domain: "customer", port: 3051, events: ["loyalty.points.earned", "loyalty.tier.changed"] },
  { name: "wishlist-service", domain: "customer", port: 3052, events: ["wishlist.updated"] },
  { name: "review-service", domain: "customer", port: 3053, events: ["review.submitted"] },
  { name: "rating-service", domain: "customer", port: 3054, events: ["rating.updated"] },
  { name: "recommendation-service", domain: "customer", port: 3055, events: ["recommendation.generated"] },
  { name: "notification-service", domain: "engagement", port: 3060, events: ["notification.sent"] },
  { name: "email-service", domain: "engagement", port: 3061, events: ["email.queued", "email.delivered"] },
  { name: "sms-service", domain: "engagement", port: 3062, events: ["sms.sent"] },
  { name: "push-notification-service", domain: "engagement", port: 3063, events: ["push.sent"] },
  { name: "gift-card-service", domain: "engagement", port: 3064, events: ["giftcard.issued", "giftcard.redeemed"] },
  { name: "subscription-service", domain: "engagement", port: 3065, events: ["subscription.renewed"] },
  { name: "content-cms-service", domain: "content", port: 3070, events: ["content.published"] },
  { name: "analytics-event-service", domain: "platform", port: 3080, events: ["analytics.event.ingested"] },
  { name: "reporting-service", domain: "platform", port: 3081, events: ["report.generated"] },
  { name: "fraud-detection-service", domain: "platform", port: 3082, events: ["fraud.alert.raised"] },
  { name: "audit-log-service", domain: "platform", port: 3083, events: ["audit.entry.recorded"] },
  { name: "webhook-dispatcher-service", domain: "platform", port: 3084, events: ["webhook.dispatched"] },
  { name: "integration-hub-service", domain: "platform", port: 3085, events: ["integration.sync.completed"] },
  { name: "bff-api-service", domain: "edge", port: 3090, events: ["bff.request.routed"] },
];

function pkgJson(s) {
  return JSON.stringify(
    {
      name: `@retail/${s.name}`,
      version: "1.0.0",
      private: true,
      type: "module",
      scripts: {
        dev: "tsx watch src/index.ts",
        build: "tsc -p tsconfig.json",
        start: "node dist/index.js",
        test: "node --test dist/**/*.test.js",
      },
      dependencies: {
        "@retail/service-core": "workspace:*",
        fastify: "^5.2.1",
        "@fastify/cors": "^10.0.2",
        "@fastify/helmet": "^13.0.1",
        "@fastify/rate-limit": "^10.2.2",
      },
      devDependencies: {
        typescript: "^5.7.3",
        tsx: "^4.19.2",
        "@types/node": "^22.10.5",
      },
    },
    null,
    2
  );
}

function tsconfig() {
  return JSON.stringify(
    {
      extends: "../../../tsconfig.base.json",
      compilerOptions: { outDir: "dist", rootDir: "src" },
      include: ["src/**/*"],
    },
    null,
    2
  );
}

function dockerfile(name) {
  return `# syntax=docker/dockerfile:1
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY application/packages/service-core ./application/packages/service-core
COPY application/services/${name} ./application/services/${name}
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @retail/${name} build

FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/application/services/${name}/dist ./dist
COPY --from=build /app/application/services/${name}/package.json ./
COPY --from=build /app/node_modules ./node_modules
USER nonroot
EXPOSE 8080
CMD ["dist/index.js"]
`;
}

function indexTs(s) {
  const hasDb = ["auth-service", "user-service", "product-service", "cart-service", "order-service", "inventory-service"].includes(s.name);
  const extraRoutes = routeSnippet(s.name);

  return `import { createService } from "@retail/service-core";
import { registerRoutes } from "./routes.js";

const service = createService({
  name: "${s.name}",
  domain: "${s.domain}",
  port: Number(process.env.PORT ?? "${s.port}"),
  pubsubEvents: ${JSON.stringify(s.events)},
  enableDatabase: ${hasDb},
});

registerRoutes(service.app, service.deps);
await service.start();
${extraRoutes}
`;
}

function routesTs(s) {
  const impl = detailedRoutes(s.name);
  return `import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/${s.name.replace("-service", "")}/info", async () => ({
    service: "${s.name}",
    domain: "${s.domain}",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ${JSON.stringify(s.events)},
  }));

${impl}
}
`;
}

function routeSnippet() {
  return "";
}

function detailedRoutes(name) {
  switch (name) {
    case "product-service":
      return `  app.get("/v1/products", async () => {
    const rows = await deps.db?.query(
      "SELECT id, sku, name, price_cents, currency, stock FROM products ORDER BY name LIMIT 100"
    );
    return { items: rows?.rows ?? demoProducts() };
  });

  app.get("/v1/products/:id", async (req) => {
    const { id } = req.params as { id: string };
    const row = await deps.db?.query("SELECT * FROM products WHERE id = $1", [id]);
    if (row?.rows[0]) return row.rows[0];
    return demoProducts().find((p) => p.id === id) ?? { error: "not_found" };
  });

  function demoProducts() {
    return [
      { id: "p-001", sku: "SKU-TEE-001", name: "Organic Cotton Tee", price_cents: 2499, currency: "USD", stock: 120 },
      { id: "p-002", sku: "SKU-JKT-002", name: "Trail Runner Jacket", price_cents: 12999, currency: "USD", stock: 34 },
      { id: "p-003", sku: "SKU-SHO-003", name: "City Sneaker", price_cents: 8999, currency: "USD", stock: 78 },
    ];
  }`;
    case "cart-service":
      return `  app.post("/v1/carts", async (req) => {
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
  });`;
    case "order-service":
      return `  app.post("/v1/orders", async (req) => {
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
  });`;
    case "auth-service":
      return `  app.post("/v1/auth/login", async (req) => {
    const body = req.body as { email: string; password: string };
    if (!body.email?.includes("@")) {
      return { error: "invalid_credentials" };
    }
    const token = Buffer.from(JSON.stringify({ sub: body.email, exp: Date.now() + 3600000 })).toString("base64url");
    await deps.publish("user.authenticated", { email: body.email });
    return { accessToken: token, tokenType: "Bearer", expiresIn: 3600 };
  });`;
    case "inventory-service":
      return `  app.post("/v1/inventory/adjust", async (req) => {
    const body = req.body as { sku: string; delta: number };
    await deps.publish("inventory.adjusted", body);
    return { sku: body.sku, delta: body.delta, applied: true };
  });`;
    default:
      return `  app.get("/v1/${name.replace("-service", "")}/health-detail", async () => ({
    ok: true,
    dependencies: {
      database: Boolean(deps.db),
      pubsub: Boolean(deps.publish),
    },
  }));`;
  }
}

for (const s of SERVICES) {
  const dir = path.join(servicesDir, s.name);
  fs.mkdirSync(path.join(dir, "src"), { recursive: true });
  fs.writeFileSync(path.join(dir, "package.json"), pkgJson(s));
  fs.writeFileSync(path.join(dir, "tsconfig.json"), tsconfig());
  fs.writeFileSync(path.join(dir, "Dockerfile"), dockerfile(s.name));
  fs.writeFileSync(path.join(dir, "src/index.ts"), indexTs(s));
  fs.writeFileSync(path.join(dir, "src/routes.ts"), routesTs(s));
}

const helmValues = SERVICES.map((s) => ({
  name: s.name,
  domain: s.domain,
  port: 8080,
  image: `us-docker.pkg.dev/PROJECT_ID/retail/${s.name}`,
  tag: "1.0.0",
  replicas: s.domain === "edge" ? 3 : 2,
  resources: { requests: { cpu: "100m", memory: "128Mi" }, limits: { cpu: "500m", memory: "512Mi" } },
  enableCloudSqlProxy: ["auth-service", "user-service", "product-service", "cart-service", "order-service", "inventory-service"].includes(s.name),
}));

fs.writeFileSync(
  path.join(root, "platform/helm/retail-platform/services.generated.yaml"),
  `# Auto-generated — run: node scripts/generate-services.mjs\nservices:\n${helmValues
    .map(
      (v) =>
        `  - name: ${v.name}\n    domain: ${v.domain}\n    port: ${v.port}\n    image: ${v.image}\n    tag: ${v.tag}\n    replicas: ${v.replicas}\n    enableCloudSqlProxy: ${v.enableCloudSqlProxy}`
    )
    .join("\n")}\n`
);

console.log(`Generated ${SERVICES.length} services.`);
