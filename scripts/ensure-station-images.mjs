#!/usr/bin/env node
/**
 * Ensure every public station page has a photo before departures ship or mobile builds.
 *
 *   npm run images:ensure
 *   npm run images:ensure -- --dry-run
 *   npm run images:ensure -- --sync-mobile
 *   npm run images:ensure -- --allow-missing   # warn only; do not exit 1
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensureStationImages } from "./lib/ensureStationImages.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const syncMobile = args.includes("--sync-mobile");
const allowMissing = args.includes("--allow-missing");

const result = await ensureStationImages(root, { dryRun });

if (syncMobile && !dryRun && result.added.length) {
  const { syncMobileData } = await import("../mobile/scripts/sync-data.mjs");
  console.log("Syncing mobile bundled data after image fill…");
  await syncMobileData();
} else if (syncMobile && !dryRun) {
  // Still sync so builds pick up any prior image/catalog edits.
  const { syncMobileData } = await import("../mobile/scripts/sync-data.mjs");
  console.log("Syncing mobile bundled data…");
  await syncMobileData();
}

if (result.stillMissing.length && !allowMissing && !dryRun) {
  process.exit(1);
}
