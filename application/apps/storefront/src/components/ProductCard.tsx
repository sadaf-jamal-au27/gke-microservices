import { Link } from "react-router-dom";
import type { Product } from "../api/client";

export function ProductCard({ product }: { product: Product }) {
  const price = (product.price_cents / 100).toFixed(2);
  return (
    <article className="card">
      <h3>{product.name}</h3>
      <p className="muted">{product.sku}</p>
      <p className="price">
        {product.currency} {price}
      </p>
      <p>In stock: {product.stock}</p>
      <Link to="/cart" state={{ product }}>
        Add to cart
      </Link>
    </article>
  );
}
