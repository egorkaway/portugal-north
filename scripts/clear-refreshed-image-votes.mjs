#!/usr/bin/env node
/**
 * Manually clear community imageRatings in Blob (normally done automatically on deploy).
 *
 *   BLOB_READ_WRITE_TOKEN=... node scripts/clear-refreshed-image-votes.mjs --station "Oiã"
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { clearImageRatingsForStations } from "./lib/blobCommunityVotes.mjs";
import { loadEnvFile } from "./lib/stationImageFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = join(root, "data/station-image-refresh-report.json");

loadEnvFile(join(root, ".env"));

const args = process.argv.slice(2);
const fromReport = !args.includes("--station");
const stationArgs = [];
const i = args.indexOf("--station");
if (i !== -1) {
  stationArgs.push(...args.slice(i + 1).filter((a) => !a.startsWith("--")));
}

let stations = stationArgs;
if (fromReport || stations.length === 0) {
  try {
    const report = JSON.parse(readFileSync(reportPath, "utf8"));
    stations = report.refreshed?.map((r) => r.station) ?? [];
  } catch {
    console.error(`No --station names and could not read ${reportPath}`);
    process.exit(1);
  }
}

if (stations.length === 0) {
  console.log("No stations to clear.");
  process.exit(0);
}

const cleared = await clearImageRatingsForStations(stations);
console.log(`Cleared imageRatings for ${cleared.length} station(s): ${cleared.join(", ")}`);
if (cleared.length < stations.length) {
  const missing = stations.filter((s) => !cleared.includes(s));
  console.log(`(no existing totals for: ${missing.join(", ")})`);
}
