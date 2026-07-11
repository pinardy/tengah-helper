export interface NearbyStop {
  code: string;
  name: string;
  road: string;
}

// Bus stops closest to Parc Meadow @ Tengah.
// Edit this list if you find a different stop works better for your block.
export const NEARBY_STOPS: NearbyStop[] = [
  { code: "41009", name: "Tengah Int", road: "Tengah Blvd" },
  { code: "40459", name: "Blk 321", road: "Tengah Blvd" },
  { code: "40451", name: "Blk 306B", road: "Tengah Blvd" },
  { code: "40449", name: "Blk 324B", road: "Tengah Dr" },
  { code: "40401", name: "Blk 224A", road: "Tengah Blvd" },
];
