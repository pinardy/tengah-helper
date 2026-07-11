import type { BusService } from "../../shared/lta-types";
import { ArrivalBadge } from "./ArrivalBadge";
import { ServiceNo } from "./ServiceNo";

interface Props {
  service: BusService;
  now: Date;
  isFavourite?: boolean;
  onToggleFavourite?: () => void;
  onSelectService?: (serviceNo: string) => void;
}

export function ServiceRow({
  service,
  now,
  isFavourite,
  onToggleFavourite,
  onSelectService,
}: Props) {
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
        <ServiceNo serviceNo={service.ServiceNo} onSelectService={onSelectService} />
      </span>
      <span className="service-badges">
        <ArrivalBadge bus={service.NextBus} now={now} showMarkers />
        <ArrivalBadge bus={service.NextBus2} now={now} />
        <ArrivalBadge bus={service.NextBus3} now={now} />
      </span>
    </div>
  );
}
