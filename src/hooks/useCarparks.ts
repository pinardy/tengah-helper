import { useEffect, useState } from "react";
import { NEARBY_CARPARKS } from "../config/carparks";

// HDB carpark availability via data.gov.sg (public, CORS-enabled, no key).
const CARPARK_URL = "https://api.data.gov.sg/v1/transport/carpark-availability";
const POLL_MS = 3 * 60_000;

interface CarparkResponse {
  items: {
    carpark_data: {
      carpark_number: string;
      carpark_info: { total_lots: string; lot_type: string; lots_available: string }[];
    }[];
  }[];
}

export interface CarparkAvailability {
  number: string;
  name: string;
  available: number | null;
  total: number | null;
}

export function useCarparks(): CarparkAvailability[] | null {
  const [carparks, setCarparks] = useState<CarparkAvailability[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCarparks = async () => {
      try {
        const res = await fetch(CARPARK_URL);
        if (!res.ok) return;
        const body = (await res.json()) as CarparkResponse;
        const byNumber = new Map(
          (body.items[0]?.carpark_data ?? []).map((c) => [c.carpark_number, c]),
        );

        const result = NEARBY_CARPARKS.map(({ number, name }) => {
          // Prefer car lots ("C"); fall back to the first lot type reported.
          const info = byNumber.get(number)?.carpark_info;
          const lot = info?.find((l) => l.lot_type === "C") ?? info?.[0];
          return {
            number,
            name,
            available: lot ? Number(lot.lots_available) : null,
            total: lot ? Number(lot.total_lots) : null,
          };
        });
        if (!cancelled) setCarparks(result);
      } catch {
        // parking is a nice-to-have — stay hidden on any failure
        if (!cancelled) setCarparks(null);
      }
    };

    void fetchCarparks();
    const id = setInterval(() => {
      if (!document.hidden) void fetchCarparks();
    }, POLL_MS);
    const onVisibility = () => {
      if (!document.hidden) void fetchCarparks();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return carparks;
}
