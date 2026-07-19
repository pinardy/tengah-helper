import { useCallback, useState } from "react";
import { NEAREST_STOP_CODE } from "../config/stops";

const STORAGE_KEY = "tengah-helper:home-stop";

/**
 * The resident's default stop, floated to the top of the Home screen. Defaults
 * to the nearest stop by walk time; the choice is persisted once overridden.
 */
export function useHomeStop() {
  const [homeStop, setHomeStop] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || NEAREST_STOP_CODE;
    } catch {
      return NEAREST_STOP_CODE;
    }
  });

  const selectHomeStop = useCallback((code: string) => {
    setHomeStop(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // storage unavailable — selection just won't persist
    }
  }, []);

  return { homeStop, selectHomeStop };
}
