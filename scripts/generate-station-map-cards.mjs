#!/usr/bin/env node
/**
 * Generate 1080×1080 square PNG area maps for each station (map tiles + brand overlay).
 *
 *   npm run maps:stations
 *   npm run maps:stations -- --limit 5
 *   npm run maps:stations -- --station "Aveiro"
 *   npm run maps:stations -- --basemap=carto-voyager   # same style for all
 *   npm run maps:stations -- --basemap=random          # default: random per station
 *   npm run maps:stations -- --region=lisbon           # Lisbon metro + LIS airport
 */
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllStationsFromRepo } from "./lib/stationImageFetch.mjs";
import { renderStationMapCard, stationToSlug } from "./lib/stationMapCard.mjs";
import { BASEMAP_IDS, isBasemapId } from "./lib/mapBasemaps.mjs";
import { matchesMapRegion } from "./lib/mapRegions.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/maps/stations");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const limitArg = args.find((a) => a.startsWith("--limit"));
const limit = limitArg
  ? Number.parseInt(limitArg.split("=")[1] ?? args[args.indexOf("--limit") + 1], 10)
  : Infinity;
const stationArg = args.find((a) => a.startsWith("--station"));
const stationFilter = stationArg
  ? stationArg.includes("=")
    ? stationArg.split("=")[1]
    : args[args.indexOf("--station") + 1]
  : null;
const regionArg = args.find((a) => a.startsWith("--region"));
const regionFilter = regionArg
  ? regionArg.includes("=")
    ? regionArg.split("=")[1]
    : args[args.indexOf("--region") + 1] ?? null
  : null;
const basemapArg = args.find((a) => a.startsWith("--basemap"));
const basemapMode = basemapArg
  ? basemapArg.includes("=")
    ? basemapArg.split("=")[1]
    : args[args.indexOf("--basemap") + 1] ?? "random"
  : "random";

if (basemapMode !== "random" && !isBasemapId(basemapMode)) {
  console.error(
    `Unknown --basemap "${basemapMode}". Use random or one of: ${BASEMAP_IDS.join(", ")}`,
  );
  process.exit(1);
}

const stations = parseAllStationsFromRepo(root);

let targets = stations.filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
if (regionFilter) {
  targets = targets.filter((s) => matchesMapRegion(s, regionFilter.toLowerCase()));
}
if (stationFilter) {
  const needle = stationFilter.toLowerCase();
  targets = targets.filter(
    (s) =>
      s.name.toLowerCase() === needle ||
      s.name.toLowerCase().includes(needle) ||
      stationToSlug(s.name).includes(needle.replace(/\s+/g, "-")),
  );
}
if (Number.isFinite(limit) && limit > 0) {
  targets = targets.slice(0, limit);
}

if (!targets.length) {
  console.error("No stations matched.");
  process.exit(1);
}

if (!dryRun) {
  mkdirSync(outDir, { recursive: true });
}

const manifest = [];
const CONCURRENCY = 2;

async function renderOne(station) {
  const slug = stationToSlug(station.name);
  const outPath = join(outDir, `${slug}.png`);
  const pageUrl = `${siteUrl}/stations/${slug}`;

  if (dryRun) {
    console.log(`[dry-run] ${station.name} → ${outPath}`);
    return {
      name: station.name,
      slug,
      file: `/maps/stations/${slug}.png`,
      pageUrl,
    };
  }

  const png = await renderStationMapCard({
    station,
    siteUrl,
    basemapMode,
  });
  writeFileSync(outPath, png.buffer);
  console.log(`Wrote ${slug}.png (${station.name}, ${png.basemapId})`);
  return {
    name: station.name,
    slug,
    file: `/maps/stations/${slug}.png`,
    pageUrl,
    basemap: png.basemapId,
  };
}

let ok = 0;
let failed = 0;
const isFullRun = !stationFilter && !regionFilter && !Number.isFinite(limit);

function loadExistingManifest() {
  try {
    return JSON.parse(readFileSync(join(outDir, "manifest.json"), "utf8"));
  } catch {
    return { stations: [] };
  }
}

function mergeManifestEntries(existing, updated) {
  const bySlug = new Map((existing.stations ?? []).map((entry) => [entry.slug, entry]));
  for (const entry of updated) {
    bySlug.set(entry.slug, entry);
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function backfillManifestFromPngs(existing) {
  const bySlug = new Map((existing.stations ?? []).map((entry) => [entry.slug, entry]));
  for (const file of readdirSync(outDir)) {
    if (!file.endsWith(".png")) continue;
    const slug = file.slice(0, -4);
    if (bySlug.has(slug)) continue;
    const station = stations.find((entry) => stationToSlug(entry.name) === slug);
    if (!station) continue;
    bySlug.set(slug, {
      name: station.name,
      slug,
      file: `/maps/stations/${slug}.png`,
      pageUrl: `${siteUrl}/stations/${slug}`,
    });
  }
  return { ...existing, stations: [...bySlug.values()] };
}

for (let i = 0; i < targets.length; i += CONCURRENCY) {
  const chunk = targets.slice(i, i + CONCURRENCY);
  const results = await Promise.allSettled(chunk.map((station) => renderOne(station)));
  for (let j = 0; j < results.length; j++) {
    const result = results[j];
    const station = chunk[j];
    if (result.status === "fulfilled" && result.value) {
      ok += 1;
      manifest.push(result.value);
    } else {
      failed += 1;
      const message =
        result.status === "rejected"
          ? result.reason instanceof Error
            ? result.reason.message
            : String(result.reason)
          : "unknown";
      console.error(`Failed ${station.name}:`, message);
    }
  }
}

if (!dryRun) {
  if (isFullRun) {
    const keepSlugs = new Set(manifest.map((entry) => entry.slug));
    for (const file of readdirSync(outDir)) {
      if (!file.endsWith(".png")) continue;
      const slug = file.slice(0, -4);
      if (!keepSlugs.has(slug)) {
        unlinkSync(join(outDir, file));
        console.log(`Removed ${file}`);
      }
    }
  }

  const existingManifest = backfillManifestFromPngs(loadExistingManifest());
  const mergedStations = isFullRun
    ? manifest
    : mergeManifestEntries(existingManifest, manifest);

  writeFileSync(
    join(outDir, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        siteUrl,
        basemapMode,
        size: 1080,
        shape: "square",
        count: mergedStations.length,
        stations: mergedStations,
      },
      null,
      2,
    ),
  );
}

console.log(
  dryRun
    ? `Dry run: ${manifest.length} map(s) planned → ${outDir}`
    : `Done: ${ok} written, ${failed} failed → ${outDir}`,
);
