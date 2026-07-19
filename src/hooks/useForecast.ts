import { useEffect, useState } from "react";

// NEA 2-hour weather forecast via data.gov.sg (public, CORS-enabled, no key).
const FORECAST_URL = "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast";
const POLL_MS = 10 * 60_000; // forecast refreshes every ~30 min

// Parc Meadow @ Tengah — pick the forecast area nearest here.
const HOME = { lat: 1.3555, lng: 103.7135 };

interface ForecastResponse {
  data: {
    area_metadata: {
      name: string;
      label_location: { latitude: number; longitude: number };
    }[];
    items: {
      forecasts: { area: string; forecast: string }[];
    }[];
  };
}

export interface ForecastState {
  area: string;
  forecast: string;
  /** The forecast mentions rain/showers within the next 2 hours. */
  willRain: boolean;
}

export function useForecast(): ForecastState | null {
  const [forecast, setForecast] = useState<ForecastState | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchForecast = async () => {
      try {
        const res = await fetch(FORECAST_URL);
        if (!res.ok) return;
        const body = (await res.json()) as ForecastResponse;
        const areas = body.data.area_metadata;
        const forecasts = body.data.items[0]?.forecasts ?? [];
        if (areas.length === 0 || forecasts.length === 0) return;

        const nearest = [...areas].sort(
          (a, b) =>
            (a.label_location.latitude - HOME.lat) ** 2 +
            (a.label_location.longitude - HOME.lng) ** 2 -
            ((b.label_location.latitude - HOME.lat) ** 2 +
              (b.label_location.longitude - HOME.lng) ** 2),
        )[0];

        const text = forecasts.find((f) => f.area === nearest.name)?.forecast ?? "";
        if (!text) return;
        if (!cancelled) {
          setForecast({
            area: nearest.name,
            forecast: text,
            willRain: /rain|shower|thundery/i.test(text),
          });
        }
      } catch {
        // weather is a nice-to-have — stay hidden on any failure
        if (!cancelled) setForecast(null);
      }
    };

    void fetchForecast();
    const id = setInterval(() => {
      if (!document.hidden) void fetchForecast();
    }, POLL_MS);
    const onVisibility = () => {
      if (!document.hidden) void fetchForecast();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return forecast;
}
