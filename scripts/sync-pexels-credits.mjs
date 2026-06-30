#!/usr/bin/env node
/**
 * Fill photographer credits for Pexels photos used in stationImages.ts.
 *
 * Usage:
 *   PEXELS_API_KEY=your_key node scripts/sync-pexels-credits.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile, parseImageMap, sleep } from "./lib/stationImageFetch.mjs";
import {
  fetchPexelsPhotoCredit,
  loadPexelsCredits,
  pexelsPhotoIdFromUrl,
  upsertPexelsCredit,
  writePexelsCredits,
} from "./lib/pexelsCredits.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesPath = join(root, "src/data/stationImages.ts");
const creditsPath = join(root, "src/data/pexelsPhotoCredits.ts");

loadEnvFile(join(root, ".env"));
const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) {
  console.error("Set PEXELS_API_KEY in the environment (see .env.example).");
  process.exit(1);
}

const imageMap = parseImageMap(readFileSync(imagesPath, "utf8"));
const credits = loadPexelsCredits(creditsPath);
const photoIds = [
  ...new Set(
    Object.values(imageMap)
      .map((url) => pexelsPhotoIdFromUrl(url))
      .filter(Boolean),
  ),
].sort((a, b) => Number(a) - Number(b));

const missing = photoIds.filter((id) => !credits[id]);
console.log(`Pexels photos: ${photoIds.length}, credits on disk: ${photoIds.length - missing.length}, to fetch: ${missing.length}`);

let added = 0;
for (const photoId of missing) {
  try {
    const credit = await fetchPexelsPhotoCredit(photoId, apiKey);
    if (credit) {
      upsertPexelsCredit(credits, photoId, credit);
      added++;
      writePexelsCredits(creditsPath, credits);
      console.log(`  ${photoId}: ${credit.photographer}`);
    } else {
      console.log(`  ${photoId}: no photographer in response`);
    }
  } catch (error) {
    console.log(
      `  ${photoId}: ERROR — ${error instanceof Error ? error.message : error}`,
    );
  }
  await sleep(600);
}

console.log(`Done. Added ${added} credit(s) to ${creditsPath}`);
