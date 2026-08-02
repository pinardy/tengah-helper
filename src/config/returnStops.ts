// Boarding points for the trip BACK to Tengah, with only the Tengah-bound
// services shown (these interchanges serve dozens of other routes).
// Stop codes and services verified against live LTA data (July 2026);
// 871's return boarding point is Beauty World Stn Exit C (last bus 00:48).

import type { LastBusTimes } from "./lastBus";

export interface ReturnStop {
  code: string;
  name: string;
  place: string;
  services: string[];
  /** Rough minutes on the bus back to Tengah, per service — powers the
   *  "fastest home" pick. Mirrors the outbound rideMins estimates; tune as
   *  you ride. Omit a service to exclude it from the comparison. */
  rideMins: Record<string, number>;
  /** Last departure back to Tengah, per service, by day type — shown as the
   *  🌙 chip late at night, when "am I about to get stranded out here?" is
   *  the question that matters. 871's 00:48 was verified (July 2026); the
   *  rest are conservative ESTIMATES — check the pole timetable /
   *  businterchange.net and tune. */
  lastBus?: Record<string, LastBusTimes>;
}

export const RETURN_STOPS: ReturnStop[] = [
  {
    code: "43009",
    name: "Bukit Batok Int",
    place: "From Bukit Batok",
    services: ["992"],
    rideMins: { "992": 15 },
    lastBus: { "992": { weekday: "23:50", sat: "23:50", sun: "23:50" } },
  },
  {
    code: "29009",
    name: "Jurong Town Hall Int",
    place: "From Jurong East",
    services: ["870"],
    rideMins: { "870": 25 },
    lastBus: { "870": { weekday: "23:45", sat: "23:45", sun: "23:45" } },
  },
  {
    code: "22009",
    name: "Boon Lay Int",
    place: "From Boon Lay / Jurong Point",
    services: ["181"],
    rideMins: { "181": 20 },
    lastBus: { "181": { weekday: "23:55", sat: "23:55", sun: "23:55" } },
  },
  {
    code: "42151",
    name: "Beauty World Stn Exit C",
    place: "From Beauty World",
    services: ["871"],
    rideMins: { "871": 25 },
    lastBus: { "871": { weekday: "00:48", sat: "00:48", sun: "00:48" } },
  },
];
