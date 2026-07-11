import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// "/" for Cloudflare Pages and local dev; the GitHub Pages workflow sets
// VITE_BASE=/tengah-helper/ because project sites are served from a subpath.
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "Tengah Helper",
        short_name: "Tengah",
        description: "Live bus arrivals and best buses from Parc Meadow @ Tengah",
        theme_color: "#0f766e",
        background_color: "#0b1220",
        display: "standalone",
        start_url: base,
        scope: base,
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        navigateFallback: `${base}index.html`,
        // Never serve arrival data from the service worker cache — stale bus
        // timings are worse than none. Freshness is handled by the 15s edge
        // cache on the Pages Function and the LastUpdated indicator.
        runtimeCaching: [
          {
            urlPattern: /\/api\/bus-arrival/,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      // `npm run dev:functions` serves the Pages Function on :8788
      "/api": "http://localhost:8788",
    },
  },
});
