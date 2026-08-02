import type { BusService, NextBus } from "../../shared/lta-types";
import {
  isLateEvening,
  lastBusInfo,
  lastBusInfoFrom,
  type LastBusTimes,
} from "../config/lastBus";
import { leaveInMins, minutesUntil } from "../lib/time";
import { ArrivalBadge } from "./ArrivalBadge";
import { ServiceNo } from "./ServiceNo";

interface Props {
  service: BusService;
  now: Date;
  /** Walk minutes to the stop; enables the "leave in N" hint and dims
   *  arrivals that come sooner than you can walk there. */
  walkMins?: number;
  /** Show the outbound last-bus chip (Home screen only — times are outbound). */
  showLastBus?: boolean;
  /** Explicit last-bus times for this row (e.g. return trips); overrides the
   *  outbound LAST_BUS table. */
  lastBusTimes?: LastBusTimes;
  /** Small context label after the service number (e.g. the stop name). */
  stopLabel?: string;
  /** Extra hint chip, e.g. "🏠 home ~23:41" on the Going Home screen. */
  extraHint?: string | null;
  /** Rain now / rain likely — prefixes the leave hint with ☔. */
  umbrella?: boolean;
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

/** Arrives before you could walk there. */
function missed(bus: NextBus | undefined, now: Date, walkMins?: number): boolean {
  if (walkMins == null) return false;
  const arr = minutesUntil(bus?.EstimatedArrival ?? "", now);
  return arr !== null && arr < walkMins;
}

export function ServiceRow({
  service,
  now,
  walkMins,
  showLastBus,
  lastBusTimes,
  stopLabel,
  extraHint,
  umbrella,
  isFavourite,
  onToggleFavourite,
  onSelectService,
}: Props) {
  const hint = walkMins != null ? leaveHint(service, now, walkMins) : null;
  const lastBus = !isLateEvening(now)
    ? null
    : lastBusTimes
      ? lastBusInfoFrom(lastBusTimes, now)
      : showLastBus
        ? lastBusInfo(service.ServiceNo, now)
        : null;

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
          <span className="service-id-line">
            <ServiceNo serviceNo={service.ServiceNo} onSelectService={onSelectService} />
            {stopLabel && <span className="pinned-stop">{stopLabel}</span>}
          </span>
          {(hint || lastBus || extraHint) && (
            <span className="row-hints">
              {hint && (
                <span className="leave-hint">
                  {umbrella ? "☔" : "🚶"} {hint}
                </span>
              )}
              {extraHint && <span className="extra-hint">{extraHint}</span>}
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
        <ArrivalBadge
          bus={service.NextBus}
          now={now}
          showMarkers
          unreachable={missed(service.NextBus, now, walkMins)}
        />
        <ArrivalBadge
          bus={service.NextBus2}
          now={now}
          unreachable={missed(service.NextBus2, now, walkMins)}
        />
        <ArrivalBadge
          bus={service.NextBus3}
          now={now}
          unreachable={missed(service.NextBus3, now, walkMins)}
        />
      </span>
    </div>
  );
}
