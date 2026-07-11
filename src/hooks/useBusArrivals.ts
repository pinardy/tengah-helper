import { useCallback, useEffect, useMemo, useState } from "react";
import type { BusArrivalResponse } from "../../shared/lta-types";
import { fetchBusArrival } from "../api/busArrival";

const POLL_MS = 25_000;
const CLIENT_CACHE_MS = 15_000;
const STORAGE_KEY = "tengah-helper:last-arrivals";

interface CacheEntry {
  at: number;
  data: BusArrivalResponse;
}

// Mirrored to localStorage so reopening the app offline still shows the
// last-known timings (with their age) instead of a blank screen.
function loadPersisted(): Map<string, CacheEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return new Map(Object.entries(parsed as Record<string, CacheEntry>));
    }
  } catch {
    // corrupt/unavailable storage — start empty
  }
  return new Map();
}

// Module-level cache shared by all screens, so Home and Destinations polling
// overlapping stops within the same window don't double-fetch.
const stopCache = loadPersisted();

function persistCache() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(stopCache)));
  } catch {
    // storage full/unavailable — arrivals just won't survive a restart
  }
}

export interface BusArrivalsState {
  data: Record<string, BusArrivalResponse>;
  lastUpdated: Date | null;
  isFetching: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useBusArrivals(stopCodes: string[]): BusArrivalsState {
  const key = stopCodes.join(",");
  const codes = useMemo(() => key.split(",").filter(Boolean), [key]);

  const [data, setData] = useState<Record<string, BusArrivalResponse>>(() => {
    const seeded: Record<string, BusArrivalResponse> = {};
    for (const code of codes) {
      const hit = stopCache.get(code);
      if (hit) seeded[code] = hit.data;
    }
    return seeded;
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(() => {
    const stamps = codes.map((code) => stopCache.get(code)?.at ?? 0).filter(Boolean);
    return stamps.length ? new Date(Math.max(...stamps)) : null;
  });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doFetch = useCallback(
    async (force: boolean) => {
      if (codes.length === 0) return;
      setIsFetching(true);
      const results = await Promise.allSettled(
        codes.map(async (code) => {
          const hit = stopCache.get(code);
          if (!force && hit && Date.now() - hit.at < CLIENT_CACHE_MS) return hit.data;
          const fresh = await fetchBusArrival(code);
          stopCache.set(code, { at: Date.now(), data: fresh });
          return fresh;
        }),
      );

      const next: Record<string, BusArrivalResponse> = {};
      let firstError: string | null = null;
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          next[codes[i]] = result.value;
        } else if (!firstError) {
          firstError =
            result.reason instanceof Error ? result.reason.message : String(result.reason);
        }
      });

      // Keep last good data for stops that failed this round.
      if (Object.keys(next).length > 0) {
        setData((prev) => ({ ...prev, ...next }));
        setLastUpdated(new Date());
        persistCache();
      }
      setError(firstError);
      setIsFetching(false);
    },
    [codes],
  );

  const refresh = useCallback(() => doFetch(true), [doFetch]);

  useEffect(() => {
    void doFetch(false);
    const id = setInterval(() => {
      if (!document.hidden) void doFetch(false);
    }, POLL_MS);
    // Refetch immediately when the app returns to the foreground — this is
    // what makes an installed PWA feel live after unlocking the phone.
    const onVisibility = () => {
      if (!document.hidden) void doFetch(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [doFetch]);

  return { data, lastUpdated, isFetching, error, refresh };
}
