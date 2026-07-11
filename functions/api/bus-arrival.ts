interface Env {
  LTA_ACCOUNT_KEY: string;
}

const LTA_ENDPOINT = "https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival";
const EDGE_CACHE_SECONDS = 15;

// Origins allowed to call this API cross-origin (the GitHub Pages copy of the
// app, plus local dev). Same-origin Cloudflare Pages requests need no CORS.
function isAllowedOrigin(origin: string): boolean {
  return (
    origin === "https://pinardy.github.io" ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:")
  );
}

// CORS headers are applied per-request AFTER the cache, so a cached entry
// created by one origin never leaks its allow-origin header to another.
function withCors(res: Response, origin: string | null): Response {
  if (!origin || !isAllowedOrigin(origin)) return res;
  const headers = new Headers(res.headers);
  headers.set("access-control-allow-origin", origin);
  headers.append("vary", "Origin");
  return new Response(res.body, { status: res.status, headers });
}

function json(body: unknown, status: number, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const origin = context.request.headers.get("origin");
  const stop = new URL(context.request.url).searchParams.get("stop") ?? "";
  if (!/^\d{5}$/.test(stop)) {
    return withCors(json({ error: "invalid stop code — expected 5 digits" }, 400), origin);
  }

  if (!context.env.LTA_ACCOUNT_KEY) {
    return withCors(json({ error: "LTA_ACCOUNT_KEY secret not configured" }, 500), origin);
  }

  // Normalized cache key so all clients polling the same stop share one entry.
  const cacheKey = new Request(`https://cache.tengah-helper.internal/bus-arrival/${stop}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    return withCors(cached, origin);
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
