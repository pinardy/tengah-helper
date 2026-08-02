import type { BusArrivalResponse, BusService } from "../../shared/lta-types";
import type { Destination, RouteOption } from "../config/destinations";
import { isServiceHoliday } from "../config/holidays";
import { NEARBY_STOPS } from "../config/stops";
import { clockTimeIn, minutesUntil } from "../lib/time";
import { ArrivalBadge } from "./ArrivalBadge";
import { ServiceNo } from "./ServiceNo";

interface Props {
  destination: Destination;
  data: Record<string, BusArrivalResponse>;
  now: Date;
  highlightServiceNo?: string | null;
  /** Rain now / rain likely — prefixes leave hints with ☔. */
  umbrella?: boolean;
  /** Tapping a service number lists every destination that bus reaches. */
  onSelectService?: (serviceNo: string) => void;
}

interface ResolvedOption {
  option: RouteOption;
  service: BusService | undefined;
  /** Soonest displayed arrival (badge 1). */
  nextMins: number | null;
  /** Soonest arrival you can actually walk to catch — powers ETA + hint.
   *  Falls back to nextMins when the walk time is unknown. */
  catchableMins: number | null;
  walkMins: number | undefined;
  leave: string | null;
}

function resolve(
  option: RouteOption,
  data: Record<string, BusArrivalResponse>,
  now: Date,
): ResolvedOption {
  const service = data[option.boardStopCode]?.Services.find(
    (s) => s.ServiceNo === option.serviceNo,
  );
  const walkMins = NEARBY_STOPS.find((s) => s.code === option.boardStopCode)?.walkMins;
  const nextMins = service ? minutesUntil(service.NextBus.EstimatedArrival, now) : null;

  // First arrival that's still catchable given the walk to the board stop.
  let catchableMins: number | null = null;
  if (service) {
    for (const bus of [service.NextBus, service.NextBus2, service.NextBus3]) {
      const mins = minutesUntil(bus?.EstimatedArrival ?? "", now);
      if (mins === null) continue;
      if (walkMins == null || mins >= walkMins) {
        catchableMins = mins;
        break;
      }
    }
  }

  const leave =
    catchableMins !== null && walkMins != null
      ? catchableMins - walkMins === 0
        ? "leave now"
        : `leave in ${catchableMins - walkMins}m`
      : null;

  return { option, service, nextMins, catchableMins, walkMins, leave };
}

export function DestinationCard({
  destination,
  data,
  now,
  highlightServiceNo,
  umbrella,
  onSelectService,
}: Props) {
  const resolved = destination.options.map((option) => resolve(option, data, now));

  // Soonest *catchable* bus first; config rank breaks ties and orders
  // no-arrival options.
  resolved.sort((a, b) => {
    const aMins = a.catchableMins ?? Infinity;
    const bMins = b.catchableMins ?? Infinity;
    if (aMins !== bMins) return aMins - bMins;
    return a.option.rank - b.option.rank;
  });

  return (
    <section className="card">
      <header className="card-header">
        <h2>
          <span className="dest-icon">{destination.icon}</span> {destination.name}
        </h2>
      </header>
      {resolved.map(({ option, service, catchableMins, walkMins, leave }, i) => (
        <div
          key={`${option.serviceNo}-${option.boardStopCode}`}
          className={`option-row ${i === 0 && catchableMins !== null ? "option-best" : ""} ${
            option.serviceNo === highlightServiceNo ? "option-focus" : ""
          }`}
        >
          <div className="option-main">
            <ServiceNo serviceNo={option.serviceNo} onSelectService={onSelectService} />
            <div className="option-details">
              <span className="option-board">from {option.boardStopName}</span>
              <span className="option-alight">
                alight {option.alightStop}
                {option.notes ? ` · ${option.notes}` : ""}
              </span>
              {catchableMins !== null && (
                <span
                  className="option-eta"
                  title={`Based on the next bus you can walk to catch (~${option.rideMins} min ride)`}
                >
                  arrive ~{clockTimeIn(catchableMins + option.rideMins, now)}
                  {leave && (
                    <span className="option-leave">{` · ${umbrella ? "☔" : "🚶"} ${leave}`}</span>
                  )}
                </span>
              )}
            </div>
          </div>
          <span className="service-badges">
            {service ? (
              <>
                <ArrivalBadge
                  bus={service.NextBus}
                  now={now}
                  showMarkers
                  unreachable={
                    walkMins != null &&
                    (minutesUntil(service.NextBus.EstimatedArrival, now) ?? Infinity) <
                      walkMins
                  }
                />
                <ArrivalBadge
                  bus={service.NextBus2}
                  now={now}
                  unreachable={
                    walkMins != null &&
                    (minutesUntil(service.NextBus2?.EstimatedArrival ?? "", now) ??
                      Infinity) < walkMins
                  }
                />
              </>
            ) : option.weekdayOnly && isServiceHoliday(now) ? (
              <span className="badge badge-empty" title="Runs Mon–Fri, excluding public holidays">
                Mon–Fri only
              </span>
            ) : (
              <span className="badge badge-empty">no svc</span>
            )}
          </span>
        </div>
      ))}
    </section>
  );
}
