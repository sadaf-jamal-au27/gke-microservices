import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { automobileApi, inr } from "../api/automobile";
import { ErrorMessage, Spinner } from "../components/Ui";

export function VehicleDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<Awaited<ReturnType<typeof automobileApi.vehicleDetail>> | null>(null);
  const [quote, setQuote] = useState<Awaited<ReturnType<typeof automobileApi.priceQuote>> | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    automobileApi
      .vehicleDetail(id)
      .then(setData)
      .catch(() => setError("Vehicle not found or API down."))
      .finally(() => setLoading(false));
    automobileApi.priceQuote(id).then(setQuote).catch(() => setQuote(null));
  }, [id]);

  if (loading) return <Spinner />;
  if (error || !data?.vehicle) return <ErrorMessage message={error || "Not found"} />;

  const v = data.vehicle;
  const available = data.inventory.items.filter((i) => i.status === "available");

  return (
    <article className="detail-layout">
      <div className="detail-media card">
        <img src={v.imageUrl} alt={`${v.make} ${v.model}`} />
      </div>
      <div className="detail-panel">
        <p className="eyebrow">
          {v.make} · {v.year}
        </p>
        <h1>{v.model}</h1>
        <p className="live-count">{data.live.viewersNow} shoppers viewed this model in the last 15 minutes</p>
        <p className="lead">{v.description}</p>
        <ul className="feature-list">
          {v.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <div className="price-block card">
          <p>Ex-showroom {inr(v.basePriceInr)}</p>
          {quote && (
            <>
              <p>
                On-road (insurance + RTO): <strong>{inr(quote.onRoadPriceInr)}</strong>
              </p>
              <p className="muted">
                Indicative EMI {inr(quote.emiInr)}/mo · Insurance {inr(quote.insuranceInr)} · Registration {inr(quote.registrationInr)}
              </p>
            </>
          )}
        </div>
        <section className="inventory-block">
          <h3>In-stock units ({available.length})</h3>
          {available.length === 0 ? (
            <p className="muted">No VIN available — contact dealership for pipeline.</p>
          ) : (
            <ul>
              {available.map((u) => (
                <li key={u.vin}>
                  VIN {u.vin} · {u.color}
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="action-row">
          <Link className="btn btn-primary" to={`/checkout/${v.id}`}>
            Reserve / buy
          </Link>
          <Link className="btn btn-ghost" to="/test-drive" state={{ vehicleId: v.id }}>
            Schedule test drive
          </Link>
        </div>
      </div>
    </article>
  );
}
