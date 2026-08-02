import { useState } from "react";

const STORAGE_KEY = "tengah-helper:legend-open";

/**
 * Collapsible key for the badge colours, crowding cue and row markers. Shown
 * on the Nearby screen so a first-time user can decode the timings at a glance.
 * Open/closed state persists across visits.
 */
export function Legend() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const next = e.currentTarget.open;
    setOpen(next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // storage unavailable — state just won't persist
    }
  };

  return (
    <details className="legend" open={open} onToggle={onToggle}>
      <summary>What do the colours and symbols mean?</summary>
      <ul className="legend-list">
        <li>
          <span className="badge load-sea" aria-hidden="true">
            3
          </span>
          <span>Minutes until arrival · green = seats free</span>
        </li>
        <li>
          <span className="badge load-sda" aria-hidden="true">
            5<span className="load-dot">•</span>
          </span>
          <span>Amber (one dot) = standing room</span>
        </li>
        <li>
          <span className="badge load-lsd" aria-hidden="true">
            7<span className="load-dot">••</span>
          </span>
          <span>Red (two dots) = crowded</span>
        </li>
        <li>
          <span className="badge load-sea" aria-hidden="true">
            Arr
          </span>
          <span>Bus is arriving now</span>
        </li>
        <li>
          <span className="badge badge-empty" aria-hidden="true">
            —
          </span>
          <span>No timing / not in service</span>
        </li>
        <li>
          <span aria-hidden="true">⇈ ♿</span>
          <span>Double-deck · wheelchair-accessible</span>
        </li>
        <li>
          <span aria-hidden="true">🚶 🌙 ★</span>
          <span>When to leave · last bus (after 9pm) · pin to top</span>
        </li>
      </ul>
    </details>
  );
}
