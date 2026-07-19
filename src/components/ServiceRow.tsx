import type { BusService } from "../../shared/lta-types";
import { isLateEvening, lastBusInfo } from "../config/lastBus";
import { leaveInMins, minutesUntil } from "../lib/time";
import { ArrivalBadge } from "./ArrivalBadge";
import { ServiceNo } from "./ServiceNo";

interface Props {
  service: BusService;
  now: Date;
  /** Walk minutes to the stop; enables the "leave in N" hint. */
  walkMins?: number;
  /** Show the outbound last-bus chip (Home screen only — times are outbound). */
  showLastBus?: boolean;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
  onSelectService?: (serviceNo: string) => void;
}

/** "leave in N min" for the soonest bus you can still walk to catch. */
function leaveHint(service: BusService, now: Date, walkMins: number): string | null {
  for (const bus of [service.NextBus, service.NextBus2, service.NextBus3]) {
    const arr = minutesUntil(bus?.EstimatedArrival ?? "", now);
    if (arr === null) continue;
    const leave = leaveInMins(arr, walkMins);
    if (leave >= 0) return leave === 0 ? "leave now" : `leave in ${leave}m`;
  }
  return null;
}

export function ServiceRow({
  service,
  now,
  walkMins,
  showLastBus,
  isFavourite,
  onToggleFavourite,
  onSelectService,
}: Props) {
  const hint = walkMins != null ? leaveHint(service, now, walkMins) : null;
  const lastBus =
    showLastBus && isLateEvening(now) ? lastBusInfo(service.ServiceNo, now) : null;

  return (
    <div className="service-row">
      <span className="service-label">
        {onToggleFavourite && (
          <button
            className={`fav-btn ${isFavourite ? "is-fav" : ""}`}
            onClick={onToggleFavourite}
            aria-label={isFavourite ? "Unpin bus" : "Pin bus"}
          >
            {isFavourite ? "★" : "☆"}
          </button>
        )}
        <span className="service-id">
          <ServiceNo serviceNo={service.ServiceNo} onSelectService={onSelectService} />
          {(hint || lastBus) && (
            <span className="row-hints">
              {hint && <span className="leave-hint">🚶 {hint}</span>}
              {lastBus && (
                <span className={`last-bus ${lastBus.ended ? "is-gone" : lastBus.soon ? "is-soon" : ""}`}>
                  🌙 {lastBus.ended ? "last bus gone" : `last ${lastBus.time}`}
                </span>
              )}
            </span>
          )}
        </span>
      </span>
      <span className="service-badges">
        <ArrivalBadge bus={service.NextBus} now={now} showMarkers />
        <ArrivalBadge bus={service.NextBus2} now={now} />
        <ArrivalBadge bus={service.NextBus3} now={now} />
      </span>
    </div>
  );
}
