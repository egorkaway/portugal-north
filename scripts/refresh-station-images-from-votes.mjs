#!/usr/bin/env node
/**
 * Semi-automatic station photo refresh from live community image votes.
 *
 * Finds stations with enough "not representative" votes, searches Wikimedia/Pexels
 * for a new image (skipping rejected URLs), updates stationImages.ts + history, and
 * optionally prepares a git branch for a PR.
 *
 * Usage:
 *   PEXELS_API_KEY=... node scripts/refresh-station-images-from-votes.mjs --dry-run
 *   node scripts/refresh-station-images-from-votes.mjs
 *   node scripts/refresh-station-images-from-votes.mjs --min-down 3 --require-net-negative
 *   node scripts/refresh-station-images-from-votes.mjs --station "Oiã"
 *   node scripts/refresh-station-images-from-votes.mjs --create-branch
 *   node scripts/refresh-station-images-from-votes.mjs --clear-votes   # also reset Blob totals
 *
 * Env:
 *   PEXELS_API_KEY          required for Pexels fallback
 *   BLOB_READ_WRITE_TOKEN   only if --clear-votes
 *   VOTES_API_BASE          default VITE_SITE_URL or https://www.verystays.com
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { clearImageRatingsForStations } from "./lib/blobCommunityVotes.mjs";
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
  parseStations,
  resolveStationImage,
  sleep,
  writeImageMap,
} from "./lib/stationImageFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const imagesPath = join(root, "src/data/stationImages.ts");
const historyPath = join(root, "data/station-image-history.json");
const reportPath = join(root, "data/station-image-refresh-report.json");

loadEnvFile(join(root, ".env"));

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const createBranch = args.includes("--create-branch");
const clearVotes = args.includes("--clear-votes");
const requireNetNegative = args.includes("--require-net-negative");
const onlyStation = argValue("--station");
const minDown = Number(argValue("--min-down") ?? "3");
const apiBase =
  argValue("--api-base") ??
  process.env.VOTES_API_BASE ??
  process.env.VITE_SITE_URL ??
  "https://www.verystays.com";

const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) {
  console.error("Set PEXELS_API_KEY in .env (needed when Wikimedia has no photo).");
  process.exit(1);
}

if (clearVotes && !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("--clear-votes requires BLOB_READ_WRITE_TOKEN in .env");
  process.exit(1);
}

function argValue(flag) {
  const i = args.indexOf(flag);
  if (i === -1 || i === args.length - 1) return null;
  return args[i + 1];
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

async function main() {
  console.log(`Fetching image votes from ${apiBase}/api/votes …`);
  const { imageRatings } = await fetchLiveVotes(apiBase);

  let candidates = stationsNeedingRefresh(imageRatings);
  if (onlyStation) {
    candidates = candidates.filter((c) => c.name === onlyStation);
    if (candidates.length === 0) {
      const votes = imageRatings[onlyStation];
      if (!votes || votes.down < minDown) {
        console.error(
          `"${onlyStation}" does not meet threshold (down >= ${minDown}${requireNetNegative ? ", down > up" : ""}).`,
        );
        process.exit(1);
      }
      candidates = [{ name: onlyStation, votes }];
    }
  }

  if (candidates.length === 0) {
    console.log(
      `No stations need a refresh (down >= ${minDown}${requireNetNegative ? ", down > up" : ""}).`,
    );
    return;
  }

  console.log(
    `${candidates.length} station(s) to refresh${dryRun ? " (dry run)" : ""}:\n` +
      candidates.map((c) => `  ${c.name}: ${c.votes.down} down, ${c.votes.up} up`).join("\n"),
  );

  const stations = parseStations(readFileSync(stationsPath, "utf8"));
  const stationByName = new Map(stations.map((s) => [s.name, s]));
  const imageMap = parseImageMap(readFileSync(imagesPath, "utf8"));
  const history = readImageHistory(historyPath);

  const usedGlobally = new Set(Object.values(imageMap));
  /** @type {{ station: string, from: string, to: string, source: string, votes: { up: number, down: number } }[]} */
  const refreshed = [];
  /** @type {{ station: string, reason: string }[]} */
  const failed = [];

  for (const { name, votes } of candidates) {
    const station = stationByName.get(name);
    const currentUrl = imageMap[name];
    if (!station) {
      failed.push({ station: name, reason: "no station metadata in stations.ts" });
      console.log(`  ${name}: skip — no station metadata`);
      continue;
    }
    if (!currentUrl) {
      failed.push({ station: name, reason: "no current image in stationImages.ts" });
      console.log(`  ${name}: skip — no image mapped`);
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
        failed.push({
          station: name,
          reason: result ? "only duplicate found" : "no alternative image",
        });
        console.log(`  ${name}: no new image`);
        await sleep(600);
        continue;
      }

      console.log(
        `  ${name}: ${result.source}${result.query ? ` (“${result.query}”)` : ""}\n` +
          `    ${currentUrl.slice(0, 60)}…\n` +
          `    → ${result.url.slice(0, 60)}…`,
      );

      refreshed.push({
        station: name,
        from: currentUrl,
        to: result.url,
        source: result.source,
        votes,
      });

      if (!dryRun) {
        imageMap[name] = result.url;
        usedGlobally.delete(currentUrl);
        usedGlobally.add(result.url);
        recordRefresh(history, name, {
          from: currentUrl,
          to: result.url,
          reason: `down>=${minDown}`,
          votesAtRefresh: votes,
        });
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      failed.push({ station: name, reason: msg });
      console.log(`  ${name}: ERROR — ${msg}`);
    }

    await sleep(700);
  }

  const report = {
    at: new Date().toISOString(),
    apiBase,
    minDown,
    requireNetNegative,
    dryRun,
    refreshed,
    failed,
  };

  if (!dryRun && refreshed.length > 0) {
    writeImageMap(imagesPath, imageMap);
    writeImageHistory(historyPath, history);
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`\nWrote ${imagesPath}, ${historyPath}, ${reportPath}`);

    if (clearVotes) {
      const cleared = await clearImageRatingsForStations(refreshed.map((r) => r.station));
      console.log(`Cleared imageRatings in Blob for: ${cleared.join(", ") || "(none)"}`);
    } else {
      console.log(
        "\nTip: after deploy, reset stale vote totals with:\n" +
          `  node scripts/clear-refreshed-image-votes.mjs\n` +
          "  (or re-run this script with --clear-votes)",
      );
    }

    if (createBranch) {
      prepareGitBranch(refreshed);
    }
  } else if (dryRun) {
    console.log(`\nDry run: would refresh ${refreshed.length}, failed ${failed.length}.`);
  } else {
    console.log(`\nDone. Refreshed 0, failed ${failed.length}.`);
  }
}

/**
 * @param {{ station: string }[]} refreshed
 */
function prepareGitBranch(refreshed) {
  const slug = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const branch = `refresh-station-images-${slug}`;
  const body = refreshed
    .map((r) => `- **${r.station}**: ${r.votes.down}↓ ${r.votes.up}↑ → ${r.source}`)
    .join("\n");

  try {
    execSync(`git checkout -b ${branch}`, { cwd: root, stdio: "inherit" });
    execSync("git add src/data/stationImages.ts data/station-image-history.json data/station-image-refresh-report.json", {
      cwd: root,
      stdio: "inherit",
    });
    const message = `Refresh station photos from community votes\n\n${body}\n\nSemi-automatic: scripts/refresh-station-images-from-votes.mjs`;
    execSync(`git commit -m ${JSON.stringify(message)}`, { cwd: root, stdio: "inherit" });
    console.log(`\nBranch ${branch} created and committed. Push and open a PR:\n` +
      `  git push -u origin ${branch}\n` +
      `  gh pr create --title "Refresh station photos from votes" --body ${JSON.stringify(body)}`);
  } catch (error) {
    console.warn("Git branch/commit failed (maybe already on a branch or nothing to commit):", error);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
