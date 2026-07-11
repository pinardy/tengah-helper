import type { BusService } from "../../shared/lta-types";
import { ArrivalBadge } from "./ArrivalBadge";

interface Props {
  service: BusService;
  now: Date;
}

export function ServiceRow({ service, now }: Props) {
  return (
    <div className="service-row">
      <span className="service-no">{service.ServiceNo}</span>
      <span className="service-badges">
        <ArrivalBadge bus={service.NextBus} now={now} showMarkers />
        <ArrivalBadge bus={service.NextBus2} now={now} />
        <ArrivalBadge bus={service.NextBus3} now={now} />
      </span>
    </div>
  );
}
