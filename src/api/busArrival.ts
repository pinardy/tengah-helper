import type { BusArrivalResponse } from "../../shared/lta-types";

// Same-origin by default (Cloudflare Pages / local dev). The GitHub Pages
// build sets VITE_API_BASE to the Cloudflare-hosted API since GitHub Pages
// cannot run the proxy function.
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export async function fetchBusArrival(stopCode: string): Promise<BusArrivalResponse> {
  const res = await fetch(`${API_BASE}/api/bus-arrival?stop=${encodeURIComponent(stopCode)}`);
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // non-JSON error body — keep the HTTP status message
    }
    throw new Error(message);
  }
  return (await res.json()) as BusArrivalResponse;
}
