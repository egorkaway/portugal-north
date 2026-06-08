#!/usr/bin/env node
/**
 * Generate 1080×1080 PNG social cards for each station (photo + name + promo copy).
 *
 *   npm run social:stations
 *   npm run social:stations -- --limit 5
 *   npm run social:stations -- --station "Aveiro"
 *   npm run social:stations -- --dry-run
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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

let targets = stations;
if (stationFilter) {
  const needle = stationFilter.toLowerCase();
  targets = stations.filter(
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
const CONCURRENCY = 6;

async function renderOne(station) {
  const slug = stationToSlug(station.name);
  const imageUrl = imageMap[station.name];
  const outPath = join(outDir, `${slug}.png`);
  const pageUrl = `${siteUrl}/stations/${slug}`;

  if (dryRun) {
    console.log(
      `[dry-run] ${station.name} → ${outPath}${isPlaceholderImageUrl(imageUrl) ? " (placeholder photo)" : ""}`,
    );
    return {
      name: station.name,
      slug,
      file: `/social/stations/${slug}.png`,
      pageUrl,
      tagline: pickTagline(station.name),
      hasPhoto: !isPlaceholderImageUrl(imageUrl),
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
    hasPhoto: !isPlaceholderImageUrl(imageUrl),
  };
}

let ok = 0;
let skipped = 0;

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
      skipped += 1;
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
  writeFileSync(
    join(outDir, "manifest.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        siteUrl,
        size: 1080,
        count: manifest.length,
        stations: manifest,
      },
      null,
      2,
    ),
  );
}

console.log(
  dryRun
    ? `Dry run: ${manifest.length} card(s) planned in ${outDir}`
    : `Done: ${ok} written, ${skipped} failed → ${outDir}`,
);
