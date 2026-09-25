import { useState } from "react";
import { automobileApi, inr } from "../api/automobile";

export function FinancePage() {
  const [emi, setEmi] = useState<number | null>(null);
  const [form, setForm] = useState({ onRoadPriceInr: 1500000, downPaymentInr: 300000, tenureMonths: 60 });

  async function calc() {
    const r = await automobileApi.financeEmi(form);
    setEmi(r.emiInr);
  }

  return (
    <section className="form-page">
      <h1>EMI calculator</h1>
      <label>
        On-road price
        <input type="number" value={form.onRoadPriceInr} onChange={(e) => setForm({ ...form, onRoadPriceInr: Number(e.target.value) })} />
      </label>
      <label>
        Down payment
        <input type="number" value={form.downPaymentInr} onChange={(e) => setForm({ ...form, downPaymentInr: Number(e.target.value) })} />
      </label>
      <label>
        Tenure (months)
        <input type="number" value={form.tenureMonths} onChange={(e) => setForm({ ...form, tenureMonths: Number(e.target.value) })} />
      </label>
      <button type="button" onClick={calc}>
        Calculate EMI
      </button>
      {emi != null && <p className="price">Estimated EMI: {inr(emi)}/month</p>}
    </section>
  );
}
