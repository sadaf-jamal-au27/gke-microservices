import { useState } from "react";
import { automobileApi, inr } from "../api/automobile";

export function TradeInPage() {
  const [value, setValue] = useState<number | null>(null);

  async function estimate(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const r = await automobileApi.tradeIn({
      make: String(form.get("make")),
      model: String(form.get("model")),
      year: Number(form.get("year")),
      kmDriven: Number(form.get("km")),
      condition: String(form.get("condition")),
    });
    setValue(r.valueInr);
  }

  return (
    <section className="form-page">
      <h1>Instant trade-in valuation</h1>
      <form onSubmit={estimate}>
        <input name="make" required placeholder="Make" defaultValue="Maruti Suzuki" />
        <input name="model" required placeholder="Model" defaultValue="Swift" />
        <input name="year" type="number" required defaultValue={2019} />
        <input name="km" type="number" required defaultValue={45000} />
        <select name="condition" defaultValue="good">
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
        </select>
        <button type="submit">Get estimate</button>
      </form>
      {value != null && <p className="price">Offer: {inr(value)}</p>}
    </section>
  );
}
