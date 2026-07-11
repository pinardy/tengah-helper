import { useEffect, useState } from "react";

// NEA real-time rainfall via data.gov.sg (public, CORS-enabled, no key).
const RAINFALL_URL = "https://api-open.data.gov.sg/v2/real-time/api/rainfall";
const POLL_MS = 5 * 60_000; // readings update every 5 minutes

// Parc Meadow @ Tengah
const HOME = { lat: 1.3555, lng: 103.7135 };
// Rain is hyper-local and the nearest gauge may be a few km away, so take the
// wettest of the closest few stations.
const NEARBY_STATION_COUNT = 3;

interface RainfallResponse {
  data: {
    stations: {
      id: string;
      name: string;
      location: { latitude: number; longitude: number };
    }[];
    readings: {
      timestamp: string;
      data: { stationId: string; value: number }[];
    }[];
  };
}

export interface RainState {
  raining: boolean;
  /** mm of rain in the last 5-minute reading at the wettest nearby station */
  mm: number;
  station: string;
}

export function useRain(): RainState | null {
  const [rain, setRain] = useState<RainState | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRain = async () => {
      try {
        const res = await fetch(RAINFALL_URL);
        if (!res.ok) return;
        const body = (await res.json()) as RainfallResponse;
        const stations = body.data.stations;
        const readings = body.data.readings[0]?.data ?? [];
        const valueByStation = new Map(readings.map((r) => [r.stationId, r.value]));

        const nearest = [...stations]
          .sort(
            (a, b) =>
              (a.location.latitude - HOME.lat) ** 2 +
              (a.location.longitude - HOME.lng) ** 2 -
              ((b.location.latitude - HOME.lat) ** 2 +
                (b.location.longitude - HOME.lng) ** 2),
          )
          .slice(0, NEARBY_STATION_COUNT);

        let wettest = { mm: 0, station: nearest[0]?.name ?? "" };
        for (const s of nearest) {
          const mm = valueByStation.get(s.id) ?? 0;
          if (mm > wettest.mm) wettest = { mm, station: s.name };
        }
        if (!cancelled) {
          setRain({ raining: wettest.mm > 0, mm: wettest.mm, station: wettest.station });
        }
      } catch {
        // weather is a nice-to-have — stay hidden on any failure
        if (!cancelled) setRain(null);
      }
    };

    void fetchRain();
    const id = setInterval(() => {
      if (!document.hidden) void fetchRain();
    }, POLL_MS);
    const onVisibility = () => {
      if (!document.hidden) void fetchRain();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return rain;
}
