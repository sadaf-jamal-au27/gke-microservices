-- Retail core schema (Cloud SQL PostgreSQL)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_cents INT NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  stock INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  cart_id TEXT NOT NULL,
  status TEXT NOT NULL,
  total_cents INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT,
  action TEXT NOT NULL,
  resource TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO products (id, sku, name, price_cents, currency, stock) VALUES
  ('p-001', 'SKU-TEE-001', 'Organic Cotton Tee', 2499, 'USD', 120),
  ('p-002', 'SKU-JKT-002', 'Trail Runner Jacket', 12999, 'USD', 34),
  ('p-003', 'SKU-SHO-003', 'City Sneaker', 8999, 'USD', 78)
ON CONFLICT (id) DO NOTHING;
