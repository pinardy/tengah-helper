import type { BusArrivalResponse } from "../../shared/lta-types";
import { NEARBY_STOPS } from "../config/stops";
import { ArrivalBadge } from "./ArrivalBadge";

interface Props {
  favouriteKeys: string[];
  data: Record<string, BusArrivalResponse>;
  now: Date;
  onToggle: (stopCode: string, serviceNo: string) => void;
}

export function PinnedCard({ favouriteKeys, data, now, onToggle }: Props) {
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
              {service ? (
                <>
                  <ArrivalBadge bus={service.NextBus} now={now} showMarkers />
                  <ArrivalBadge bus={service.NextBus2} now={now} />
                  <ArrivalBadge bus={service.NextBus3} now={now} />
                </>
              ) : (
                <span className="badge badge-empty">no svc</span>
              )}
            </span>
          </div>
        );
      })}
    </section>
  );
}
