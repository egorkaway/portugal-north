/**
 * Ensure every public station page has a photo in stationImages.ts.
 * Page set matches area-map eligibility (Iberian hubs/stops + destination
 * airports that already have both connection maps).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  loadEnvFile,
  parseImageMap,
  resolveStationImage,
  seedUsedImages,
  sleep,
  updateImageInMap,
  writeImageMap,
} from "./stationImageFetch.mjs";
import {
  loadPexelsCredits,
  pexelsPhotoIdFromUrl,
  upsertPexelsCredit,
  writePexelsCredits,
} from "./pexelsCredits.mjs";
import { allRejectedUrls, readImageHistory } from "./stationImageHistory.mjs";
import { loadStationsEligibleForAreaMaps } from "./stationAreaMapEligibility.mjs";

export function listPageStationsMissingImages(rootDir) {
  const imageMap = parseImageMap(readFileSync(join(rootDir, "src/data/stationImages.ts"), "utf8"));
  return loadStationsEligibleForAreaMaps(rootDir).filter((station) => !imageMap[station.name]);
}

/**
 * Fill missing photos for public station pages.
 * @returns {{ missingBefore: string[], added: string[], stillMissing: string[] }}
 */
export async function ensureStationImages(rootDir, options = {}) {
  const dryRun = Boolean(options.dryRun);
  const imagesPath = join(rootDir, "src/data/stationImages.ts");
  const creditsPath = join(rootDir, "src/data/pexelsPhotoCredits.ts");
  const historyPath = join(rootDir, "data/station-image-history.json");

  loadEnvFile(join(rootDir, ".env"));
  const apiKey = process.env.PEXELS_API_KEY ?? "";

  const missingBefore = listPageStationsMissingImages(rootDir).map((station) => station.name);
  if (!missingBefore.length) {
    console.log("Station images: all public pages have photos.");
    return { missingBefore: [], added: [], stillMissing: [] };
  }

  console.log(
    `Station images: ${missingBefore.length} public page(s) missing photos${dryRun ? " [dry-run]" : ""}…`,
  );
  if (dryRun) {
    for (const name of missingBefore) console.log(`  would fill: ${name}`);
    return { missingBefore, added: [], stillMissing: missingBefore };
  }

  if (!apiKey) {
    console.log("Station images: PEXELS_API_KEY unset — Wikimedia only.");
  }

  const imageMap = parseImageMap(readFileSync(imagesPath, "utf8"));
  const history = readImageHistory(historyPath);
  const usedUrls = seedUsedImages([...Object.values(imageMap), ...allRejectedUrls(history)]);
  const pexelsCredits = loadPexelsCredits(creditsPath);
  const targets = loadStationsEligibleForAreaMaps(rootDir).filter(
    (station) => !imageMap[station.name],
  );
  const added = [];

  for (const station of targets) {
    try {
      const result = await resolveStationImage(station, { apiKey, usedUrls });
      if (result?.url) {
        updateImageInMap(imageMap, station.name, result.url);
        if (result.credit && apiKey) {
          const photoId = pexelsPhotoIdFromUrl(result.url);
          upsertPexelsCredit(pexelsCredits, photoId, result.credit);
          writePexelsCredits(creditsPath, pexelsCredits);
        }
        writeImageMap(imagesPath, imageMap);
        added.push(station.name);
        console.log(`  ${station.name}: ${result.source}`);
      } else {
        console.log(`  ${station.name}: NOT FOUND`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  ${station.name}: ERROR — ${message}`);
    }
    await sleep(400);
  }

  const stillMissing = listPageStationsMissingImages(rootDir).map((station) => station.name);
  if (stillMissing.length) {
    console.error(
      `Station images: still missing after fill: ${stillMissing.join(", ")}`,
    );
  } else {
    console.log(`Station images: filled ${added.length} photo(s).`);
  }

  return { missingBefore, added, stillMissing };
}
