import type { BusArrivalResponse, BusService } from "../../shared/lta-types";
import type { Destination, RouteOption } from "../config/destinations";
import { clockTimeIn, minutesUntil } from "../lib/time";
import { ArrivalBadge } from "./ArrivalBadge";
import { ServiceNo } from "./ServiceNo";

interface Props {
  destination: Destination;
  data: Record<string, BusArrivalResponse>;
  now: Date;
  highlightServiceNo?: string | null;
  /** Tapping a service number lists every destination that bus reaches. */
  onSelectService?: (serviceNo: string) => void;
}

interface ResolvedOption {
  option: RouteOption;
  service: BusService | undefined;
  nextMins: number | null;
}

export function DestinationCard({
  destination,
  data,
  now,
  highlightServiceNo,
  onSelectService,
}: Props) {
  const resolved: ResolvedOption[] = destination.options.map((option) => {
    const service = data[option.boardStopCode]?.Services.find(
      (s) => s.ServiceNo === option.serviceNo,
    );
    return {
      option,
      service,
      nextMins: service ? minutesUntil(service.NextBus.EstimatedArrival, now) : null,
    };
  });

  // Soonest bus first; config rank breaks ties and orders no-arrival options.
  resolved.sort((a, b) => {
    const aMins = a.nextMins ?? Infinity;
    const bMins = b.nextMins ?? Infinity;
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
      {resolved.map(({ option, service, nextMins }, i) => (
        <div
          key={`${option.serviceNo}-${option.boardStopCode}`}
          className={`option-row ${i === 0 && nextMins !== null ? "option-best" : ""} ${
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
              {nextMins !== null && (
                <span
                  className="option-eta"
                  title={`~${option.rideMins} min ride after boarding`}
                >
                  arrive ~{clockTimeIn(nextMins + option.rideMins, now)}
                </span>
              )}
            </div>
          </div>
          <span className="service-badges">
            {service ? (
              <>
                <ArrivalBadge bus={service.NextBus} now={now} showMarkers />
                <ArrivalBadge bus={service.NextBus2} now={now} />
              </>
            ) : (
              <span className="badge badge-empty">no svc</span>
            )}
          </span>
        </div>
      ))}
    </section>
  );
}
