import type { BusArrivalResponse } from "../../shared/lta-types";
import type { NearbyStop } from "../config/stops";
import { ServiceRow } from "./ServiceRow";

interface Props {
  stop: NearbyStop;
  arrivals: BusArrivalResponse | undefined;
  now: Date;
}

function byServiceNo(a: string, b: string): number {
  const numA = parseInt(a, 10);
  const numB = parseInt(b, 10);
  if (numA !== numB) return numA - numB;
  return a.localeCompare(b);
}

export function StopCard({ stop, arrivals, now }: Props) {
  const services = arrivals
    ? [...arrivals.Services].sort((a, b) => byServiceNo(a.ServiceNo, b.ServiceNo))
    : null;

  return (
    <section className="card">
      <header className="card-header">
        <h2>{stop.name}</h2>
        <span className="card-sub">
          {stop.road} · {stop.code}
        </span>
      </header>
      {services === null && <p className="card-note">Loading…</p>}
      {services !== null && services.length === 0 && (
        <p className="card-note">No buses in service</p>
      )}
      {services !== null &&
        services.map((service) => (
          <ServiceRow key={service.ServiceNo} service={service} now={now} />
        ))}
    </section>
  );
}
