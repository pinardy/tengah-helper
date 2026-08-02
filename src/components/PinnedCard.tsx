import type { BusArrivalResponse } from "../../shared/lta-types";
import { NEARBY_STOPS } from "../config/stops";
import { ServiceRow } from "./ServiceRow";

interface Props {
  favouriteKeys: string[];
  data: Record<string, BusArrivalResponse>;
  now: Date;
  umbrella?: boolean;
  onToggle: (stopCode: string, serviceNo: string) => void;
  onSelectService: (serviceNo: string) => void;
}

export function PinnedCard({
  favouriteKeys,
  data,
  now,
  umbrella,
  onToggle,
  onSelectService,
}: Props) {
  if (favouriteKeys.length === 0) return null;

  return (
    <section className="card card-pinned">
      <header className="card-header">
        <h2>★ Pinned</h2>
      </header>
      {favouriteKeys.map((key) => {
        const [stopCode, serviceNo] = key.split(":");
        const stop = NEARBY_STOPS.find((s) => s.code === stopCode);
        if (!stop) return null;
        const service = data[stopCode]?.Services.find((s) => s.ServiceNo === serviceNo);
        if (!service) {
          return (
            <div className="service-row" key={key}>
              <span className="service-label">
                <button
                  className="fav-btn is-fav"
                  onClick={() => onToggle(stopCode, serviceNo)}
                  aria-label="Unpin bus"
                >
                  ★
                </button>
                <span className="service-no">{serviceNo}</span>
                <span className="pinned-stop">{stop.name}</span>
              </span>
              <span className="service-badges">
                <span className="badge badge-empty">no svc</span>
              </span>
            </div>
          );
        }
        // Same row as the stop card below — leave hint, last-bus chip and
        // unreachable dimming included, since pinned rows are glanced at most.
        return (
          <ServiceRow
            key={key}
            service={service}
            now={now}
            walkMins={stop.walkMins}
            showLastBus
            stopLabel={stop.name}
            umbrella={umbrella}
            isFavourite
            onToggleFavourite={() => onToggle(stopCode, serviceNo)}
            onSelectService={onSelectService}
          />
        );
      })}
    </section>
  );
}
