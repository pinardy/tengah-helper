import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "auto" | "light" | "dark";

const STORAGE_KEY = "tengah-helper:theme";
const ORDER: ThemeMode[] = ["auto", "light", "dark"];

function load(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "auto" || raw === "light" || raw === "dark") return raw;
  } catch {
    // storage unavailable — fall back to auto
  }
  return "auto";
}

/**
 * Manual theme override. "auto" removes the attribute so CSS follows the
 * system's prefers-color-scheme; "light"/"dark" force a palette via a
 * data-theme attribute on <html>.
 */
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(load);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", mode);
    }
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // storage unavailable — the choice just won't persist
    }
  }, [mode]);

  const cycle = useCallback(() => {
    setMode((m) => ORDER[(ORDER.indexOf(m) + 1) % ORDER.length]);
  }, []);

  return { mode, cycle };
}
