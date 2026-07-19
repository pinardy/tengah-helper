import { json, withCors } from "../../shared/cors";

interface Env {
  LTA_ACCOUNT_KEY: string;
}

const LTA_ENDPOINT = "https://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents";
// Incidents move fast but a banner doesn't need to be second-fresh.
const EDGE_CACHE_SECONDS = 120;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get("origin");

  if (!context.env.LTA_ACCOUNT_KEY) {
    return withCors(json({ error: "LTA_ACCOUNT_KEY secret not configured" }, 500), origin);
  }

  const cacheKey = new Request("https://cache.tengah-helper.internal/traffic-incidents");
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return withCors(cached, origin);
  }

  let upstream: Response;
  try {
    upstream = await fetch(LTA_ENDPOINT, {
      headers: {
        AccountKey: context.env.LTA_ACCOUNT_KEY,
        accept: "application/json",
      },
    });
  } catch {
    return withCors(json({ error: "failed to reach LTA DataMall" }, 502), origin);
  }

  if (!upstream.ok) {
    return withCors(json({ error: "LTA upstream error", status: upstream.status }, 502), origin);
  }

  const body = await upstream.text();
  const response = new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${EDGE_CACHE_SECONDS}`,
    },
  });
  context.waitUntil(cache.put(cacheKey, response.clone()));
  return withCors(response, origin);
};
