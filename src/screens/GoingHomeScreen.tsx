import { useMemo } from "react";
import { LastUpdated } from "../components/LastUpdated";
import { PullToRefresh } from "../components/PullToRefresh";
import { ServiceRow } from "../components/ServiceRow";
import { RETURN_STOPS } from "../config/returnStops";
import { useBusArrivals } from "../hooks/useBusArrivals";
import { useNow } from "../hooks/useNow";

export function GoingHomeScreen() {
  const stopCodes = useMemo(() => RETURN_STOPS.map((s) => s.code), []);
  const { data, lastUpdated, isFetching, error, refresh } = useBusArrivals(stopCodes);
  const now = useNow();

  return (
    <PullToRefresh onRefresh={refresh}>
      <LastUpdated
        lastUpdated={lastUpdated}
        now={now}
        isFetching={isFetching}
        error={error}
        onRefresh={() => void refresh()}
      />
      {RETURN_STOPS.map((stop) => {
        const arrivals = data[stop.code];
        const services = arrivals
          ? arrivals.Services.filter((s) => stop.services.includes(s.ServiceNo))
          : null;
        return (
          <section className="card" key={stop.code}>
            <header className="card-header">
              <h2>{stop.place}</h2>
              <span className="card-sub">
                {stop.name} · {stop.code}
              </span>
            </header>
            {services === null && <p className="card-note">Loading…</p>}
            {services !== null && services.length === 0 && (
              <p className="card-note">No Tengah-bound buses in service</p>
            )}
            {services?.map((service) => (
              <ServiceRow key={service.ServiceNo} service={service} now={now} />
            ))}
          </section>
        );
      })}
    </PullToRefresh>
  );
}
