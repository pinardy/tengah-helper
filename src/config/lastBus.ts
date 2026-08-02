// Approximate last-bus departure times from the Tengah boarding stops, so the
// app can warn you before you get stranded late at night.
//
// These are ESTIMATES — verify against the pole timetable or businterchange.net
// for your stop and update here; this file is the single source of truth. Times
// are the last departure clock time (24h "HH:MM") by day type. Omit a service to
// show no indicator for it.

import { isPublicHoliday } from "./holidays";

export interface LastBusTimes {
  weekday: string;
  sat: string;
  sun: string;
}

export const LAST_BUS: Record<string, LastBusTimes> = {
  "870": { weekday: "23:20", sat: "23:20", sun: "23:20" },
  "872": { weekday: "23:00", sat: "23:00", sun: "23:00" },
  "992": { weekday: "23:30", sat: "23:30", sun: "23:30" },
  "97": { weekday: "23:00", sat: "23:00", sun: "23:00" },
  "181": { weekday: "23:40", sat: "23:40", sun: "23:40" },
  "871": { weekday: "23:30", sat: "23:30", sun: "23:30" },
};

export interface LastBusInfo {
  /** "HH:MM" of the last departure for today. */
  time: string;
  /** The last bus has already departed for the day. */
  ended: boolean;
  /** The last bus is within ~45 min (or already gone). */
  soon: boolean;
}

/** Late-evening window where showing last-bus info is useful (21:00 until the
 *  small hours, since some return services run past midnight). */
export function isLateEvening(now: Date): boolean {
  const h = now.getHours();
  return h >= 21 || h < 3;
}

/** Resolve today's last-bus info from a set of day-type times. */
export function lastBusInfoFrom(entry: LastBusTimes, now: Date): LastBusInfo | null {
  const day = now.getDay(); // 0 = Sun, 6 = Sat
  // Public holidays follow the Sunday timetable.
  const time =
    isPublicHoliday(now) || day === 0 ? entry.sun : day === 6 ? entry.sat : entry.weekday;
  if (!time) return null;

  const [h, m] = time.split(":").map(Number);
  const last = new Date(now);
  last.setHours(h, m, 0, 0);
  // A past-midnight time like "00:48" belongs to tonight: bump it to tomorrow
  // unless we're already in the small hours ourselves.
  if (h < 4 && now.getHours() >= 4) last.setDate(last.getDate() + 1);
  const minsUntil = (last.getTime() - now.getTime()) / 60_000;
  return { time, ended: minsUntil < 0, soon: minsUntil < 45 };
}

export function lastBusInfo(serviceNo: string, now: Date): LastBusInfo | null {
  const entry = LAST_BUS[serviceNo];
  return entry ? lastBusInfoFrom(entry, now) : null;
}
