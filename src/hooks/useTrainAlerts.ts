import { useEffect, useState } from "react";
import { API_BASE } from "../api/busArrival";

const POLL_MS = 2 * 60_000;

// LTA TrainServiceAlerts: Status 1 = normal, 2 = disrupted.
interface TrainAlertsResponse {
  value?: {
    Status?: number;
    AffectedSegments?: { Line?: string }[];
    Message?: { Content?: string }[] | { Content?: string };
  };
}

export interface TrainAlertState {
  disrupted: boolean;
  lines: string[];
  message: string;
}

export function useTrainAlerts(): TrainAlertState | null {
  const [alert, setAlert] = useState<TrainAlertState | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/train-alerts`);
        if (!res.ok) return;
        const body = (await res.json()) as TrainAlertsResponse;
        const value = body.value;
        if (!value) return;
        const lines = [
          ...new Set(
            (value.AffectedSegments ?? [])
              .map((s) => s.Line ?? "")
              .filter(Boolean),
          ),
        ];
        const messages = Array.isArray(value.Message)
          ? value.Message
          : value.Message
            ? [value.Message]
            : [];
        if (!cancelled) {
          setAlert({
            disrupted: value.Status === 2,
            lines,
            message: messages[0]?.Content ?? "",
          });
        }
      } catch {
        // alerts are best-effort — keep whatever we last knew
      }
    };

    void fetchAlerts();
    const id = setInterval(() => {
      if (!document.hidden) void fetchAlerts();
    }, POLL_MS);
    const onVisibility = () => {
      if (!document.hidden) void fetchAlerts();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return alert;
}
