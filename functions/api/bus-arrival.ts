interface Env {
  LTA_ACCOUNT_KEY: string;
}

const LTA_ENDPOINT = "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival";
const EDGE_CACHE_SECONDS = 15;

function json(body: unknown, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const stop = new URL(context.request.url).searchParams.get("stop") ?? "";
  if (!/^\d{5}$/.test(stop)) {
    return json({ error: "invalid stop code — expected 5 digits" }, 400);
  }

  if (!context.env.LTA_ACCOUNT_KEY) {
    return json({ error: "LTA_ACCOUNT_KEY secret not configured" }, 500);
  }

  // Normalized cache key so all clients polling the same stop share one entry.
  const cacheKey = new Request(`https://cache.tengah-helper.internal/bus-arrival/${stop}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return cached;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${LTA_ENDPOINT}?BusStopCode=${stop}`, {
      headers: {
        AccountKey: context.env.LTA_ACCOUNT_KEY,
        accept: "application/json",
      },
    });
  } catch {
    return json({ error: "failed to reach LTA DataMall" }, 502);
  }

  if (!upstream.ok) {
    return json({ error: "LTA upstream error", status: upstream.status }, 502);
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
  return response;
};
