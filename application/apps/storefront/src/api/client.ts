const base = import.meta.env.VITE_API_BASE ?? "/api";

export async function getCatalog() {
  const res = await fetch(`${base}/storefront/catalog`);
  if (!res.ok) throw new Error("catalog_fetch_failed");
  return res.json() as Promise<{ items: Product[] }>;
}

export async function createCart(customerId?: string) {
  const res = await fetch(`${base}/storefront/carts`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ customerId }),
  });
  return res.json() as Promise<Cart>;
}

export async function checkout(payload: { cartId: string; customerId: string; totalCents: number }) {
  const res = await fetch(`${base}/storefront/checkout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export type Product = {
  id: string;
  sku: string;
  name: string;
  price_cents: number;
  currency: string;
  stock: number;
};

export type Cart = {
  id: string;
  customerId: string;
  items: unknown[];
  totalCents: number;
};
