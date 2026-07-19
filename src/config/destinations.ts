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

export interface RouteOption {
  serviceNo: string;
  boardStopCode: string;
  boardStopName: string;
  alightStop: string;
  /** Approx. minutes spent on the bus; powers the "arrive ~HH:MM" estimate. */
  rideMins: number;
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
        notes: "Express, weekdays only",
        rank: 1,
      },
      {
        serviceNo: "97",
        ...BLK_306B,
        alightStop: "Shenton Way / Marina Centre",
        rideMins: 55,
        notes: "Runs daily",
        rank: 2,
      },
      {
        serviceNo: "674",
        ...BLK_306B,
        alightStop: "Marina Boulevard",
        rideMins: 45,
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
        serviceNo: "181",
        ...BLK_306B,
        alightStop: "Boon Lay Int",
        rideMins: 20,
        notes: "Then EWL 1 stop to Lakeside",
        rank: 1,
      },
      {
        serviceNo: "870",
        ...BLK_306B,
        alightStop: "Jurong Town Hall Int",
        rideMins: 25,
        notes: "Then EWL from Jurong East, 2 stops to Chinese Garden",
        rank: 2,
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
