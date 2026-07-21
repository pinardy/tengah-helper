// Curated "best bus" options from Parc Meadow @ Tengah.
//
// Boarding directions were verified against businterchange.net stop listings
// (July 2026): 40451 (Tengah Blvd, Blk 306B) is the OUTBOUND side for almost
// all services — 40459 opposite is mostly the "coming home" side.
// If you ever find a direction is wrong in practice, fix the boardStopCode
// here — this file is the single source of truth for recommendations.
//
// Weekday-only services (452/453/674/97e/871A) simply show no arrivals on
// weekends; their notes call this out so an empty row isn't confusing.
//
// rideMins are rough off-peak estimates of time on the bus (boarding to
// alighting) used for the "arrive ~HH:MM" hint — tune them as you ride.
//
// 2026 network changes reflected here (LTA, effective 8 Mar 2026):
//  - 831G/831W: Tengah's first town feeders (Tower Transit), running daily and
//    looping the estate from Tengah Int to serve the Parc Point neighbourhood
//    centre. 831W runs the loop anti-clockwise, 831G clockwise.
//  - 97/97e: extended to ORIGINATE at Tengah Int (41009), giving a direct link
//    to HarbourFront/CBD. Boarding at the interchange (rather than Blk 306B)
//    means a much better chance of a seat for the long ride.
// Intermediate feeder stop codes near Parc Meadow aren't pinned here — the
// Nearby tab already shows whatever LTA reports live at each stop. Verify
// board stops / times against businterchange.net and tune if they drift.

export interface RouteOption {
  serviceNo: string;
  boardStopCode: string;
  boardStopName: string;
  alightStop: string;
  /** Approx. minutes spent on the bus; powers the "arrive ~HH:MM" estimate. */
  rideMins: number;
  /** Service doesn't run on Sat/Sun — shows "not today" instead of "no svc"
   *  on weekends. (Public holidays aren't detected; they read as weekdays.) */
  weekdayOnly?: boolean;
  notes?: string;
  /** 1 = usually the best option; used as tiebreaker after soonest arrival */
  rank: number;
}

export interface Destination {
  id: string;
  name: string;
  icon: string;
  options: RouteOption[];
}

const BLK_306B = { boardStopCode: "40451", boardStopName: "Tengah Blvd (Blk 306B)" };
const TENGAH_INT = { boardStopCode: "41009", boardStopName: "Tengah Int" };

/** Destinations reachable by a service, in DESTINATIONS order. */
export function destinationIdsForService(serviceNo: string): string[] {
  return DESTINATIONS.filter((d) => d.options.some((o) => o.serviceNo === serviceNo)).map(
    (d) => d.id,
  );
}

/** Destinations reachable by a service, paired with that service's route option. */
export function destinationsForService(
  serviceNo: string,
): { destination: Destination; option: RouteOption }[] {
  return DESTINATIONS.flatMap((destination) => {
    const option = destination.options.find((o) => o.serviceNo === serviceNo);
    return option ? [{ destination, option }] : [];
  });
}

