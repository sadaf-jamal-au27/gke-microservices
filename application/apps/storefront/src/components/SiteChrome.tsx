import { Link, NavLink } from "react-router-dom";
import { LiveStatsBar } from "./LiveStatsBar";

const links = [
  { to: "/", label: "New cars" },
  { to: "/dealerships", label: "Dealerships" },
  { to: "/test-drive", label: "Test drive" },
  { to: "/finance", label: "Finance" },
  { to: "/service", label: "Service" },
  { to: "/trade-in", label: "Sell / exchange" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">AD</span>
          <span>
            AutoDrive <em>Motors</em>
          </span>
        </Link>
        <nav className="nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} end={l.to === "/"}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <LiveStatsBar />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <strong>AutoDrive Motors</strong>
          <p>Authorized multi-brand retailer. Prices ex-showroom; on-road calculated per RTO norms.</p>
        </div>
        <div>
          <strong>Support</strong>
          <p>1800-400-1001 · support@autodrive.example</p>
        </div>
      </div>
    </footer>
  );
}
