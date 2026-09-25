import { useEffect, useState } from "react";
import { automobileApi } from "../api/automobile";

export function DealershipsPage() {
  const [city, setCity] = useState("");
  const [items, setItems] = useState<Array<{ id: string; name: string; city: string; phone: string; openHours: string }>>([]);

  useEffect(() => {
    automobileApi.dealerships(city || undefined).then((d) => setItems(d.items as typeof items));
  }, [city]);

  return (
    <section>
      <h1>Dealership network</h1>
      <input placeholder="Filter city" value={city} onChange={(e) => setCity(e.target.value)} />
      <div className="dealer-grid">
        {items.map((d) => (
          <article key={d.id} className="card">
            <h3>{d.name}</h3>
            <p>{d.city}</p>
            <p>{d.phone}</p>
            <p className="muted">Hours: {d.openHours}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
