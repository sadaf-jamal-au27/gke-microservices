import type pg from "pg";

export type VehicleRow = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  body_type: string;
  fuel_type: string;
  transmission: string;
  base_price_inr: string;
  image_url: string;
  features: unknown;
  rating: string;
  description: string | null;
};

export function mapVehicle(r: VehicleRow) {
  return {
    id: r.id,
    slug: r.slug,
    make: r.make,
    model: r.model,
    year: r.year,
    bodyType: r.body_type,
    fuelType: r.fuel_type,
    transmission: r.transmission,
    basePriceInr: Number(r.base_price_inr),
    imageUrl: r.image_url,
    features: r.features as string[],
    rating: Number(r.rating),
    description: r.description ?? "",
  };
}

export async function listVehicles(
  pool: pg.Pool,
  filter: { make?: string; fuelType?: string; bodyType?: string; maxPriceInr?: number }
) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (filter.make) {
    params.push(filter.make);
    clauses.push(`LOWER(make) = LOWER($${params.length})`);
  }
  if (filter.fuelType) {
    params.push(filter.fuelType);
    clauses.push(`fuel_type = $${params.length}`);
  }
  if (filter.bodyType) {
    params.push(filter.bodyType);
    clauses.push(`body_type = $${params.length}`);
  }
  if (filter.maxPriceInr) {
    params.push(filter.maxPriceInr);
    clauses.push(`base_price_inr <= $${params.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await pool.query<VehicleRow>(`SELECT * FROM vehicles ${where} ORDER BY make, model`, params);
  return rows.map(mapVehicle);
}

export async function getVehicle(pool: pg.Pool, idOrSlug: string) {
  const { rows } = await pool.query<VehicleRow>(`SELECT * FROM vehicles WHERE id = $1 OR slug = $1`, [idOrSlug]);
  return rows[0] ? mapVehicle(rows[0]) : null;
}

export async function recordPageView(pool: pg.Pool, vehicleId: string, sessionId: string) {
  await pool.query(`INSERT INTO vehicle_page_views (vehicle_id, session_id) VALUES ($1, $2)`, [vehicleId, sessionId]);
}

export async function liveViewers(pool: pg.Pool, vehicleId: string) {
  const { rows } = await pool.query<{ c: string }>(
    `SELECT COUNT(DISTINCT session_id)::text AS c FROM vehicle_page_views
     WHERE vehicle_id = $1 AND viewed_at > NOW() - INTERVAL '15 minutes'`,
    [vehicleId]
  );
  return Number(rows[0]?.c ?? 0);
}

export async function platformStats(pool: pg.Pool) {
  const [v, d, stock, td, ord] = await Promise.all([
    pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM vehicles`),
    pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM dealerships`),
    pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM inventory_units WHERE status = 'available'`),
    pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM test_drive_bookings WHERE slot::date = CURRENT_DATE`),
    pool.query<{ c: string }>(`SELECT COUNT(*)::text AS c FROM auto_orders WHERE status <> 'delivered'`),
  ]);
  return {
    vehiclesListed: Number(v.rows[0].c),
    dealerships: Number(d.rows[0].c),
    unitsInStock: Number(stock.rows[0].c),
    testDrivesToday: Number(td.rows[0].c),
    openOrders: Number(ord.rows[0].c),
    timestamp: new Date().toISOString(),
  };
}

export async function listDealerships(pool: pg.Pool, city?: string) {
  const { rows } = city
    ? await pool.query(`SELECT * FROM dealerships WHERE LOWER(city) LIKE LOWER($1) ORDER BY city`, [`%${city}%`])
    : await pool.query(`SELECT * FROM dealerships ORDER BY city`);
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    state: r.state,
    pincode: r.pincode,
    phone: r.phone,
    lat: r.lat,
    lng: r.lng,
    openHours: r.open_hours,
  }));
}

export async function getDealership(pool: pg.Pool, id: string) {
  const { rows } = await pool.query(`SELECT * FROM dealerships WHERE id = $1`, [id]);
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    city: r.city,
    state: r.state,
    pincode: r.pincode,
    phone: r.phone,
    lat: r.lat,
    lng: r.lng,
    openHours: r.open_hours,
  };
}

export async function listInventory(pool: pg.Pool, vehicleId?: string, dealershipId?: string) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  if (vehicleId) {
    params.push(vehicleId);
    clauses.push(`vehicle_id = $${params.length}`);
  }
  if (dealershipId) {
    params.push(dealershipId);
    clauses.push(`dealership_id = $${params.length}`);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const { rows } = await pool.query(`SELECT * FROM inventory_units ${where}`, params);
  return rows.map((u) => ({
    vin: u.vin,
    vehicleId: u.vehicle_id,
    dealershipId: u.dealership_id,
    color: u.color,
    status: u.status,
    arrivalDate: u.arrival_date,
  }));
}

export async function priceQuoteFromDb(
  pool: pg.Pool,
  input: { vehicleId: string; insuranceInr?: number; registrationInr?: number; discountInr?: number }
) {
  const vehicle = await getVehicle(pool, input.vehicleId);
  if (!vehicle) return null;
  const insurance = input.insuranceInr ?? Math.round(vehicle.basePriceInr * 0.042);
  const registration = input.registrationInr ?? (vehicle.basePriceInr > 3000000 ? 125000 : 85000);
  const discount = input.discountInr ?? 0;
  const onRoad = vehicle.basePriceInr + insurance + registration - discount;
  const emiMonths = 60;
  const emiInr = Math.round((onRoad * 1.095) / emiMonths);
  return {
    vehicleId: input.vehicleId,
    basePriceInr: vehicle.basePriceInr,
    insuranceInr: insurance,
    registrationInr: registration,
    discountInr: discount,
    onRoadPriceInr: onRoad,
    emiInr,
    emiMonths,
    aprPercent: 9.5,
  };
}

export function financeQuote(input: { onRoadPriceInr: number; downPaymentInr: number; tenureMonths: number; aprPercent?: number }) {
  const apr = input.aprPercent ?? 9.5;
  const principal = input.onRoadPriceInr - input.downPaymentInr;
  if (principal <= 0) return null;
  const monthlyRate = apr / 100 / 12;
  const pow = Math.pow(1 + monthlyRate, input.tenureMonths);
  const emi = Math.round((principal * monthlyRate * pow) / (pow - 1));
  return {
    principalInr: principal,
    emiInr: emi,
    tenureMonths: input.tenureMonths,
    aprPercent: apr,
    totalPayableInr: emi * input.tenureMonths + input.downPaymentInr,
  };
}

export async function createTestDrive(
  pool: pg.Pool,
  data: { vehicleId: string; dealershipId: string; customerName: string; customerPhone: string; slot: string }
) {
  const id = `td-${crypto.randomUUID().slice(0, 8)}`;
  await pool.query(
    `INSERT INTO test_drive_bookings (id, vehicle_id, dealership_id, customer_name, customer_phone, slot)
     VALUES ($1,$2,$3,$4,$5,$6::timestamptz)`,
    [id, data.vehicleId, data.dealershipId, data.customerName, data.customerPhone, data.slot]
  );
  return { id, ...data, status: "confirmed", createdAt: new Date().toISOString() };
}

export async function listTestDrives(pool: pg.Pool, phone?: string) {
  const { rows } = phone
    ? await pool.query(`SELECT * FROM test_drive_bookings WHERE customer_phone = $1 ORDER BY created_at DESC`, [phone])
    : await pool.query(`SELECT * FROM test_drive_bookings ORDER BY created_at DESC LIMIT 50`);
  return rows;
}

export async function upsertCart(pool: pg.Pool, cart: { id: string; customerId: string; vehicleId?: string }) {
  await pool.query(
    `INSERT INTO auto_carts (id, customer_id, vehicle_id) VALUES ($1,$2,$3)
     ON CONFLICT (id) DO UPDATE SET vehicle_id = EXCLUDED.vehicle_id, updated_at = NOW()`,
    [cart.id, cart.customerId, cart.vehicleId ?? null]
  );
  return getCart(pool, cart.id);
}

export async function getCart(pool: pg.Pool, id: string) {
  const cart = await pool.query(`SELECT * FROM auto_carts WHERE id = $1`, [id]);
  if (!cart.rows[0]) return null;
  const lines = await pool.query(`SELECT * FROM auto_cart_lines WHERE cart_id = $1`, [id]);
  return {
    id: cart.rows[0].id,
    customerId: cart.rows[0].customer_id,
    vehicleId: cart.rows[0].vehicle_id,
    accessories: lines.rows.map((l) => ({
      sku: l.sku,
      name: l.name,
      priceInr: Number(l.price_inr),
      qty: l.qty,
    })),
    updatedAt: cart.rows[0].updated_at,
  };
}

export async function addCartLine(
  pool: pg.Pool,
  cartId: string,
  line: { sku: string; name: string; priceInr: number; qty: number }
) {
  await pool.query(
    `INSERT INTO auto_cart_lines (cart_id, sku, name, price_inr, qty) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (cart_id, sku) DO UPDATE SET qty = EXCLUDED.qty, price_inr = EXCLUDED.price_inr, name = EXCLUDED.name`,
    [cartId, line.sku, line.name, line.priceInr, line.qty]
  );
  return getCart(pool, cartId);
}

export async function createOrder(
  pool: pg.Pool,
  input: { customerId: string; vehicleId: string; dealershipId: string; totalInr: number }
) {
  const id = `ord-${crypto.randomUUID().slice(0, 8)}`;
  await pool.query(
    `INSERT INTO auto_orders (id, customer_id, vehicle_id, dealership_id, total_inr, status)
     VALUES ($1,$2,$3,$4,$5,'confirmed')`,
    [id, input.customerId, input.vehicleId, input.dealershipId, input.totalInr]
  );
  return {
    id,
    ...input,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
}

export async function getOrder(pool: pg.Pool, id: string) {
  const { rows } = await pool.query(`SELECT * FROM auto_orders WHERE id = $1`, [id]);
  const r = rows[0];
  if (!r) return null;
  return {
    id: r.id,
    customerId: r.customer_id,
    vehicleId: r.vehicle_id,
    dealershipId: r.dealership_id,
    totalInr: Number(r.total_inr),
    status: r.status,
    createdAt: r.created_at,
  };
}

export async function tradeInEstimate(
  pool: pg.Pool,
  input: { make: string; model: string; year: number; kmDriven: number; condition: string }
) {
  const { rows } = await pool.query<{ base: string }>(
    `SELECT base_price_inr::text AS base FROM vehicles WHERE LOWER(make)=LOWER($1) AND LOWER(model) LIKE LOWER($2) LIMIT 1`,
    [input.make, `%${input.model}%`]
  );
  const refBase = Number(rows[0]?.base ?? 600000);
  const age = new Date().getFullYear() - input.year;
  const dep = refBase * (0.12 * age);
  const kmPenalty = Math.max(0, input.kmDriven - 25000) * 4;
  const factor = input.condition === "excellent" ? 1.05 : input.condition === "good" ? 1 : 0.9;
  const valueInr = Math.max(80000, Math.round((refBase - dep - kmPenalty) * factor));
  const id = `ti-${crypto.randomUUID().slice(0, 8)}`;
  const validUntil = new Date(Date.now() + 7 * 86400000);
  await pool.query(
    `INSERT INTO trade_in_estimates (id, make, model, year, km_driven, condition, value_inr, valid_until)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [id, input.make, input.model, input.year, input.kmDriven, input.condition, valueInr, validUntil.toISOString()]
  );
  return { id, ...input, valueInr, validUntil: validUntil.toISOString() };
}

export async function bookService(
  pool: pg.Pool,
  input: { customerName: string; phone: string; vehicleReg: string; serviceType: string; slot: string; dealershipId: string }
) {
  const id = `svc-${crypto.randomUUID().slice(0, 8)}`;
  await pool.query(
    `INSERT INTO service_appointments (id, customer_name, phone, vehicle_reg, service_type, slot, dealership_id)
     VALUES ($1,$2,$3,$4,$5,$6::timestamptz,$7)`,
    [id, input.customerName, input.phone, input.vehicleReg, input.serviceType, input.slot, input.dealershipId]
  );
  return { id, ...input, status: "scheduled", createdAt: new Date().toISOString() };
}

export function requirePool(pool: pg.Pool | null): pg.Pool {
  if (!pool) throw new Error("database_not_configured");
  return pool;
}
