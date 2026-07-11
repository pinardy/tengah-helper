import type { NextBus } from "../../shared/lta-types";
import { minutesUntil } from "../lib/time";

const LOAD_CLASS: Record<string, string> = {
  SEA: "load-sea",
  SDA: "load-sda",
  LSD: "load-lsd",
};

interface Props {
  bus: NextBus | undefined;
  now: Date;
  showMarkers?: boolean;
}

export function ArrivalBadge({ bus, now, showMarkers = false }: Props) {
  const mins = bus ? minutesUntil(bus.EstimatedArrival, now) : null;
  if (mins === null) {
    return <span className="badge badge-empty">—</span>;
  }
  const loadClass = LOAD_CLASS[bus!.Load] ?? "load-sea";
  return (
    <span className={`badge ${loadClass}`}>
      {mins === 0 ? "Arr" : mins}
      {showMarkers && bus!.Type === "DD" && <span className="marker" title="Double deck">⇈</span>}
      {showMarkers && bus!.Feature === "WAB" && (
        <span className="marker" title="Wheelchair accessible">♿</span>
      )}
    </span>
  );
}
