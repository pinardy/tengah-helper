// Static "getting around Tengah" facts drawn from LTA's "Your Travel Guide —
// Parc Meadow @ Tengah". These are informational (no live API) — update the
// notes and dates as the estate and the Jurong Region Line (JRL) progress.
//
// Rendered as a single card on the Around tab, below the live cards.

export interface EstateInfoLink {
  label: string;
  href: string;
}

export interface EstateInfo {
  icon: string;
  title: string;
  lines: string[];
  link?: EstateInfoLink;
}

export const ESTATE_INFO: EstateInfo[] = [
  {
    icon: "🚇",
    title: "Jurong Region Line (coming)",
    lines: [
      "When the JRL opens, station JS3 will be about a 10-minute walk from Parc Meadow.",
      "Until then, buses 453/992 reach Bukit Batok (NS2) and 97/870 reach Jurong East (NS1).",
    ],
  },
  {
    icon: "🚲",
    title: "Car-lite Tengah",
    lines: [
      "Cycling paths and park connectors link the estate, with more on the way.",
      "Tengah Link & Tengah Park Ave are bus-only shortcuts — quicker buses, no through traffic.",
    ],
  },
  {
    icon: "🔌",
    title: "EV charging",
    lines: [
      "EV chargers are rolling out to every HDB carpark in Tengah, with a fast-charging hub in each HDB town by end-2027.",
    ],
    link: { label: "Find a charger on MyTransport.SG", href: "https://www.mytransport.sg/" },
  },
  {
    icon: "🚧",
    title: "Road update",
    lines: ["Left turn from Tengah Rd into Bukit Batok Rd opens by 4Q 2026."],
  },
];
