#!/usr/bin/env node
/**
 * Generate overview PNGs for the web map and rankings pages:
 *   - portugal-activity.png / portugal-reliability.png (4:5 portrait)
 *   - iberian-reliability.png (square peninsula)
 *
 *   npm run maps:overview
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderIberianReliabilityMap,
  renderPortugalActivityMap,
  renderPortugalReliabilityMap,
  CARD_HEIGHT,
  CARD_WIDTH,
  IBERIAN_CARD_SIZE,
} from "./lib/portugalOverviewMap.mjs";
import { resolveOverviewBasemap } from "./lib/mapBasemaps.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/maps/overview");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

mkdirSync(outDir, { recursive: true });
const basemap = resolveOverviewBasemap("osm");

const outputs = [
  {
    filename: "portugal-activity.png",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    render: () => renderPortugalActivityMap(root, { siteUrl, basemap }),
  },
  {
    filename: "portugal-reliability.png",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    render: () => renderPortugalReliabilityMap(root, { siteUrl, basemap }),
  },
  {
    filename: "iberian-reliability.png",
    width: IBERIAN_CARD_SIZE,
    height: IBERIAN_CARD_SIZE,
    render: () => renderIberianReliabilityMap(root, { siteUrl, basemap }),
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
      files: outputs.map((output) => ({
        filename: output.filename,
        width: output.width,
        height: output.height,
      })),
    },
    null,
    2,
  ),
);

console.log(`Wrote ${outputs.length} overview maps to public/maps/overview/ using ${basemap.id}`);
