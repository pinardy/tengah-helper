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
      <button className="refresh-btn" onClick={onRefresh} disabled={isFetching}>
        {isFetching ? "…" : "↻"}
      </button>
    </div>
  );
}
