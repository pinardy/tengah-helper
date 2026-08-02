import type { BusArrivalResponse } from "../../shared/lta-types";
import type { NearbyStop } from "../config/stops";
import { ServiceRow } from "./ServiceRow";

interface Props {
  stop: NearbyStop;
  arrivals: BusArrivalResponse | undefined;
  now: Date;
  isHomeStop?: boolean;
  /** A live fetch failed and this stop has no data to show. */
  connectionError?: boolean;
  /** Rain now / rain likely — leave hints show ☔ instead of 🚶. */
  umbrella?: boolean;
  isFavourite: (stopCode: string, serviceNo: string) => boolean;
  onToggleFavourite: (stopCode: string, serviceNo: string) => void;
  onSelectService: (serviceNo: string) => void;
}

function byServiceNo(a: string, b: string): number {
  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);
  if (numA !== numB) return numA - numB;
  return a.localeCompare(b);
}

/** Google Maps walking directions from the user's location to this stop. */
function stopDirectionsUrl(stop: NearbyStop): string {
  const q = encodeURIComponent(`${stop.name}, ${stop.road}, Singapore`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=walking`;
}

export function StopCard({
  stop,
  arrivals,
  now,
  isHomeStop,
  connectionError,
  umbrella,
  isFavourite,
  onToggleFavourite,
  onSelectService,
}: Props) {
  const services = arrivals
    ? [...arrivals.Services].sort((a, b) => byServiceNo(a.ServiceNo, b.ServiceNo))
    : null;

  return (
    <section className={`card ${isHomeStop ? "card-home" : ""}`}>
      <header className="card-header">
        <h2>
          {isHomeStop && <span className="home-pin" title="Your stop">📍</span>}
          {stop.name}
        </h2>
        <span className="card-sub">
          {stop.road} · {stop.walkMins} min walk · {stop.code}
        </span>
        <a
          className="stop-map-link"
          href={stopDirectionsUrl(stop)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Walking directions to ${stop.name}`}
          title="Walking directions"
        >
          🗺️
        </a>
      </header>
      {services === null && (
        <p className="card-note">
          {connectionError ? "Can't reach live timings — check your connection" : "Loading…"}
        </p>
      )}
      {services !== null && services.length === 0 && (
        <p className="card-note">No buses in service</p>
      )}
      {services !== null &&
        services.map((service) => (
          <ServiceRow
            key={service.ServiceNo}
            service={service}
            now={now}
            walkMins={stop.walkMins}
            showLastBus
            umbrella={umbrella}
            isFavourite={isFavourite(stop.code, service.ServiceNo)}
            onToggleFavourite={() => onToggleFavourite(stop.code, service.ServiceNo)}
            onSelectService={onSelectService}
          />
        ))}
    </section>
  );
}
