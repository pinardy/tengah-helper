import { haptic } from "../lib/haptics";
import { formatRelative, secondsSince } from "../lib/time";

interface Props {
  lastUpdated: Date | null;
  now: Date;
  isFetching: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function LastUpdated({ lastUpdated, now, isFetching, error, onRefresh }: Props) {
  const stale = secondsSince(lastUpdated, now) > 60;
  return (
    <div className={`last-updated ${error ? "has-error" : stale ? "is-stale" : ""}`}>
      <span>
        {error
          ? lastUpdated
            ? `Offline? Showing last data (${formatRelative(lastUpdated, now)})`
            : "Can't reach live timings — check your connection"
          : `Updated ${formatRelative(lastUpdated, now)}`}
        {stale && !error && " — may be stale"}
      </span>
      <button
        className="refresh-btn"
        onClick={() => {
          haptic();
          onRefresh();
        }}
        disabled={isFetching}
        aria-label="Refresh timings"
      >
        {isFetching ? "…" : "↻"}
      </button>
      {/* Announce only connectivity changes — not the per-second timestamp. */}
      <span className="sr-only" role="status" aria-live="assertive">
        {error
          ? lastUpdated
            ? "Live timings unavailable — showing last data"
            : "Can't reach live timings"
          : ""}
      </span>
    </div>
  );
}
