import { useEffect, useState } from "react";
import { automobileApi } from "../api/automobile";

export function LiveStatsBar() {
  const [text, setText] = useState("Loading inventory from database…");
  const [ok, setOk] = useState(true);

  useEffect(() => {
    const load = () =>
      automobileApi
        .realtime()
        .then((s) => {
          setOk(true);
          setText(
            `${s.unitsInStock} units in stock · ${s.vehiclesListed} models · ${s.testDrivesToday} test drives today · ${s.openOrders} open orders`
          );
        })
        .catch(() => {
          setOk(false);
          setText("Backend unavailable — run ./scripts/dev-automobile.sh (PostgreSQL + APIs)");
        });
    load();
    const id = setInterval(load, 12000);
    return () => clearInterval(id);
  }, []);

  return <div className={`live-bar ${ok ? "live-ok" : "live-err"}`}>{text}</div>;
}
