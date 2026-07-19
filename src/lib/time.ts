/** Whole minutes until the ISO timestamp, clamped at 0. Null when absent/invalid. */
export function minutesUntil(iso: string, now: Date): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((t - now.getTime()) / 60_000));
}

export function formatRelative(from: Date | null, now: Date): string {
  if (!from) return "never";
  const secs = Math.max(0, Math.floor((now.getTime() - from.getTime()) / 1000));
  if (secs < 5) return "just now";
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}

export function secondsSince(from: Date | null, now: Date): number {
  if (!from) return Infinity;
  return (now.getTime() - from.getTime()) / 1000;
}

/**
 * Minutes until you should leave to catch a bus arriving in `arrivalMins`,
 * given a `walkMins` walk to the stop. Negative means you can't make it.
 */
export function leaveInMins(arrivalMins: number, walkMins: number): number {
  return arrivalMins - walkMins;
}

/** Saturday or Sunday. (Public holidays aren't detected.) */
export function isWeekend(now: Date): boolean {
  const day = now.getDay();
  return day === 0 || day === 6;
}

/** "HH:MM" clock time for the given date. */
export function clockTime(d: Date): string {
  return d.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false });
}

/** `mins` minutes after `now`, as "HH:MM". */
export function clockTimeIn(mins: number, now: Date): string {
  return clockTime(new Date(now.getTime() + mins * 60_000));
}
