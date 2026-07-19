// HDB carparks near Parc Meadow, for gauging visitor parking at a glance.
//
// `number` is the HDB carpark number used by the data.gov.sg carpark
// availability feed. Find yours by searching that dataset (or the HDB carpark
// finder) for your block — these are best-guess placeholders for the Tengah
// area and should be verified/replaced. Unknown numbers simply show "no data".

export interface Carpark {
  number: string;
  name: string;
}

export const NEARBY_CARPARKS: Carpark[] = [
  { number: "T1", name: "Plantation Grove MSCP" },
  { number: "T2", name: "Parc Meadow area" },
  { number: "BK41", name: "Bukit Batok West (nearby)" },
];
