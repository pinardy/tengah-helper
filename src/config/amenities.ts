// Curated everyday essentials for a Parc Meadow @ Tengah resident. Tengah is a
// young estate, so some of these are in neighbouring Bukit Batok / Choa Chu Kang
// until more amenities open. Each entry deep-links to Google Maps by search
// query. Edit freely — this is just a handy directory, no API involved.

export interface Amenity {
  name: string;
  /** Google Maps search query (place name + area). */
  query: string;
  note?: string;
}

export interface AmenityGroup {
  category: string;
  icon: string;
  items: Amenity[];
}

export const AMENITIES: AmenityGroup[] = [
  {
    category: "Supermarket",
    icon: "🛒",
    items: [
      { name: "FairPrice — Le Quest", query: "FairPrice Le Quest Bukit Batok" },
      { name: "Sheng Siong — Tengah", query: "Sheng Siong Tengah", note: "Check latest opening" },
      { name: "FairPrice — Bukit Batok West", query: "FairPrice Bukit Batok West Ave 8" },
    ],
  },
  {
    category: "Clinic / GP",
    icon: "🩺",
    items: [
      { name: "Nearest GP clinic", query: "GP clinic Tengah" },
      { name: "Polyclinic — Bukit Batok", query: "Bukit Batok Polyclinic" },
      { name: "24h A&E — Ng Teng Fong Hospital", query: "Ng Teng Fong General Hospital" },
    ],
  },
  {
    category: "Pharmacy",
    icon: "💊",
    items: [
      { name: "Guardian — Le Quest", query: "Guardian Le Quest Bukit Batok" },
      { name: "Watsons — West Mall", query: "Watsons West Mall Bukit Batok" },
    ],
  },
  {
    category: "Food / Hawker",
    icon: "🍜",
    items: [
      { name: "Tengah coffeeshops", query: "coffeeshop Tengah" },
      { name: "Le Quest Mall eateries", query: "Le Quest Mall food" },
      { name: "Bukit Batok West Market", query: "Bukit Batok West Ave 8 hawker centre" },
    ],
  },
  {
    category: "Bank / ATM",
    icon: "🏧",
    items: [
      { name: "POSB / DBS ATM", query: "DBS POSB ATM Tengah" },
      { name: "ATMs — Le Quest", query: "ATM Le Quest Bukit Batok" },
    ],
  },
];
