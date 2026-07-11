import type { BusArrivalResponse } from "../../shared/lta-types";

export async function fetchBusArrival(stopCode: string): Promise<BusArrivalResponse> {
  const res = await fetch(`/api/bus-arrival?stop=${encodeURIComponent(stopCode)}`);
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
