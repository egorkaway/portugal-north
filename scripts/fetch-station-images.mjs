#!/usr/bin/env node
/**
 * Fill missing entries in src/data/stationImages.ts.
 * Prefers Wikimedia (via Wikipedia page image); falls back to Pexels search.
 *
 * Usage:
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs --station "Oiã"
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const imagesPath = join(root, "src/data/stationImages.ts");

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const onlyStation = process.argv.includes("--station")
  ? process.argv[process.argv.indexOf("--station") + 1]
  : null;

if (!PEXELS_KEY) {
  console.error("Set PEXELS_API_KEY in the environment (see .env.example).");
  process.exit(1);
}

function parseStationNames(ts) {
  return [...ts.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]);
}

function parseImageMap(ts) {
  const map = {};
  for (const m of ts.matchAll(/"([^"]+)": "(https:\/\/[^"]+)"/g)) {
    map[m[1]] = m[2];
  }
  return map;
}

async function wikiThumb(title) {
  const url = new URL("https://pt.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", title);
  url.searchParams.set("prop", "pageimages");
  url.searchParams.set("pithumbsize", "960");
  url.searchParams.set("format", "json");
  const res = await fetch(url, {
    headers: { "User-Agent": "portugal-north/1.0" },
  });
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const src = page?.thumbnail?.source;
  if (!src || src.includes("Pt_ferv.png")) return null;
  return src;
}

async function pexelsSearch(query) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "1");
  url.searchParams.set("orientation", "landscape");
  const res = await fetch(url, {
    headers: { Authorization: PEXELS_KEY },
  });
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const photo = data.photos?.[0];
  return photo?.src?.large ?? null;
}

const wikiTitles = [
  (s) => `Apeadeiro de ${s}`,
  (s) => `Estação Ferroviária de ${s}`,
  (s) => `Estação Ferroviária da ${s}`,
  (s) => `${s} train station`,
];

async function resolveImage(stationName) {
  for (const titleFn of wikiTitles) {
    const thumb = await wikiThumb(titleFn(stationName));
    if (thumb) return { url: thumb, source: "wikimedia" };
    await sleep(400);
  }
  const query = `${stationName} Portugal train railway`;
  const url = await pexelsSearch(query);
  if (url) return { url, source: "pexels" };
  return null;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const stations = parseStationNames(readFileSync(stationsPath, "utf8"));
const images = parseImageMap(readFileSync(imagesPath, "utf8"));
const targets = onlyStation
  ? stations.filter((s) => s === onlyStation)
  : stations.filter((s) => !images[s]);

if (onlyStation && targets.length === 0) {
  console.error(`Unknown station: ${onlyStation}`);
  process.exit(1);
}

console.log(`Resolving images for ${targets.length} station(s)...`);

const additions = {};
for (const name of targets) {
  const result = await resolveImage(name);
  if (result) {
    additions[name] = result.url;
    console.log(`  ${name}: ${result.source}`);
  } else {
    console.log(`  ${name}: NOT FOUND`);
  }
  await sleep(500);
}

if (Object.keys(additions).length === 0) {
  console.log("Nothing to add.");
  process.exit(0);
}

let imagesTs = readFileSync(imagesPath, "utf8");
const insertLines = Object.entries(additions)
  .map(([name, url]) => `  "${name}": "${url}",`)
  .join("\n");

if (imagesTs.trimEnd().endsWith("};")) {
  imagesTs = imagesTs.replace(/\n};\s*$/, `\n${insertLines}\n};\n`);
} else {
  imagesTs += `\n${insertLines}\n`;
}

writeFileSync(imagesPath, imagesTs);
console.log(`Updated ${imagesPath}`);
