// Shared by the Pages Functions in functions/api/.

// Origins allowed to call the API cross-origin (the GitHub Pages copy of the
// app, plus local dev). Same-origin Cloudflare Pages requests need no CORS.
export function isAllowedOrigin(origin: string): boolean {
  return (
    origin === "https://pinardy.github.io" ||
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:")
  );
}

// CORS headers are applied per-request AFTER the cache, so a cached entry
// created by one origin never leaks its allow-origin header to another.
export function withCors(res: Response, origin: string | null): Response {
  if (!origin || !isAllowedOrigin(origin)) return res;
  const headers = new Headers(res.headers);
  headers.set("access-control-allow-origin", origin);
  headers.append("vary", "Origin");
  return new Response(res.body, { status: res.status, headers });
}

export function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
