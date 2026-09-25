import { useEffect, useState } from "react";

const SERVICES = [
  { name: "vehicle-catalog-service", port: 3101 },
  { name: "dealership-service", port: 3102 },
  { name: "vehicle-inventory-service", port: 3103 },
  { name: "auto-pricing-service", port: 3104 },
  { name: "test-drive-service", port: 3105 },
  { name: "auto-cart-service", port: 3106 },
  { name: "auto-order-service", port: 3107 },
  { name: "auto-finance-service", port: 3108 },
  { name: "service-appointment-service", port: 3109 },
  { name: "trade-in-service", port: 3110 },
];

export function AdminDashboard() {
  const [rows, setRows] = useState(SERVICES.map((s) => ({ ...s, status: "checking…" })));

  useEffect(() => {
    SERVICES.forEach(async (s, i) => {
      try {
        const base = import.meta.env.VITE_SERVICE_BASE ?? "http://127.0.0.1";
        const res = await fetch(`${base}:${s.port}/health/ready`);
        setRows((prev) => {
          const next = [...prev];
          next[i] = { ...s, status: res.ok ? "ready" : "down" };
          return next;
        });
      } catch {
        setRows((prev) => {
          const next = [...prev];
          next[i] = { ...s, status: "offline" };
          return next;
        });
      }
    });
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <h1>AutoDrive — Microservices Console</h1>
      <p>10 automobile retail services (local ports 3101–3110)</p>
      <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #cbd5e1" }}>
            <th>Service</th>
            <th>Port</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td>{r.name}</td>
              <td>{r.port}</td>
              <td style={{ color: r.status === "ready" ? "#047857" : "#b91c1c" }}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
