import { useCallback, useState } from "react";

const STORAGE_KEY = "tengah-helper:favourites";

/** Favourites are stored as "stopCode:serviceNo" keys, in pin order. */
function load(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((k): k is string => typeof k === "string") : [];
  } catch {
    return [];
  }
}

export function favouriteKey(stopCode: string, serviceNo: string): string {
  return `${stopCode}:${serviceNo}`;
}

export function useFavourites() {
  const [keys, setKeys] = useState<string[]>(load);

  const toggle = useCallback((stopCode: string, serviceNo: string) => {
    setKeys((prev) => {
      const key = favouriteKey(stopCode, serviceNo);
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full/unavailable — favourites just won't persist
      }
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (stopCode: string, serviceNo: string) => keys.includes(favouriteKey(stopCode, serviceNo)),
    [keys],
  );

  return { keys, toggle, isFavourite };
}
