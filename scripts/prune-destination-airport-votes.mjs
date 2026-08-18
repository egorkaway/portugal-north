#!/usr/bin/env node
/**
 * Remove community vote totals for Europe destination airports that no longer
 * have public station pages (e.g. London Stansted, London City).
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... node scripts/prune-destination-airport-votes.mjs
 *   BLOB_READ_WRITE_TOKEN=... node scripts/prune-destination-airport-votes.mjs --dry-run
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  filterCommunityVotesForPublicStations,
  destinationAirportVoteNames,
} from "../server/lib/publicStationVotes.js";
import {
  readCommunityVotesBlob,
  writeCommunityVotesBlob,
} from "./lib/blobCommunityVotes.mjs";
import { loadEnvFile } from "./lib/stationImageFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

loadEnvFile(join(root, ".env"));

const before = await readCommunityVotesBlob();
const after = filterCommunityVotesForPublicStations(before);

function countKeys(record) {
  return Object.keys(record ?? {}).length;
}

function removedNames(beforeRatings, afterRatings) {
  const keep = new Set(Object.keys(afterRatings ?? {}));
  return Object.keys(beforeRatings ?? {}).filter((name) => !keep.has(name));
}

const removedStation = removedNames(before.ratings, after.ratings);
const removedImage = removedNames(before.imageRatings, after.imageRatings);
const removedHotel = removedNames(before.hotelRatings, after.hotelRatings);
const removedClosed = removedNames(before.hotelClosedReports, after.hotelClosedReports);

const changed =
  removedStation.length +
  removedImage.length +
  removedHotel.length +
  removedClosed.length;

console.log(
  `[votes] destination airports in catalog: ${destinationAirportVoteNames().length}`,
);
console.log(
  `[votes] before → ratings ${countKeys(before.ratings)}, image ${countKeys(before.imageRatings)}, hotel ${countKeys(before.hotelRatings)}, closed ${countKeys(before.hotelClosedReports)}`,
);
console.log(
  `[votes] after  → ratings ${countKeys(after.ratings)}, image ${countKeys(after.imageRatings)}, hotel ${countKeys(after.hotelRatings)}, closed ${countKeys(after.hotelClosedReports)}`,
);

if (removedStation.length) {
  console.log(`[votes] removed station ratings: ${removedStation.join(", ")}`);
}
if (removedImage.length) {
  console.log(`[votes] removed image ratings: ${removedImage.join(", ")}`);
}
if (removedHotel.length) {
  console.log(`[votes] removed hotel ratings: ${removedHotel.join(", ")}`);
}
if (removedClosed.length) {
  console.log(`[votes] removed closed reports: ${removedClosed.join(", ")}`);
}

if (changed === 0) {
  console.log("[votes] nothing to prune.");
  process.exit(0);
}

if (dryRun) {
  console.log("[votes] dry run — Blob not modified.");
  process.exit(0);
}

await writeCommunityVotesBlob(after);
console.log(`[votes] pruned ${changed} key group(s) from community-votes.json.`);
