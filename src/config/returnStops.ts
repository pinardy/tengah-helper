// Boarding points for the trip BACK to Tengah, with only the Tengah-bound
// services shown (these interchanges serve dozens of other routes).
// Stop codes and services verified against live LTA data (July 2026);
// 871's return boarding point is Beauty World Stn Exit C (last bus 00:48).

export interface ReturnStop {
  code: string;
  name: string;
  place: string;
  services: string[];
}

export const RETURN_STOPS: ReturnStop[] = [
  { code: "43009", name: "Bukit Batok Int", place: "From Bukit Batok", services: ["992"] },
  {
    code: "29009",
    name: "Jurong Town Hall Int",
    place: "From Jurong East",
    services: ["870"],
  },
  {
    code: "22009",
    name: "Boon Lay Int",
    place: "From Boon Lay / Jurong Point",
    services: ["181"],
  },
  {
    code: "42151",
    name: "Beauty World Stn Exit C",
    place: "From Beauty World",
    services: ["871"],
  },
];
