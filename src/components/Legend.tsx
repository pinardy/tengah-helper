/**
 * Collapsible key for the badge colours, crowding cue and row markers. Shown
 * on the Nearby screen so a first-time user can decode the timings at a glance.
 */
export function Legend() {
  return (
    <details className="legend">
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
