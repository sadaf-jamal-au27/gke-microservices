import type { FastifyInstance } from "fastify";
import type { ServiceDeps } from "@retail/service-core";

export function registerRoutes(app: FastifyInstance, deps: ServiceDeps): void {
  app.get("/v1/product/info", async () => ({
    service: "product-service",
    domain: "catalog",
    version: process.env.SERVICE_VERSION ?? "1.0.0",
    events: ["product.created","product.updated"],
  }));

  app.get("/v1/products", async () => {
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
  }
}
