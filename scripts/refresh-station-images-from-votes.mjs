#!/usr/bin/env node
/**
 * Refresh station photos when community "not representative" votes hit the threshold.
 *
 * **Deploy mode (`--build`)** — runs at the start of `npm run build` on Vercel:
 *   - Reads votes + rejected-URL history from Blob (no cron, no PR)
 *   - Updates src/data/stationImages.ts before Vite bundles the app
 *   - Clears image vote totals for refreshed stations
 *   - Skips quietly if PEXELS_API_KEY or BLOB_READ_WRITE_TOKEN is missing
 *
 * **Local mode** — same logic; history from Blob when configured, else data/station-image-history.json
 *
 *   npm run images:refresh-from-votes:dry
 *   npm run images:refresh-from-votes
 *   npm run images:refresh-from-votes -- --force --station "Oiã" --station "Adémia"
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  clearImageRatingsForStations,
  readCommunityVotesBlob,
} from "./lib/blobCommunityVotes.mjs";
import {
  isImageHistoryBlobConfigured,
  readImageHistoryFromBlob,
  writeImageHistoryToBlob,
} from "./lib/blobStationImageHistory.mjs";
import { fetchLiveVotes } from "./lib/fetchLiveVotes.mjs";
import {
  addRejectedUrl,
  readImageHistory,
  recordRefresh,
  rejectedUrlsForStation,
  writeImageHistory,
} from "./lib/stationImageHistory.mjs";
import {
  loadEnvFile,
  parseImageMap,
  parseAllStationsFromRepo,
  resolveStationImage,
  sleep,
  writeImageMap,
} from "./lib/stationImageFetch.mjs";
import {
  loadPexelsCredits,
  pexelsPhotoIdFromUrl,
  upsertPexelsCredit,
  writePexelsCredits,
} from "./lib/pexelsCredits.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesPath = join(root, "src/data/stationImages.ts");
const creditsPath = join(root, "src/data/pexelsPhotoCredits.ts");
const historyPath = join(root, "data/station-image-history.json");

loadEnvFile(join(root, ".env"));

const args = process.argv.slice(2);
const buildMode = args.includes("--build");
const dryRun = args.includes("--dry-run");
const forceRefresh = args.includes("--force");
const requireNetNegative = args.includes("--require-net-negative");
const onlyStations = argValues("--station");
const minDown = Number(argValue("--min-down") ?? "3");
const maxPerRun = Number(
  argValue("--max") ?? (buildMode ? process.env.IMAGE_REFRESH_MAX_PER_BUILD ?? "5" : "999"),
);
const apiBase =
  argValue("--api-base") ??
  process.env.VOTES_API_BASE ??
  process.env.VITE_SITE_URL ??
  "https://www.verystays.com";

const apiKey = process.env.PEXELS_API_KEY;
const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

function argValue(flag) {
  const i = args.indexOf(flag);
  if (i === -1 || i === args.length - 1) return null;
  return args[i + 1];
}

function argValues(flag) {
  /** @type {string[]} */
  const values = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && i + 1 < args.length) values.push(args[i + 1]);
  }
  return values;
}

function skipBuild(message) {
  console.log(`[station-images] ${message}`);
  process.exit(0);
}

if (buildMode) {
  if (!apiKey) skipBuild("skip — PEXELS_API_KEY not set");
  if (!blobConfigured) skipBuild("skip — BLOB_READ_WRITE_TOKEN not set");
}

if (!buildMode && !apiKey) {
  console.error("Set PEXELS_API_KEY in .env");
  process.exit(1);
}

function stationsNeedingRefresh(imageRatings) {
  const candidates = [];
  for (const [name, votes] of Object.entries(imageRatings)) {
    if (votes.down < minDown) continue;
    if (requireNetNegative && votes.down <= votes.up) continue;
    candidates.push({ name, votes });
  }
  return candidates.sort((a, b) => b.votes.down - a.votes.down || a.name.localeCompare(b.name));
}

async function loadImageRatings() {
  if (blobConfigured) {
    const data = await readCommunityVotesBlob();
    const raw = data.imageRatings;
    if (raw && typeof raw === "object") {
      /** @type {Record<string, { up: number, down: number }>} */
      const out = {};
      for (const [key, value] of Object.entries(raw)) {
        if (!value || typeof value !== "object") continue;
        const entry = /** @type {{ up?: unknown, down?: unknown }} */ (value);
        const up = Math.max(0, Math.floor(Number(entry.up) || 0));
        const down = Math.max(0, Math.floor(Number(entry.down) || 0));
        if (up > 0 || down > 0) out[key] = { up, down };
      }
      if (buildMode) {
        console.log("[station-images] loaded vote totals from Blob");
        return out;
      }
    }
  }

  console.log(`[station-images] fetching vote totals from ${apiBase}/api/votes …`);
  const { imageRatings } = await fetchLiveVotes(apiBase);
  return imageRatings;
}

async function loadHistory() {
  if (isImageHistoryBlobConfigured()) {
    const fromBlob = await readImageHistoryFromBlob();
    if (Object.keys(fromBlob).length > 0 || buildMode) {
      return fromBlob;
    }
  }
  return readImageHistory(historyPath);
}

