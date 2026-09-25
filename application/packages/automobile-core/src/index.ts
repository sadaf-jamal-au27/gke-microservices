export type Vehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  bodyType: "sedan" | "suv" | "hatchback" | "ev" | "pickup";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  transmission: "manual" | "automatic";
  basePriceInr: number;
  imageUrl: string;
  features: string[];
  rating: number;
};

export type Dealership = {
  id: string;
  name: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  lat: number;
  lng: number;
  openHours: string;
};

export type InventoryUnit = {
  vin: string;
  vehicleId: string;
  dealershipId: string;
  color: string;
  status: "available" | "reserved" | "sold";
  arrivalDate: string;
};

export type TestDriveBooking = {
  id: string;
  vehicleId: string;
  dealershipId: string;
  customerName: string;
  customerPhone: string;
  slot: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
};

export type AutoCart = {
  id: string;
  customerId: string;
  vehicleId?: string;
  accessories: { sku: string; name: string; priceInr: number; qty: number }[];
  updatedAt: string;
};

export type AutoOrder = {
  id: string;
  customerId: string;
  vehicleId: string;
  dealershipId: string;
  totalInr: number;
  status: "pending" | "confirmed" | "delivered";
  createdAt: string;
};

const vehicles: Vehicle[] = [
  {
    id: "v-tata-nexon-ev",
    slug: "tata-nexon-ev",
    make: "Tata",
    model: "Nexon EV",
    year: 2025,
    bodyType: "suv",
    fuelType: "electric",
    transmission: "automatic",
    basePriceInr: 1499000,
    imageUrl: "https://images.unsplash.com/photo-1619767886555-ef069784f1c8?w=800",
    features: ["456 km range", "Fast charge", "ADAS L2"],
    rating: 4.6,
  },
  {
    id: "v-hyundai-creta",
    slug: "hyundai-creta",
    make: "Hyundai",
    model: "Creta",
    year: 2025,
    bodyType: "suv",
    fuelType: "petrol",
    transmission: "automatic",
    basePriceInr: 1099000,
    imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800",
    features: ["Sunroof", "Ventilated seats", "360 camera"],
    rating: 4.5,
  },
  {
    id: "v-maruti-fronx",
    slug: "maruti-fronx",
    make: "Maruti Suzuki",
    model: "Fronx",
    year: 2025,
    bodyType: "hatchback",
    fuelType: "petrol",
    transmission: "manual",
    basePriceInr: 749000,
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800",
    features: ["Head-up display", "Wireless CarPlay", "6 airbags"],
    rating: 4.4,
  },
  {
    id: "v-bmw-x1",
    slug: "bmw-x1",
    make: "BMW",
    model: "X1",
    year: 2025,
    bodyType: "suv",
    fuelType: "petrol",
    transmission: "automatic",
    basePriceInr: 4990000,
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
    features: ["Panoramic roof", "Harman Kardon", "Driving assistant"],
    rating: 4.7,
  },
  {
    id: "v-toyota-innova",
    slug: "toyota-innova-crysta",
    make: "Toyota",
    model: "Innova Crysta",
    year: 2025,
    bodyType: "suv",
    fuelType: "diesel",
    transmission: "automatic",
    basePriceInr: 1999000,
    imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
    features: ["7 seater", "Captain seats", "Rear AC vents"],
    rating: 4.8,
  },
];

const dealerships: Dealership[] = [
  { id: "d-mum-01", name: "AutoDrive Andheri", city: "Mumbai", state: "MH", pincode: "400053", phone: "+91-22-4000-1001", lat: 19.1136, lng: 72.8697, openHours: "10:00-20:00" },
  { id: "d-del-01", name: "AutoDrive Saket", city: "New Delhi", state: "DL", pincode: "110017", phone: "+91-11-4000-1002", lat: 28.5244, lng: 77.2066, openHours: "10:00-19:30" },
  { id: "d-blr-01", name: "AutoDrive Whitefield", city: "Bengaluru", state: "KA", pincode: "560066", phone: "+91-80-4000-1003", lat: 12.9698, lng: 77.75, openHours: "09:30-20:00" },
  { id: "d-pun-01", name: "AutoDrive Hinjewadi", city: "Pune", state: "MH", pincode: "411057", phone: "+91-20-4000-1004", lat: 18.5912, lng: 73.7389, openHours: "10:00-20:00" },
];

const inventory: InventoryUnit[] = [
  { vin: "VIN1NEXON001", vehicleId: "v-tata-nexon-ev", dealershipId: "d-mum-01", color: "Daytona Grey", status: "available", arrivalDate: "2025-09-01" },
  { vin: "VIN1CRETA002", vehicleId: "v-hyundai-creta", dealershipId: "d-del-01", color: "Atlas White", status: "available", arrivalDate: "2025-09-05" },
  { vin: "VIN1FRONX003", vehicleId: "v-maruti-fronx", dealershipId: "d-blr-01", color: "Blu Black", status: "available", arrivalDate: "2025-09-10" },
  { vin: "VIN1BMWX1004", vehicleId: "v-bmw-x1", dealershipId: "d-mum-01", color: "Alpine White", status: "reserved", arrivalDate: "2025-08-20" },
  { vin: "VIN1INNO005", vehicleId: "v-toyota-innova", dealershipId: "d-pun-01", color: "Super White", status: "available", arrivalDate: "2025-09-12" },
];

