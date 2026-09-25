import { Routes, Route } from "react-router-dom";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { HomePage } from "./pages/HomePage";
import { VehicleDetailPage } from "./pages/VehicleDetailPage";
import { DealershipsPage } from "./pages/DealershipsPage";
import { TestDrivePage } from "./pages/TestDrivePage";
import { FinancePage } from "./pages/FinancePage";
import { ServicePage } from "./pages/ServicePage";
import { TradeInPage } from "./pages/TradeInPage";
import { CheckoutPage } from "./pages/CheckoutPage";

export function App() {
  return (
    <div className="app">
      <SiteHeader />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
          <Route path="/dealerships" element={<DealershipsPage />} />
          <Route path="/test-drive" element={<TestDrivePage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/trade-in" element={<TradeInPage />} />
          <Route path="/checkout/:vehicleId" element={<CheckoutPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