async function saveHistory(history) {
  if (dryRun) return;
  if (isImageHistoryBlobConfigured()) {
    await writeImageHistoryToBlob(history);
    if (!buildMode) {
      writeImageHistory(historyPath, history);
    }
    return;
  }
  writeImageHistory(historyPath, history);
}

async function main() {
  const imageRatings = await loadImageRatings();

  let candidates = stationsNeedingRefresh(imageRatings);

  if (forceRefresh && onlyStations.length > 0) {
    const stations = parseAllStationsFromRepo(root);
    const stationByName = new Map(stations.map((s) => [s.name, s]));
    candidates = onlyStations.map((name) => {
      if (!stationByName.has(name)) {
        console.error(`Unknown station: ${name}`);
        process.exit(1);
      }
      return {
        name,
        votes: imageRatings[name] ?? { up: 0, down: 0 },
      };
    });
  } else if (onlyStations.length === 1) {
    const onlyStation = onlyStations[0];
    candidates = candidates.filter((c) => c.name === onlyStation);
    if (candidates.length === 0) {
      const votes = imageRatings[onlyStation];
      if (!votes || votes.down < minDown) {
        console.error(`"${onlyStation}" does not meet threshold (down >= ${minDown}).`);
        process.exit(1);
      }
      candidates = [{ name: onlyStation, votes }];
    }
  } else if (onlyStations.length > 1) {
    candidates = candidates.filter((c) => onlyStations.includes(c.name));
  }

  if (candidates.length > maxPerRun) {
    console.log(
      `[station-images] capping at ${maxPerRun} station(s) this run (${candidates.length} eligible)`,
    );
    candidates = candidates.slice(0, maxPerRun);
  }

  if (candidates.length === 0) {
    console.log(
      `[station-images] nothing to refresh (down >= ${minDown}${requireNetNegative ? ", down > up" : ""})`,
    );
    return;
  }

  console.log(
    `[station-images] ${candidates.length} station(s)${dryRun ? " (dry run)" : ""}:\n` +
      candidates.map((c) => `  ${c.name}: ${c.votes.down}↓ ${c.votes.up}↑`).join("\n"),
  );

  const stations = parseAllStationsFromRepo(root);
  const stationByName = new Map(stations.map((s) => [s.name, s]));
  const imageMap = parseImageMap(readFileSync(imagesPath, "utf8"));
  const history = await loadHistory();
  const usedGlobally = new Set(Object.values(imageMap));
  const pexelsCredits = loadPexelsCredits(creditsPath);

  /** @type {string[]} */
  const refreshedNames = [];

  for (const { name, votes } of candidates) {
    const station = stationByName.get(name);
    const currentUrl = imageMap[name];
    if (!station || !currentUrl) {
      console.log(`  ${name}: skip`);
      continue;
    }

    addRejectedUrl(history, name, currentUrl);
    const usedUrls = new Set([...usedGlobally, ...rejectedUrlsForStation(history, name)]);

    try {
      const result = await resolveStationImage(station, {
        apiKey,
        usedUrls,
        pexelsOnly: currentUrl.includes("pexels.com"),
      });

      if (!result || result.url === currentUrl) {
        console.log(`  ${name}: no new image`);
        await sleep(buildMode ? 400 : 700);
        continue;
      }

      console.log(`  ${name}: ${result.source} → new photo`);

      if (!dryRun) {
        imageMap[name] = result.url;
        usedGlobally.delete(currentUrl);
        usedGlobally.add(result.url);
        recordRefresh(history, name, {
          from: currentUrl,
          to: result.url,
          reason: forceRefresh ? "forced" : `down>=${minDown}`,
          votesAtRefresh: votes,
        });
        if (result.credit) {
          const photoId = pexelsPhotoIdFromUrl(result.url);
          upsertPexelsCredit(pexelsCredits, photoId, result.credit);
          writePexelsCredits(creditsPath, pexelsCredits);
        }
        refreshedNames.push(name);
      }
    } catch (error) {
      console.log(`  ${name}: ${error instanceof Error ? error.message : error}`);
    }

    await sleep(buildMode ? 400 : 700);
  }

  if (dryRun) {
    console.log(`[station-images] dry run complete`);
    return;
  }

  if (refreshedNames.length === 0) {
    console.log(`[station-images] no images updated`);
    return;
  }

  writeImageMap(imagesPath, imageMap);
  await saveHistory(history);

  if (blobConfigured) {
    const cleared = await clearImageRatingsForStations(refreshedNames);
    console.log(
      `[station-images] updated ${refreshedNames.length} photo(s); cleared votes for: ${cleared.join(", ")}`,
    );
  } else {
    console.log(`[station-images] updated ${refreshedNames.length} photo(s) (votes not cleared — no Blob token)`);
  }
}

main().catch((error) => {
  if (buildMode) {
    console.warn(
      `[station-images] refresh failed (build continues): ${error instanceof Error ? error.message : error}`,
    );
    process.exit(0);
  }
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
