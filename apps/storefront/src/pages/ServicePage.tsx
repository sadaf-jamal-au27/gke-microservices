import { useState } from "react";
import { automobileApi } from "../api/automobile";

export function ServicePage() {
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    vehicleReg: "",
    serviceType: "Periodic service",
    slot: new Date(Date.now() + 172800000).toISOString().slice(0, 16),
    dealershipId: "d-blr-01",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await automobileApi.serviceBooking(form);
    setMsg(`Service booked: ${(r as { id: string }).id}`);
  }

  return (
    <section className="form-page">
      <h1>Workshop appointment</h1>
      <form onSubmit={submit}>
        <input required placeholder="Name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required placeholder="Registration no." value={form.vehicleReg} onChange={(e) => setForm({ ...form, vehicleReg: e.target.value })} />
        <input required type="datetime-local" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} />
        <button type="submit">Book service</button>
      </form>
      {msg && <p className="success">{msg}</p>}
    </section>
  );
}