const carts = new Map<string, AutoCart>();
const orders = new Map<string, AutoOrder>();
const testDrives = new Map<string, TestDriveBooking>();
const serviceAppointments = new Map<string, Record<string, unknown>>();
const tradeIns = new Map<string, Record<string, unknown>>();

export function listVehicles(filter?: { make?: string; fuelType?: string; bodyType?: string }) {
  return vehicles.filter((v) => {
    if (filter?.make && v.make.toLowerCase() !== filter.make.toLowerCase()) return false;
    if (filter?.fuelType && v.fuelType !== filter.fuelType) return false;
    if (filter?.bodyType && v.bodyType !== filter.bodyType) return false;
    return true;
  });
}

export function getVehicle(idOrSlug: string) {
  return vehicles.find((v) => v.id === idOrSlug || v.slug === idOrSlug);
}

export function listDealerships(city?: string) {
  if (!city) return dealerships;
  return dealerships.filter((d) => d.city.toLowerCase().includes(city.toLowerCase()));
}

export function getDealership(id: string) {
  return dealerships.find((d) => d.id === id);
}

export function listInventory(vehicleId?: string, dealershipId?: string) {
  return inventory.filter((u) => {
    if (vehicleId && u.vehicleId !== vehicleId) return false;
    if (dealershipId && u.dealershipId !== dealershipId) return false;
    return true;
  });
}

export function priceQuote(input: { vehicleId: string; insuranceInr?: number; registrationInr?: number; discountInr?: number }) {
  const vehicle = getVehicle(input.vehicleId);
  if (!vehicle) return null;
  const insurance = input.insuranceInr ?? Math.round(vehicle.basePriceInr * 0.04);
  const registration = input.registrationInr ?? 85000;
  const discount = input.discountInr ?? 0;
  const onRoad = vehicle.basePriceInr + insurance + registration - discount;
  const emiMonths = 60;
  const emiInr = Math.round((onRoad * 1.09) / emiMonths);
  return { vehicleId: input.vehicleId, basePriceInr: vehicle.basePriceInr, insuranceInr: insurance, registrationInr: registration, discountInr: discount, onRoadPriceInr: onRoad, emiInr, emiMonths, aprPercent: 9 };
}

export function financeQuote(input: { onRoadPriceInr: number; downPaymentInr: number; tenureMonths: number; aprPercent?: number }) {
  const apr = input.aprPercent ?? 9.5;
  const principal = input.onRoadPriceInr - input.downPaymentInr;
  const monthlyRate = apr / 100 / 12;
  const emi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, input.tenureMonths)) / (Math.pow(1 + monthlyRate, input.tenureMonths) - 1));
  return { principalInr: principal, emiInr: emi, tenureMonths: input.tenureMonths, aprPercent: apr, totalPayableInr: emi * input.tenureMonths + input.downPaymentInr };
}

export function createTestDrive(data: Omit<TestDriveBooking, "id" | "status" | "createdAt">) {
  const id = `td-${crypto.randomUUID().slice(0, 8)}`;
  const booking: TestDriveBooking = { ...data, id, status: "confirmed", createdAt: new Date().toISOString() };
  testDrives.set(id, booking);
  return booking;
}

export function listTestDrives(customerPhone?: string) {
  const all = [...testDrives.values()];
  if (!customerPhone) return all;
  return all.filter((b) => b.customerPhone === customerPhone);
}

export function upsertCart(cart: AutoCart) {
  carts.set(cart.id, cart);
  return cart;
}

export function getCart(id: string) {
  return carts.get(id);
}

export function createOrder(input: { customerId: string; vehicleId: string; dealershipId: string; totalInr: number }) {
  const id = `ord-${crypto.randomUUID().slice(0, 8)}`;
  const order: AutoOrder = { ...input, id, status: "confirmed", createdAt: new Date().toISOString() };
  orders.set(id, order);
  return order;
}

export function getOrder(id: string) {
  return orders.get(id);
}

export function tradeInEstimate(input: { make: string; model: string; year: number; kmDriven: number; condition: "excellent" | "good" | "fair" }) {
  const base = 450000 - (new Date().getFullYear() - input.year) * 35000;
  const kmPenalty = Math.max(0, input.kmDriven - 30000) * 3;
  const conditionFactor = input.condition === "excellent" ? 1.08 : input.condition === "good" ? 1 : 0.88;
  const valueInr = Math.max(75000, Math.round((base - kmPenalty) * conditionFactor));
  const id = `ti-${crypto.randomUUID().slice(0, 8)}`;
  const record = { id, ...input, valueInr, validUntil: new Date(Date.now() + 7 * 86400000).toISOString() };
  tradeIns.set(id, record);
  return record;
}

export function bookService(input: { customerName: string; phone: string; vehicleReg: string; serviceType: string; slot: string; dealershipId: string }) {
  const id = `svc-${crypto.randomUUID().slice(0, 8)}`;
  const record = { id, ...input, status: "scheduled", createdAt: new Date().toISOString() };
  serviceAppointments.set(id, record);
  return record;
}

export function realtimeStats() {
  return {
    vehiclesListed: vehicles.length,
    dealerships: dealerships.length,
    unitsInStock: inventory.filter((u) => u.status === "available").length,
    testDrivesToday: [...testDrives.values()].filter((t) => t.slot.startsWith(new Date().toISOString().slice(0, 10))).length,
    openOrders: [...orders.values()].filter((o) => o.status !== "delivered").length,
    timestamp: new Date().toISOString(),
  };
}
