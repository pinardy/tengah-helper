import { isWeekend } from "../lib/time";

// Singapore gazetted public holidays (MOM). On these days, weekday-only bus
// services don't run and buses follow the Sunday/PH timetable — so the app
// treats a public holiday like a Sunday. Includes the in-lieu Mondays for
// holidays that fall on a Sunday. Update this list each year from mom.gov.sg.
//
// Dates are local "YYYY-MM-DD" (Singapore has no DST, and the app runs in SGT).
const PUBLIC_HOLIDAYS = new Set<string>([
  // 2026
  "2026-01-01", // New Year's Day
  "2026-02-17", // Chinese New Year
  "2026-02-18", // Chinese New Year
  "2026-03-21", // Hari Raya Puasa
  "2026-04-03", // Good Friday
  "2026-05-01", // Labour Day
  "2026-05-27", // Hari Raya Haji
  "2026-05-31", // Vesak Day
  "2026-06-01", // Vesak Day (in lieu)
  "2026-08-09", // National Day
  "2026-08-10", // National Day (in lieu)
  "2026-11-08", // Deepavali
  "2026-11-09", // Deepavali (in lieu)
  "2026-12-25", // Christmas Day
]);

/** Local calendar date as "YYYY-MM-DD". */
function isoDate(now: Date): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isPublicHoliday(now: Date): boolean {
  return PUBLIC_HOLIDAYS.has(isoDate(now));
}

/**
 * A weekend or Singapore public holiday: the days when weekday-only services
 * don't run and buses follow the Sunday/PH timetable.
 */
export function isServiceHoliday(now: Date): boolean {
  return isWeekend(now) || isPublicHoliday(now);
}
