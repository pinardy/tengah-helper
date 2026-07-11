// Renders the app icon set from an inline SVG using sharp.
// Run: npm run icons
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const svg = (pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <rect width="512" height="512" rx="${pad > 0 ? 0 : 96}" fill="#0f766e"/>
  <g transform="translate(${pad} ${pad}) scale(${(512 - 2 * pad) / 512})">
    <rect x="96" y="96" width="320" height="264" rx="48" fill="#e6edf6"/>
    <rect x="128" y="136" width="256" height="104" rx="16" fill="#0f766e"/>
    <circle cx="176" cy="304" r="28" fill="#0b1220"/>
    <circle cx="336" cy="304" r="28" fill="#0b1220"/>
    <rect x="152" y="376" width="48" height="40" rx="12" fill="#e6edf6"/>
    <rect x="312" y="376" width="48" height="40" rx="12" fill="#e6edf6"/>
  </g>
</svg>`;

await mkdir("public/icons", { recursive: true });

const plain = Buffer.from(svg(0));
const maskable = Buffer.from(svg(64)); // safe-zone padding for Android masks

await sharp(plain).resize(192, 192).png().toFile("public/icons/icon-192.png");
await sharp(plain).resize(512, 512).png().toFile("public/icons/icon-512.png");
await sharp(maskable).resize(512, 512).png().toFile("public/icons/icon-512-maskable.png");
await sharp(plain).resize(180, 180).png().toFile("public/apple-touch-icon.png");

console.log("icons written to public/");
