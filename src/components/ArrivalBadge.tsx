import type { NextBus } from "../../shared/lta-types";
import { minutesUntil } from "../lib/time";

// Load code → colour class, spoken label, and a non-colour crowding cue
// (dots) so the badge is legible to colour-blind users, not only by hue.
const LOAD_META: Record<string, { cls: string; label: string; dots: string }> = {
  SEA: { cls: "load-sea", label: "seats available", dots: "" },
  SDA: { cls: "load-sda", label: "standing room", dots: "•" },
  LSD: { cls: "load-lsd", label: "crowded", dots: "••" },
};

interface Props {
  bus: NextBus | undefined;
  now: Date;
  showMarkers?: boolean;
}

export function ArrivalBadge({ bus, now, showMarkers = false }: Props) {
  const mins = bus ? minutesUntil(bus.EstimatedArrival, now) : null;
  if (mins === null) {
    return (
      <span className="badge badge-empty" aria-label="no bus timing" title="No timing">
        —
      </span>
    );
  }

  const meta = LOAD_META[bus!.Load] ?? LOAD_META.SEA;
  const isDD = showMarkers && bus!.Type === "DD";
  const isWab = showMarkers && bus!.Feature === "WAB";
  const label = [
    mins === 0 ? "Bus arriving now" : `Bus in ${mins} min`,
    meta.label,
    isDD ? "double deck" : "",
    isWab ? "wheelchair accessible" : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <span className={`badge ${meta.cls}`} aria-label={label} title={label}>
      <span aria-hidden="true">{mins === 0 ? "Arr" : mins}</span>
      {meta.dots && (
        <span className="load-dot" aria-hidden="true">
          {meta.dots}
        </span>
      )}
      {isDD && (
        <span className="marker" aria-hidden="true">
          ⇈
        </span>
      )}
      {isWab && (
        <span className="marker" aria-hidden="true">
          ♿
        </span>
      )}
    </span>
  );
}