export const DESTINATIONS: Destination[] = [
  {
    id: "parc-point",
    name: "Parc Point / around Tengah",
    icon: "🏘️",
    options: [
      {
        serviceNo: "831W",
        ...TENGAH_INT,
        alightStop: "Parc Point NC / Tengah Polyclinic",
        rideMins: 8,
        notes: "Town feeder — anti-clockwise loop, daily",
        rank: 1,
      },
      {
        serviceNo: "831G",
        ...TENGAH_INT,
        alightStop: "Parc Point NC / Tengah Polyclinic",
        rideMins: 8,
        notes: "Town feeder — clockwise loop, daily",
        rank: 2,
      },
    ],
  },
  {
    id: "jurong-east",
    name: "Jurong East (JEM / Westgate / IMM)",
    icon: "🛍️",
    options: [
      {
        serviceNo: "870",
        ...BLK_306B,
        alightStop: "Jurong Town Hall Int",
        rideMins: 25,
        notes: "Walk to JEM/Westgate via J-Walk link",
        rank: 1,
      },
      {
        serviceNo: "872",
        ...BLK_306B,
        alightStop: "Jurong East Stn / Jurong Gateway",
        rideMins: 30,
        notes: "Loop via Jurong East St 32",
        rank: 2,
      },
    ],
  },
  {
    id: "bukit-batok",
    name: "Bukit Batok MRT / West Mall",
    icon: "🚇",
    options: [
      {
        serviceNo: "992",
        ...BLK_306B,
        alightStop: "Bukit Batok Int",
        rideMins: 15,
        notes: "Runs daily",
        rank: 1,
      },
      {
        serviceNo: "453",
        ...BLK_306B,
        alightStop: "Bukit Batok MRT",
        rideMins: 20,
        weekdayOnly: true,
        notes: "Weekdays only",
        rank: 2,
      },
    ],
  },
  {
    id: "cbd",
    name: "CBD / Raffles Place",
    icon: "🏙️",
    options: [
      {
        serviceNo: "97e",
        ...BLK_306B,
        alightStop: "Shenton Way / Marina Centre",
        rideMins: 40,
        weekdayOnly: true,
        notes: "Express — now starts at Tengah Int; weekdays only",
        rank: 1,
      },
      {
        serviceNo: "97",
        ...BLK_306B,
        alightStop: "Shenton Way / Marina Centre",
        rideMins: 55,
        notes: "Now starts at Tengah Int — board there for a seat; daily",
        rank: 2,
      },
      {
        serviceNo: "674",
        ...BLK_306B,
        alightStop: "Marina Boulevard",
        rideMins: 45,
        weekdayOnly: true,
        notes: "City Direct — weekday peak only",
        rank: 3,
      },
    ],
  },
  {
    id: "lakeside",
    name: "Chinese Garden / Lakeside",
    icon: "🏞️",
    options: [
      {
        serviceNo: "872",
        ...BLK_306B,
        alightStop: "Chinese Garden Stn (EW25)",
        rideMins: 30,
        notes: "Direct to Chinese Garden MRT — no transfer (LTA guide)",
        rank: 1,
      },
      {
        serviceNo: "181",
        ...BLK_306B,
        alightStop: "Boon Lay Int",
        rideMins: 20,
        notes: "Then EWL 1 stop to Lakeside",
        rank: 2,
      },
      {
        serviceNo: "870",
        ...BLK_306B,
        alightStop: "Jurong Town Hall Int",
        rideMins: 25,
        notes: "Then EWL from Jurong East, 2 stops to Chinese Garden",
        rank: 3,
      },
    ],
  },
  {
    id: "beauty-world",
    name: "Beauty World (DTL)",
    icon: "🌳",
    options: [
      {
        serviceNo: "871",
        ...BLK_306B,
        alightStop: "Beauty World Stn",
        rideMins: 25,
        notes: "Loop service, runs daily",
        rank: 1,
      },
      {
        serviceNo: "452",
        ...BLK_306B,
        alightStop: "Beauty World MRT",
        rideMins: 30,
        weekdayOnly: true,
        notes: "Weekdays only",
        rank: 2,
      },
    ],
  },
  {
    id: "jurong-point",
    name: "Jurong Point / Boon Lay",
    icon: "🛒",
    options: [
      {
        serviceNo: "181",
        ...BLK_306B,
        alightStop: "Boon Lay Int",
        rideMins: 20,
        notes: "Jurong Point is directly above the interchange",
        rank: 1,
      },
    ],
  },
  {
    id: "ntfgh",
    name: "Ng Teng Fong Hospital",
    icon: "🏥",
    options: [
      {
        serviceNo: "870",
        ...BLK_306B,
        alightStop: "Jurong Town Hall Int",
        rideMins: 25,
        notes: "5-min walk via J-Walk to the hospital",
        rank: 1,
      },
    ],
  },
];
