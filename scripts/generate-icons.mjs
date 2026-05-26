#!/usr/bin/env node
/**
 * Rasterize public/icon.svg into PNGs used by the PWA manifest, Apple touch icon, and OG logo.
 * Run: npm run icons
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const svgPath = path.join(publicDir, "icon.svg");

const svg = fs.readFileSync(svgPath, "utf8");

function renderPng(size, outName) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "#1d7a70",
  });
  const png = resvg.render().asPng();
  const outPath = path.join(publicDir, outName);
  fs.writeFileSync(outPath, png);
  console.log(`Wrote ${outName} (${size}×${size})`);
}

renderPng(512, "logo.png");
renderPng(192, "pwa-192.png");
renderPng(180, "apple-touch-icon.png");
renderPng(32, "favicon-32.png");
