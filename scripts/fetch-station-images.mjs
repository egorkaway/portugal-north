#!/usr/bin/env node
/**
 * Fill missing entries in src/data/stationImages.ts.
 * Prefers Wikimedia (via Wikipedia page image); falls back to Pexels search.
 *
 * Usage:
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs --pexels-only
 *   PEXELS_API_KEY=your_key node scripts/fetch-station-images.mjs --station "Oiã"
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const imagesPath = join(root, "src/data/stationImages.ts");

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const pexelsOnly = process.argv.includes("--pexels-only");
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

function appendToImagesFile(name, url) {
  let imagesTs = readFileSync(imagesPath, "utf8");
  const line = `  ${JSON.stringify(name)}: ${JSON.stringify(url)},`;
  if (imagesTs.includes(`"${name}"`)) return;
  if (imagesTs.trimEnd().endsWith("};")) {
    imagesTs = imagesTs.replace(/\n};\s*$/, `\n${line}\n};\n`);
  } else {
    imagesTs += `\n${line}\n`;
  }
  writeFileSync(imagesPath, imagesTs);
}

async function wikiThumb(title) {
  const url = new URL("https://pt.wikipedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("titles", title);
  url.searchParams.set("prop", "pageimages");
  url.searchParams.set("pithumbsize", "960");
  url.searchParams.set("format", "json");
  const res = await fetch(url, {
    headers: { "User-Agent": "portugal-north/1.0 (image-fetch; contact: verystays.com)" },
  });
  const text = await res.text();
  if (!res.ok || text.startsWith("You are making too many requests")) {
    return { thumb: null, rateLimited: true };
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { thumb: null, rateLimited: false };
  }
  const page = Object.values(data.query?.pages ?? {})[0];
  const src = page?.thumbnail?.source;
  if (!src || src.includes("Pt_ferv.png")) return { thumb: null, rateLimited: false };
  return { thumb: src, rateLimited: false };
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
  if (!pexelsOnly) {
    for (const titleFn of wikiTitles) {
      const { thumb, rateLimited } = await wikiThumb(titleFn(stationName));
      if (rateLimited) {
        console.log(`    (Wikipedia rate limited — trying Pexels)`);
        break;
      }
      if (thumb) return { url: thumb, source: "wikimedia" };
      await sleep(1200);
    }
  }

  const queries = [
    `${stationName} Portugal train station`,
    `${stationName} Portugal railway`,
    "Portugal train railway station",
  ];
  for (const query of queries) {
    const url = await pexelsSearch(query);
    if (url) return { url, source: "pexels" };
    await sleep(350);
  }
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
  console.error(`Unknown station or already has image: ${onlyStation}`);
  process.exit(1);
}

console.log(
  `Resolving images for ${targets.length} station(s)${pexelsOnly ? " (Pexels only)" : ""}...`,
);

let added = 0;
for (const name of targets) {
  try {
    const result = await resolveImage(name);
    if (result) {
      appendToImagesFile(name, result.url);
      added++;
      console.log(`  ${name}: ${result.source}`);
    } else {
      console.log(`  ${name}: NOT FOUND`);
    }
  } catch (error) {
    console.log(`  ${name}: ERROR — ${error instanceof Error ? error.message : error}`);
  }
  await sleep(600);
}

console.log(`Done. Added ${added} image(s) to ${imagesPath}`);
