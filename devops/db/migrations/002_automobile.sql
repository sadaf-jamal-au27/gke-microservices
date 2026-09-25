-- Automobile retail schema (PostgreSQL)
-- Run after 001_core.sql or standalone on fresh DB named retail

CREATE TABLE IF NOT EXISTS vehicles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  body_type TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  transmission TEXT NOT NULL,
  base_price_inr BIGINT NOT NULL,
  image_url TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]',
  rating NUMERIC(2,1) NOT NULL DEFAULT 4.0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dealerships (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  open_hours TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_units (
  vin TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  dealership_id TEXT NOT NULL REFERENCES dealerships(id),
  color TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('available', 'reserved', 'sold')),
  arrival_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS test_drive_bookings (
  id TEXT PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  dealership_id TEXT NOT NULL REFERENCES dealerships(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  slot TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auto_carts (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  vehicle_id TEXT REFERENCES vehicles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auto_cart_lines (
  cart_id TEXT NOT NULL REFERENCES auto_carts(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  price_inr BIGINT NOT NULL,
  qty INT NOT NULL,
  PRIMARY KEY (cart_id, sku)
);

CREATE TABLE IF NOT EXISTS auto_orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  dealership_id TEXT NOT NULL REFERENCES dealerships(id),
  total_inr BIGINT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_appointments (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_reg TEXT NOT NULL,
  service_type TEXT NOT NULL,
  slot TIMESTAMPTZ NOT NULL,
  dealership_id TEXT NOT NULL REFERENCES dealerships(id),
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trade_in_estimates (
  id TEXT PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  km_driven INT NOT NULL,
  condition TEXT NOT NULL,
  value_inr BIGINT NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_page_views (
  id BIGSERIAL PRIMARY KEY,
  vehicle_id TEXT NOT NULL REFERENCES vehicles(id),
  session_id TEXT NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_vehicle ON inventory_units(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inventory_dealer ON inventory_units(dealership_id);
CREATE INDEX IF NOT EXISTS idx_page_views_vehicle_time ON vehicle_page_views(vehicle_id, viewed_at DESC);

INSERT INTO vehicles (id, slug, make, model, year, body_type, fuel_type, transmission, base_price_inr, image_url, features, rating, description) VALUES
  ('v-tata-nexon-ev', 'tata-nexon-ev', 'Tata', 'Nexon EV', 2025, 'suv', 'electric', 'automatic', 1499000,
   'https://images.unsplash.com/photo-1619767886555-ef069784f1c8?w=1200',
   '["456 km ARAI range","DC fast charging","ADAS Level 2","Connected car suite"]', 4.6,
   'India''s best-selling electric SUV with proven battery safety and nationwide service network.'),
  ('v-hyundai-creta', 'hyundai-creta', 'Hyundai', 'Creta', 2025, 'suv', 'petrol', 'automatic', 1099000,
   'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200',
   '["Panoramic sunroof","Ventilated seats","BOSE audio","Level 2 ADAS"]', 4.5,
   'Premium compact SUV with strong resale value and comprehensive warranty.'),
  ('v-maruti-fronx', 'maruti-fronx', 'Maruti Suzuki', 'Fronx', 2025, 'hatchback', 'petrol', 'manual', 749000,
   'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200',
   '["Head-up display","Wireless Apple CarPlay","6 airbags","Suzuki Connect"]', 4.4,
   'Sporty crossover with Maruti reliability and low cost of ownership.'),
  ('v-bmw-x1', 'bmw-x1', 'BMW', 'X1', 2025, 'suv', 'petrol', 'automatic', 4990000,
   'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200',
   '["Curved display","Harman Kardon","Driving Assistant Plus","xDrive AWD option"]', 4.7,
   'Luxury entry SUV with BMW ConnectedDrive and flagship safety tech.'),
  ('v-toyota-innova', 'toyota-innova-crysta', 'Toyota', 'Innova Crysta', 2025, 'suv', 'diesel', 'automatic', 1999000,
   'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200',
   '["7 seats","Captain seats option","Rear AC","Toyota Safety Sense"]', 4.8,
   'Benchmark MPV for fleet and family with unmatched durability.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO dealerships (id, name, city, state, pincode, phone, lat, lng, open_hours) VALUES
  ('d-mum-01', 'AutoDrive Andheri West', 'Mumbai', 'MH', '400053', '+91-22-4000-1001', 19.1136, 72.8697, 'Mon-Sun 10:00-20:00'),
  ('d-del-01', 'AutoDrive Saket', 'New Delhi', 'DL', '110017', '+91-11-4000-1002', 28.5244, 77.2066, 'Mon-Sat 10:00-19:30'),
  ('d-blr-01', 'AutoDrive Whitefield', 'Bengaluru', 'KA', '560066', '+91-80-4000-1003', 12.9698, 77.7500, 'Mon-Sun 09:30-20:00'),
  ('d-pun-01', 'AutoDrive Hinjewadi', 'Pune', 'MH', '411057', '+91-20-4000-1004', 18.5912, 73.7389, 'Mon-Sun 10:00-20:00')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inventory_units (vin, vehicle_id, dealership_id, color, status, arrival_date) VALUES
  ('VIN1NEXON001', 'v-tata-nexon-ev', 'd-mum-01', 'Daytona Grey', 'available', '2025-09-01'),
  ('VIN1NEXON002', 'v-tata-nexon-ev', 'd-blr-01', 'Pristine White', 'available', '2025-09-08'),
  ('VIN1CRETA002', 'v-hyundai-creta', 'd-del-01', 'Atlas White', 'available', '2025-09-05'),
  ('VIN1FRONX003', 'v-maruti-fronx', 'd-blr-01', 'Blu Black', 'available', '2025-09-10'),
  ('VIN1BMWX1004', 'v-bmw-x1', 'd-mum-01', 'Alpine White', 'reserved', '2025-08-20'),
  ('VIN1INNO005', 'v-toyota-innova', 'd-pun-01', 'Super White', 'available', '2025-09-12')
ON CONFLICT (vin) DO NOTHING;
