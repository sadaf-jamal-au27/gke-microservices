import { useLocation, Link } from "react-router-dom";

export function CartPage() {
  const location = useLocation();
  const product = location.state?.product as { name: string; price_cents: number } | undefined;
  const total = product?.price_cents ?? 0;

  return (
    <section>
      <h1>Your cart</h1>
      {product ? (
        <div className="card">
          <p>{product.name}</p>
          <p>Total: ${(total / 100).toFixed(2)}</p>
          <Link to="/checkout" state={{ totalCents: total }}>
            Proceed to checkout
          </Link>
        </div>
      ) : (
        <p className="muted">Cart is empty.</p>
      )}
    </section>
  );
}
