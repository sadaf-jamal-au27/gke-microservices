import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { automobileApi, inr } from "../api/automobile";

export function CheckoutPage() {
  const { vehicleId } = useParams();
  const [quote, setQuote] = useState<{ onRoadPriceInr: number } | null>(null);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (vehicleId) automobileApi.priceQuote(vehicleId).then(setQuote);
  }, [vehicleId]);

  async function placeOrder() {
    if (!vehicleId || !quote) return;
    const r = await automobileApi.checkout({
      customerId: "demo-customer",
      vehicleId,
      dealershipId: "d-mum-01",
      onRoadPriceInr: quote.onRoadPriceInr,
    });
    setOrderId(r.order.id);
  }

  return (
    <section className="form-page">
      <h1>Complete booking</h1>
      {quote ? <p>On-road amount: {inr(quote.onRoadPriceInr)}</p> : <p>Loading quote…</p>}
      <button type="button" onClick={placeOrder}>
        Confirm order
      </button>
      {orderId && <p className="success">Order placed: {orderId}</p>}
    </section>
  );
}
