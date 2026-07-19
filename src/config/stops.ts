export interface NearbyStop {
  code: string;
  name: string;
  road: string;
  /** Approx. walking minutes from Parc Meadow to this stop. Used for the
   *  "leave in N min" hint and to pick the default (nearest) home stop.
   *  Tune these to your own block if a stop is closer/further for you. */
  walkMins: number;
}

// Bus stops closest to Parc Meadow @ Tengah.
// Edit this list if you find a different stop works better for your block.
export const NEARBY_STOPS: NearbyStop[] = [
  { code: "41009", name: "Tengah Int", road: "Tengah Blvd", walkMins: 8 },
  { code: "40459", name: "Blk 321", road: "Tengah Blvd", walkMins: 3 },
  { code: "40451", name: "Blk 306B", road: "Tengah Blvd", walkMins: 4 },
  { code: "40449", name: "Blk 324B", road: "Tengah Dr", walkMins: 5 },
  { code: "40401", name: "Blk 224A", road: "Tengah Blvd", walkMins: 7 },
];

/** The nearest stop by walk time — the default "home stop". */
export const NEAREST_STOP_CODE = [...NEARBY_STOPS].sort(
  (a, b) => a.walkMins - b.walkMins,
)[0].code;
