import { json, withCors } from "../../shared/cors";

// NEA "Dengue Clusters (GEOJSON)" via data.gov.sg (public, no key). The
// dataset API hands back a signed download URL for the GeoJSON, which we
// fetch and reduce server-side to just the clusters near home — the full
// file is a few hundred KB and the phone only needs the nearby ones.
const DATASET_ID = "d_dbfabf16158d1b0e1c420627c0819168";
const POLL_URL = `https://api-open.data.gov.sg/v1/public/api/datasets/${DATASET_ID}/poll-download`;

// Parc Meadow @ Tengah (same coords as the client's weather hooks).
const HOME = { lat: 1.3555, lng: 103.7135 };
const RADIUS_M = 2000;

// NEA updates clusters daily; cache generously.
const EDGE_CACHE_SECONDS = 3600;

interface PollDownloadResponse {
  code: number;
  data?: { url?: string };
}

interface DengueFeature {
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
  properties?: {
    LOCALITY?: string;
    CASE_SIZE?: number;
  };
}

/** Approx. metres from HOME using an equirectangular projection — fine at this scale. */
function distanceM(lat: number, lng: number): number {
  const mPerDegLat = 111_320;
  const mPerDegLng = mPerDegLat * Math.cos((HOME.lat * Math.PI) / 180);
  return Math.hypot((lat - HOME.lat) * mPerDegLat, (lng - HOME.lng) * mPerDegLng);
}

/** Min distance from HOME to any vertex of a Polygon/MultiPolygon. */
function minDistanceM(geometry: DengueFeature["geometry"]): number {
  if (!geometry?.coordinates) return Infinity;
  // Polygon: ring[] -> [lng, lat][]; MultiPolygon: polygon[] -> ring[] -> [lng, lat][]
  const rings =
    geometry.type === "MultiPolygon"
      ? (geometry.coordinates as number[][][][]).flat()
      : (geometry.coordinates as number[][][]);
  let min = Infinity;
  for (const ring of rings) {
    for (const [lng, lat] of ring) {
      const d = distanceM(lat, lng);
      if (d < min) min = d;
    }
  }
  return min;
}

export const onRequestGet: PagesFunction = async (context) => {
  const origin = context.request.headers.get("origin");

  const cacheKey = new Request("https://cache.tengah-helper.internal/dengue");
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return withCors(cached, origin);
  }

  try {
    const pollRes = await fetch(POLL_URL);
    if (!pollRes.ok) {
      return withCors(json({ error: "data.gov.sg poll error" }, 502), origin);
    }
    const poll = (await pollRes.json()) as PollDownloadResponse;
    const url = poll.data?.url;
    if (!url) {
      return withCors(json({ error: "no download url from data.gov.sg" }, 502), origin);
    }

    const geoRes = await fetch(url);
    if (!geoRes.ok) {
      return withCors(json({ error: "dengue geojson fetch error" }, 502), origin);
    }
    const geo = (await geoRes.json()) as { features?: DengueFeature[] };

    const clusters = (geo.features ?? [])
      .map((f) => ({
        locality: f.properties?.LOCALITY ?? "Unknown locality",
        cases: f.properties?.CASE_SIZE ?? 0,
        distanceM: Math.round(minDistanceM(f.geometry)),
      }))
      .filter((c) => c.distanceM <= RADIUS_M)
      .sort((a, b) => a.distanceM - b.distanceM);

    const response = json({ clusters }, 200);
    response.headers.set("cache-control", `public, max-age=${EDGE_CACHE_SECONDS}`);
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return withCors(response, origin);
  } catch {
    return withCors(json({ error: "failed to fetch dengue clusters" }, 502), origin);
  }
};
