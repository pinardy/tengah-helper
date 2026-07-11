# Tengah Helper

A personal PWA for Parc Meadow @ Tengah: live bus arrivals for nearby stops and
"best bus" recommendations to Jurong East, Bukit Batok, CBD, Lakeside, and
Beauty World. Powered by the LTA DataMall v3 BusArrival API via a Cloudflare
Pages Function proxy (LTA's API has no CORS support, and the proxy keeps your
AccountKey secret).

## One-time setup

1. **Get an LTA DataMall AccountKey** (free): register at
   <https://datamall.lta.gov.sg> → *Request for API Access*. The key arrives by
   email.
2. Copy `.dev.vars.example` to `.dev.vars` and paste your key.
3. `npm install`

## Local development

```sh
npm run build          # build once so wrangler has a dist/ to serve
npm run dev:functions  # terminal 1: Pages Function + static app on :8788
npm run dev            # terminal 2: Vite dev server (proxies /api to :8788)
```

Open the Vite URL for hot-reload development, or `http://localhost:8788` to
test the production build + service worker.

## Deploy to Cloudflare Pages

```sh
npx wrangler login
npx wrangler pages project create tengah-helper
npx wrangler pages secret put LTA_ACCOUNT_KEY   # paste your key
npm run deploy
```

Then open `https://tengah-helper.pages.dev` on your phone and *Install app*
(Android Chrome) or *Share → Add to Home Screen* (iOS Safari).

## Customising

- **Nearby stops**: `src/config/stops.ts`
- **Destinations & best buses**: `src/config/destinations.ts` — boarding
  directions were verified against businterchange.net (July 2026); stop 40451
  (Tengah Blvd, Blk 306B) is the outbound side for most services. If a route
  gets amended, edit this file.

## Notes

- Arrival data is never cached by the service worker (stale timings are worse
  than none); the Pages Function has a 15s edge cache to stay well within LTA
  rate limits.
- Weekday-only services (97e, 452, 453, 674, 871A) show no arrivals on
  weekends — that's the schedule, not a bug.
