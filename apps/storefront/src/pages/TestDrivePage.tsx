import { useState } from "react";
import { useLocation } from "react-router-dom";
import { automobileApi } from "../api/automobile";

export function TestDrivePage() {
  const location = useLocation();
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    vehicleId: (location.state as { vehicleId?: string })?.vehicleId ?? "v-hyundai-creta",
    dealershipId: "d-mum-01",
    customerName: "",
    customerPhone: "",
    slot: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await automobileApi.bookTestDrive(form);
    setMsg(`Test drive confirmed: ${(res as { id: string }).id}`);
  }

  return (
    <section className="form-page">
      <h1>Book a test drive</h1>
      <form onSubmit={submit}>
        <input required placeholder="Your name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        <input required placeholder="Phone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} />
        <input required type="datetime-local" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} />
        <button type="submit">Confirm slot</button>
      </form>
      {msg && <p className="success">{msg}</p>}
    </section>
  );
}
