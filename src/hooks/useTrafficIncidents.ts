import { useEffect, useState } from "react";
import { API_BASE } from "../api/busArrival";

const POLL_MS = 5 * 60_000;

// Roads/areas the Tengah buses actually pass through. Incident messages name
// the road and the nearest exit (e.g. "Accident on PIE (towards Tuas) after
// Bukit Batok Exit"), so matching landmarks also catches expressway incidents
// on our stretch without flagging the whole PIE.
const CORRIDORS =
  /tengah|bukit batok|brickland|jurong|boon lay|toh guan|hong kah|choa chu kang|upper bukit timah/i;

// LTA TrafficIncidents: Type is e.g. "Accident", "Roadwork", "Vehicle breakdown".
interface TrafficIncidentsResponse {
  value?: { Type?: string; Message?: string }[];
}

export interface TrafficIncident {
  type: string;
  message: string;
}

export function useTrafficIncidents(): TrafficIncident[] | null {
  const [incidents, setIncidents] = useState<TrafficIncident[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchIncidents = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/traffic-incidents`);
        if (!res.ok) return;
        const body = (await res.json()) as TrafficIncidentsResponse;
        const relevant = (body.value ?? [])
          .filter((i) => CORRIDORS.test(i.Message ?? ""))
          .map((i) => ({ type: i.Type ?? "Incident", message: i.Message ?? "" }));
        if (!cancelled) setIncidents(relevant);
      } catch {
        // incidents are best-effort — keep whatever we last knew
      }
    };

    void fetchIncidents();
    const id = setInterval(() => {
      if (!document.hidden) void fetchIncidents();
    }, POLL_MS);
    const onVisibility = () => {
      if (!document.hidden) void fetchIncidents();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return incidents;
}
