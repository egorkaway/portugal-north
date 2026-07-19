#!/usr/bin/env node
/**
 * Generate Portugal overview PNGs for the web map page:
 *   - portugal-activity.png   (H3 hex activity, like the interactive web map)
 *   - portugal-reliability.png (reliability colours, like the mobile map)
 *
 *   npm run maps:overview
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderPortugalActivityMap,
  renderPortugalReliabilityMap,
} from "./lib/portugalOverviewMap.mjs";
import { resolveOverviewBasemap } from "./lib/mapBasemaps.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/maps/overview");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

mkdirSync(outDir, { recursive: true });
const basemap = resolveOverviewBasemap("random");

const outputs = [
  {
    filename: "portugal-activity.png",
    render: () => renderPortugalActivityMap(root, { siteUrl, basemap }),
  },
  {
    filename: "portugal-reliability.png",
    render: () => renderPortugalReliabilityMap(root, { siteUrl, basemap }),
  },
];

for (const output of outputs) {
  const started = Date.now();
  process.stdout.write(`Rendering ${output.filename} (${basemap.id})… `);
  const buffer = await output.render();
  const path = join(outDir, output.filename);
  writeFileSync(path, buffer);
  process.stdout.write(`done (${Math.round(buffer.length / 1024)} KB, ${Date.now() - started} ms)\n`);
}

writeFileSync(
  join(outDir, "manifest.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      siteUrl,
      basemap: basemap.id,
      width: 1080,
      height: 1350,
      files: outputs.map((output) => output.filename),
    },
    null,
    2,
  ),
);

console.log(`Wrote ${outputs.length} overview maps to public/maps/overview/ using ${basemap.id}`);
