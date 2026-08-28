#!/usr/bin/env node
/**
 * Generate 1080×1080 square PNG area maps for each station (map tiles + brand overlay).
 * Re-run for a station whenever its lat/lng changes so the pin matches the live page.
 *
 *   npm run maps:stations
 *   npm run maps:stations -- --limit 5
 *   npm run maps:stations -- --station "Aveiro"
 *   npm run maps:stations -- --basemap=carto-voyager   # needs CARTO_API_KEY
 *   npm run maps:stations -- --basemap=random          # default: random per station
 *   npm run maps:stations -- --region=lisbon           # Lisbon metro + LIS airport
 *   npm run maps:stations -- --country=es              # Spanish stations + airports
 *   npm run maps:stations -- --missing-only            # skip stations that already have a PNG
 *   npm run maps:stations -- --watermarked-only        # Carto API-key watermark / recorded Carto maps
 *   npm run maps:stations -- --skip-europe             # skip Europe destination airports
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllStationsFromRepo, parseStations } from "./lib/stationImageFetch.mjs";
import { renderStationMapCard, stationToSlug } from "./lib/stationMapCard.mjs";
import { BASEMAP_IDS, isBasemapId } from "./lib/mapBasemaps.mjs";
import { listWatermarkedStationMapSlugs } from "./lib/mapWatermark.mjs";
import { matchesMapRegion } from "./lib/mapRegions.mjs";
import { writeStationMapAvailability } from "./write-station-map-availability.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/maps/stations");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(/\/$/, "");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const missingOnly = args.includes("--missing-only");
const watermarkedOnly = args.includes("--watermarked-only");
const skipEurope = args.includes("--skip-europe");
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
const countryArg = args.find((a) => a.startsWith("--country"));
const countryFilter = countryArg
  ? (countryArg.includes("=")
      ? countryArg.split("=")[1]
      : args[args.indexOf("--country") + 1] ?? "")
      .toLowerCase() || null
  : null;
if (countryFilter && countryFilter !== "pt" && countryFilter !== "es") {
  console.error(`Unknown --country "${countryFilter}". Use pt or es.`);
  process.exit(1);
}
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
const europeNames = new Set(
  parseStations(readFileSync(join(root, "src/data/europe/airports.ts"), "utf8")).map((s) => s.name),
);

let targets = stations.filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
if (skipEurope) {
  targets = targets.filter((s) => !europeNames.has(s.name));
}
if (countryFilter) {
  targets = targets.filter((s) => s.country === countryFilter);
}
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
if (missingOnly) {
  targets = targets.filter((s) => !existsSync(join(outDir, `${stationToSlug(s.name)}.png`)));
}
if (watermarkedOnly) {
  const found = await listWatermarkedStationMapSlugs(outDir);
  console.log(
    `Watermarked maps: ${found.slugs.length} (${found.fromManifest} Carto in manifest, ${found.fromScan} extra from scan)`,
  );
  const slugs = new Set(found.slugs);
  targets = targets.filter((s) => slugs.has(stationToSlug(s.name)));
}
if (Number.isFinite(limit) && limit > 0) {
  targets = targets.slice(0, limit);
}

if (!targets.length) {
  if (missingOnly) {
    console.log("No missing station maps.");
    if (!dryRun) {
      const availability = writeStationMapAvailability(root);
      console.log(`Availability index: ${availability.count} slug(s)`);
    }
    process.exit(0);
  }
  if (watermarkedOnly) {
    console.log("No watermarked station maps.");
    process.exit(0);
  }
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
// Only prune orphan PNGs on a true full regenerate — never when filtering or backfilling.
const isFullRun =
  !stationFilter &&
  !regionFilter &&
  !countryFilter &&
  !Number.isFinite(limit) &&
  !missingOnly &&
  !watermarkedOnly &&
  !skipEurope;

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

  const availability = writeStationMapAvailability(root);
  console.log(`Availability index: ${availability.count} slug(s)`);
}

console.log(
  dryRun
    ? `Dry run: ${manifest.length} map(s) planned → ${outDir}`
    : `Done: ${ok} written, ${failed} failed → ${outDir}`,
);
