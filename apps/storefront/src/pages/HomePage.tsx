import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { automobileApi, inr, type Vehicle } from "../api/automobile";
import { ErrorMessage, Spinner } from "../components/Ui";

export function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fuel, setFuel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const params: Record<string, string> = {};
    if (fuel) params.fuelType = fuel;
    if (maxPrice) params.maxPriceInr = maxPrice;
    automobileApi
      .vehicles(params)
      .then((d) => setVehicles(d.items))
      .catch(() => setError("Could not load vehicles. Ensure PostgreSQL and APIs are running."))
      .finally(() => setLoading(false));
  }, [fuel, maxPrice]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">PostgreSQL-backed catalog</p>
          <h1>
            Drive home your next car, <span>transparently priced</span>
          </h1>
          <p className="lead">Browse in-stock VINs, book test drives, and complete booking — data stored in PostgreSQL, not mock memory.</p>
        </div>
        <div className="hero-filters card">
          <label>
            Fuel
            <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="">Any</option>
              <option value="electric">Electric</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
            </select>
          </label>
          <label>
            Max budget (INR)
            <input type="number" placeholder="e.g. 1500000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </label>
        </div>
      </section>

      {loading && <Spinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && (
        <section className="vehicle-grid">
          {vehicles.map((v) => (
            <article key={v.id} className="vehicle-card card">
              <div className="vehicle-img-wrap">
                <img src={v.imageUrl} alt={`${v.make} ${v.model}`} loading="lazy" />
                <span className="badge">{v.fuelType}</span>
              </div>
              <div className="vehicle-card-body">
                <h2>
                  {v.make} {v.model}
                </h2>
                <p className="meta">
                  {v.year} · {v.bodyType} · ★ {v.rating}
                </p>
                <p className="price">{inr(v.basePriceInr)}</p>
                <p className="desc">{v.description.slice(0, 100)}…</p>
                <Link className="btn btn-primary" to={`/vehicles/${v.id}`}>
                  View details &amp; book
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
