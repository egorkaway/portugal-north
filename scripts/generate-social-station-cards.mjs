#!/usr/bin/env node
/**
 * Generate 1080×1080 PNG social cards for each station (photo + name + promo copy).
 *
 *   npm run social:stations
 *   npm run social:stations -- --limit 5
 *   npm run social:stations -- --station "Aveiro"
 *   npm run social:stations -- --dry-run
 *
 * Stations without a real photo in stationImages.ts are skipped.
 */
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseAllStationsFromRepo,
  parseImageMap,
} from "./lib/stationImageFetch.mjs";
import {
  isPlaceholderImageUrl,
  pickTagline,
  renderSocialCard,
  stationToSlug,
} from "./lib/socialCard.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/social/stations");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://www.verystays.com").replace(
  /\/$/,
  "",
);

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const limitArg = args.find((a) => a.startsWith("--limit"));
const limit = limitArg ? Number.parseInt(limitArg.split("=")[1] ?? args[args.indexOf("--limit") + 1], 10) : Infinity;
const stationArg = args.find((a) => a.startsWith("--station"));
const stationFilter = stationArg
  ? (stationArg.includes("=")
      ? stationArg.split("=")[1]
      : args[args.indexOf("--station") + 1])
  : null;

const stations = parseAllStationsFromRepo(root);
const imageMap = parseImageMap(
  readFileSync(join(root, "src/data/stationImages.ts"), "utf8"),
);

function hasStationPhoto(stationName) {
  return !isPlaceholderImageUrl(imageMap[stationName]);
}

const withoutPhoto = stations.filter((s) => !hasStationPhoto(s.name));

let targets = stations.filter((s) => hasStationPhoto(s.name));
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
  if (stationFilter) {
    const matches = stations.filter(
      (s) =>
        s.name.toLowerCase().includes(stationFilter.toLowerCase()) ||
        stationToSlug(s.name).includes(stationFilter.replace(/\s+/g, "-")),
    );
    if (matches.some((s) => !hasStationPhoto(s.name))) {
      console.error(`No card generated: "${stationFilter}" has no station photo.`);
      process.exit(1);
    }
  }
  console.error("No stations with photos matched.");
  process.exit(1);
}

if (!dryRun) {
  mkdirSync(outDir, { recursive: true });
}

const manifest = [];
const CONCURRENCY = 6;

async function renderOne(station) {
  const slug = stationToSlug(station.name);
  const imageUrl = imageMap[station.name];
  const outPath = join(outDir, `${slug}.png`);
  const pageUrl = `${siteUrl}/stations/${slug}`;

  if (dryRun) {
    console.log(`[dry-run] ${station.name} → ${outPath}`);
    return {
      name: station.name,
      slug,
      file: `/social/stations/${slug}.png`,
      pageUrl,
      tagline: pickTagline(station.name),
    };
  }

  const png = await renderSocialCard({
    stationName: station.name,
    slug,
    imageUrl,
    siteUrl,
    primaryLine: station.lines[0],
  });
  writeFileSync(outPath, png);
  console.log(`Wrote ${slug}.png (${station.name})`);
  return {
    name: station.name,
    slug,
    file: `/social/stations/${slug}.png`,
    pageUrl,
    tagline: pickTagline(station.name),
  };
}

let ok = 0;
let failed = 0;
const isFullRun = !stationFilter && !Number.isFinite(limit);

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
        console.log(`Removed ${file} (no station photo)`);
      }
    }
  }

  writeFileSync(
    join(outDir, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        siteUrl,
        size: 1080,
        count: manifest.length,
        skippedWithoutPhoto: isFullRun ? withoutPhoto.length : undefined,
        stations: manifest,
      },
      null,
      2,
    ),
  );
}

const skippedNote =
  isFullRun || dryRun
    ? `, ${withoutPhoto.length} skipped (no photo)`
    : "";

console.log(
  dryRun
    ? `Dry run: ${manifest.length} card(s) planned${skippedNote} → ${outDir}`
    : `Done: ${ok} written${skippedNote}, ${failed} failed → ${outDir}`,
);
