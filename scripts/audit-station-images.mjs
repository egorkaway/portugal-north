#!/usr/bin/env node
/**
 * Report missing or duplicate station images.
 *
 *   node scripts/audit-station-images.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  findDuplicateGroups,
  parseImageMap,
  parseStations,
} from "./lib/stationImageFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stations = parseStations(readFileSync(join(root, "src/data/stations.ts"), "utf8"));
const imageMap = parseImageMap(readFileSync(join(root, "src/data/stationImages.ts"), "utf8"));

const missing = stations.filter((s) => !imageMap[s.name]);
const dupes = findDuplicateGroups(imageMap);

console.log(`Stations: ${stations.length}`);
console.log(`With images: ${Object.keys(imageMap).length}`);
console.log(`Missing images: ${missing.length}`);
console.log(`Duplicate URL groups: ${dupes.length}`);

if (missing.length) {
  console.log("\nMissing:");
  for (const s of missing) console.log(`  - ${s.name}`);
}

if (dupes.length) {
  console.log("\nDuplicates:");
  for (const [url, names] of dupes) {
    console.log(`  ${names.length}× ${url.slice(0, 72)}…`);
    console.log(`    ${names.join(", ")}`);
  }
}

process.exit(missing.length || dupes.length ? 1 : 0);
