const SESSION_KEY = "autodrive_session_id";

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const base = import.meta.env.VITE_API_BASE ?? "/api";

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-session-id": getSessionId(),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `request_failed_${res.status}`);
  }
  return res.json() as Promise<T>;
}

export type Vehicle = {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  fuelType: string;
  transmission: string;
  basePriceInr: number;
  imageUrl: string;
  features: string[];
  rating: number;
  description: string;
};

export const automobileApi = {
  realtime: () =>
    api<{ vehiclesListed: number; unitsInStock: number; testDrivesToday: number; openOrders: number; timestamp: string }>(
      "/storefront/realtime"
    ),
  vehicles: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : "";
    return api<{ items: Vehicle[]; count: number }>(`/storefront/vehicles${q}`);
  },
  vehicleDetail: (id: string) =>
    api<{ vehicle: Vehicle; live: { viewersNow: number }; inventory: { items: { vin: string; color: string; status: string; dealershipId: string }[] } }>(
      `/storefront/vehicles/${id}`
    ),
  dealerships: (city?: string) => api<{ items: { id: string; name: string; city: string; phone: string; openHours: string; state: string }[] }>(`/storefront/dealerships${city ? `?city=${encodeURIComponent(city)}` : ""}`),
  priceQuote: (vehicleId: string) =>
    api<{ onRoadPriceInr: number; emiInr: number; insuranceInr: number; registrationInr: number }>("/storefront/pricing/quote", {
      method: "POST",
      body: JSON.stringify({ vehicleId }),
    }),
  financeEmi: (payload: { onRoadPriceInr: number; downPaymentInr: number; tenureMonths: number }) =>
    api<{ emiInr: number; totalPayableInr: number }>("/storefront/finance/emi", { method: "POST", body: JSON.stringify(payload) }),
  bookTestDrive: (payload: Record<string, string>) => api<{ id: string }>("/storefront/test-drives", { method: "POST", body: JSON.stringify(payload) }),
  tradeIn: (payload: Record<string, unknown>) => api<{ valueInr: number; id: string; validUntil: string }>("/storefront/trade-in/estimate", { method: "POST", body: JSON.stringify(payload) }),
  serviceBooking: (payload: Record<string, string>) => api<{ id: string }>("/storefront/service/appointments", { method: "POST", body: JSON.stringify(payload) }),
  checkout: (payload: Record<string, unknown>) => api<{ order: { id: string; status: string } }>("/storefront/checkout", { method: "POST", body: JSON.stringify(payload) }),
};

export function inr(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
