import { useMemo } from "react";
import type { BusArrivalResponse } from "../../shared/lta-types";
import { LastUpdated } from "../components/LastUpdated";
import { PullToRefresh } from "../components/PullToRefresh";
import { ServiceRow } from "../components/ServiceRow";
import { RETURN_STOPS, type ReturnStop } from "../config/returnStops";
import { clockTimeIn, minutesUntil } from "../lib/time";
import { useBusArrivals } from "../hooks/useBusArrivals";
import { useNow } from "../hooks/useNow";

interface HomeOption {
  stop: ReturnStop;
  serviceNo: string;
  /** Minutes until the bus leaves the interchange. */
  waitMins: number;
  /** Wait + ride: minutes until you'd reach Tengah. */
  homeMins: number;
}

/** The quickest bus home across every return stop, or null before data. */
function fastestHome(
  data: Record<string, BusArrivalResponse>,
  now: Date,
): HomeOption | null {
  let best: HomeOption | null = null;
  for (const stop of RETURN_STOPS) {
    const arrivals = data[stop.code];
    if (!arrivals) continue;
    for (const service of arrivals.Services) {
      if (!stop.services.includes(service.ServiceNo)) continue;
      const ride = stop.rideMins[service.ServiceNo];
      if (ride == null) continue;
      const wait = minutesUntil(service.NextBus.EstimatedArrival, now);
      if (wait === null) continue;
      const homeMins = wait + ride;
      if (!best || homeMins < best.homeMins) {
        best = { stop, serviceNo: service.ServiceNo, waitMins: wait, homeMins };
      }
    }
  }
  return best;
}

export function GoingHomeScreen() {
  const stopCodes = useMemo(() => RETURN_STOPS.map((s) => s.code), []);
  const { data, lastUpdated, isFetching, error, refresh } = useBusArrivals(stopCodes);
  const now = useNow();
  const best = fastestHome(data, now);

  return (
    <PullToRefresh onRefresh={refresh}>
      <LastUpdated
        lastUpdated={lastUpdated}
        now={now}
        isFetching={isFetching}
        error={error}
        onRefresh={() => void refresh()}
      />
      {best && (
        <section className="card card-best-home">
          <header className="card-header">
            <h2>🏆 Fastest home</h2>
            <span className="card-sub">wait + ride estimate</span>
          </header>
          <p className="best-home-line">
            Bus <span className="service-no">{best.serviceNo}</span> from {best.stop.name} —{" "}
            {best.waitMins === 0 ? "leaving now" : `in ${best.waitMins} min`}, home ~
            {clockTimeIn(best.homeMins, now)}
          </p>
        </section>
      )}
      {RETURN_STOPS.map((stop) => {
        const arrivals = data[stop.code];
        const services = arrivals
          ? arrivals.Services.filter((s) => stop.services.includes(s.ServiceNo))
          : null;
        const isBest = best?.stop.code === stop.code;
        return (
          <section className={`card ${isBest ? "card-home" : ""}`} key={stop.code}>
            <header className="card-header">
              <h2>
                {isBest && <span className="home-pin" title="Fastest home">🏆</span>}
                {stop.place}
              </h2>
              <span className="card-sub">
                {stop.name} · {stop.code}
              </span>
            </header>
            {services === null && (
              <p className="card-note">
                {error ? "Can't reach live timings — check your connection" : "Loading…"}
              </p>
            )}
            {services !== null && services.length === 0 && (
              <p className="card-note">No Tengah-bound buses in service</p>
            )}
            {services?.map((service) => {
              const ride = stop.rideMins[service.ServiceNo];
              const wait = minutesUntil(service.NextBus.EstimatedArrival, now);
              const homeEta =
                ride != null && wait !== null
                  ? `🏠 home ~${clockTimeIn(wait + ride, now)}`
                  : null;
              return (
                <ServiceRow
                  key={service.ServiceNo}
                  service={service}
                  now={now}
                  extraHint={homeEta}
                  lastBusTimes={stop.lastBus?.[service.ServiceNo]}
                />
              );
            })}
          </section>
        );
      })}
    </PullToRefresh>
  );
}
