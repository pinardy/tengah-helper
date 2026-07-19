import { useEffect, useState } from "react";
import { API_BASE } from "../api/busArrival";

// Clusters update daily; poll slowly and on foreground.
const POLL_MS = 60 * 60_000;

export interface DengueCluster {
  locality: string;
  cases: number;
  distanceM: number;
}

interface DengueResponse {
  clusters?: DengueCluster[];
}

/** Active dengue clusters within 2 km of home (filtered server-side). */
export function useDengue(): DengueCluster[] | null {
  const [clusters, setClusters] = useState<DengueCluster[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchClusters = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/dengue`);
        if (!res.ok) return;
        const body = (await res.json()) as DengueResponse;
        if (!cancelled && body.clusters) setClusters(body.clusters);
      } catch {
        // dengue info is best-effort — keep whatever we last knew
      }
    };

    void fetchClusters();
    const id = setInterval(() => {
      if (!document.hidden) void fetchClusters();
    }, POLL_MS);
    const onVisibility = () => {
      if (!document.hidden) void fetchClusters();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return clusters;
}
