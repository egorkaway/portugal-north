#!/usr/bin/env node
/**
 * Audit station/airport coordinates against OpenStreetMap railway/aerodrome nodes.
 *
 *   node scripts/audit-station-coordinates.mjs --report
 *   node scripts/audit-station-coordinates.mjs --fix --threshold=1
 *   node scripts/audit-station-coordinates.mjs --fix --threshold=1 --write-list
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseAllStationsFromRepo } from "./lib/stationImageFetch.mjs";
import { haversineKm } from "./lib/stationHotelFetch.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "VeryStays-CoordAudit/1.0 (+https://www.verystays.com)";

const reportOnly = process.argv.includes("--report") || !process.argv.includes("--fix");
const writeList = process.argv.includes("--write-list");
const thresholdKm = Number(
  (process.argv.find((a) => a.startsWith("--threshold=")) ?? "--threshold=1").split("=")[1],
);

const SOURCE_FILES = [
  "src/data/stations.ts",
  "src/data/portugal/airports.ts",
  "src/data/spain/stations.ts",
  "src/data/spain/airports.ts",
  "src/data/metroPortoStations.ts",
  "src/data/metroLisboaStations.ts",
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normName(name) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s*\(metro[^)]*\)\s*$/i, "")
    .replace(/\s*\([a-z]{3,4}\)\s*$/i, "")
    .replace(/\s+airport\s*$/i, "")
    .replace(/\s+aeroporto\s*$/i, "")
    .replace(/\s+aeropuerto\s*$/i, "")
    .replace(/\b(estacao|estacion|estação|estación|halte|halt)\b/gi, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isAirport(station) {
  return /airport|aeroporto|aeropuerto/i.test(station.name) || station.lines?.some((l) => /airport/i.test(l));
}

async function overpass(query) {
  let lastError = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await sleep(4000 * attempt);
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
      },
      body: `data=${encodeURIComponent(query)}`,
    });
    if (res.ok) return res.json();
    lastError = new Error(`overpass_http_${res.status}`);
    if (res.status !== 429 && res.status !== 504) break;
  }
  throw lastError ?? new Error("overpass_failed");
}

function elementCoords(el) {
  if (el.type === "node" && Number.isFinite(el.lat) && Number.isFinite(el.lon)) {
    return { lat: el.lat, lng: el.lon };
  }
  if (el.center && Number.isFinite(el.center.lat) && Number.isFinite(el.center.lon)) {
    return { lat: el.center.lat, lng: el.center.lon };
  }
  return null;
}

/** Iberia bbox: PT + ES mainland + islands roughly */
async function fetchOsmTransport() {
  const query = `[out:json][timeout:180];
(
  node["railway"="station"](35.5,-10.5,44.5,4.5);
  node["railway"="halt"](35.5,-10.5,44.5,4.5);
  node["railway"="stop"](35.5,-10.5,44.5,4.5);
  node["railway"="tram_stop"](35.5,-10.5,44.5,4.5);
  node["railway"="subway_entrance"](35.5,-10.5,44.5,4.5);
  node["station"="subway"](35.5,-10.5,44.5,4.5);
  node["aerialway"="station"](35.5,-10.5,44.5,4.5);
  node["aeroway"="aerodrome"](35.5,-10.5,44.5,4.5);
  way["railway"="station"](35.5,-10.5,44.5,4.5);
  way["aeroway"="aerodrome"](35.5,-10.5,44.5,4.5);
  relation["aeroway"="aerodrome"](35.5,-10.5,44.5,4.5);
);
out center tags;`;

  console.log("Fetching OSM railway/aerodrome nodes for Iberia (this can take a minute)…");
  const data = await overpass(query);
  const items = [];
  for (const el of data.elements ?? []) {
    const tags = el.tags ?? {};
    const name = tags.name?.trim() || tags["name:pt"]?.trim() || tags["name:es"]?.trim();
    if (!name) continue;
    const coords = elementCoords(el);
    if (!coords) continue;
    const kind =
      tags.aeroway === "aerodrome"
        ? "aerodrome"
        : tags.railway === "subway_entrance" || tags.station === "subway"
          ? "metro"
          : tags.railway === "tram_stop"
            ? "tram"
            : "rail";
    items.push({
      name,
      norm: normName(name),
      lat: coords.lat,
      lng: coords.lng,
      kind,
      osmType: el.type,
      osmId: el.id,
    });
  }
  console.log(`Loaded ${items.length} OSM named transport nodes.`);
  return items;
}

function nameScore(a, b) {
  if (a === b) return 100;
  if (!a || !b) return 0;
  // Only treat containment as strong when the shorter string is meaningful (≥5 chars)
  // — avoids Bragança→Gan, Amarante→Mar false positives.
  const shorter = a.length <= b.length ? a : b;
  const longer = a.length <= b.length ? b : a;
  if (shorter.length >= 5 && longer.includes(shorter)) return 85;
  const aw = new Set(a.split(" ").filter((w) => w.length > 2));
  const bw = new Set(b.split(" ").filter((w) => w.length > 2));
  if (!aw.size || !bw.size) return 0;
  let overlap = 0;
  for (const w of aw) if (bw.has(w)) overlap += 1;
  return (overlap / Math.max(aw.size, bw.size)) * 60;
}

function findBestMatch(station, osmItems) {
  const wantAirport = isAirport(station);
  const stationNorm = normName(station.name);
  let best = null;

  for (const item of osmItems) {
    if (wantAirport && item.kind !== "aerodrome") continue;
    if (!wantAirport && item.kind === "aerodrome") continue;

    const score = nameScore(stationNorm, item.norm);
    if (score < 50) continue;

    // Prefer exact name; penalize metro matched to airport and vice versa already filtered.
    // Avoid mapping "Coimbra" → "Coimbra-B" when names aren't equal unless score is exact.
    if (score < 100 && item.norm !== stationNorm && item.norm.startsWith(`${stationNorm} `)) {
      continue;
    }
    if (score < 100 && item.norm !== stationNorm && /-[a-z]$/.test(item.norm.replace(stationNorm, "").trim())) {
      // e.g. coimbra vs coimbra-b
      const suffix = item.norm.slice(stationNorm.length);
      if (/^[\s-]+[a-z0-9]+$/.test(suffix) && suffix.length <= 4) continue;
    }

    const distKm = haversineKm(station.lat, station.lng, item.lat, item.lng);
    // Prefer close matches; allow farther if name is exact
    const ranking = score * 10 - Math.min(distKm, 50);
    if (!best || ranking > best.ranking) {
      best = { ...item, score, distKm, ranking };
    }
  }

  // Fallback: nearest same-kind OSM node within 15 km with weak name overlap
  if (!best || best.distKm > 25) {
    let nearest = null;
    for (const item of osmItems) {
      if (wantAirport && item.kind !== "aerodrome") continue;
      if (!wantAirport && item.kind === "aerodrome") continue;
      const distKm = haversineKm(station.lat, station.lng, item.lat, item.lng);
      if (distKm > 15) continue;
      const score = nameScore(stationNorm, item.norm);
      if (score < 40 && distKm > 2) continue;
      if (!nearest || distKm < nearest.distKm) {
        nearest = { ...item, score, distKm, ranking: score * 10 - distKm };
      }
    }
    if (nearest && (!best || nearest.distKm < best.distKm)) best = nearest;
  }

  return best;
}

function roundCoord(n) {
  return Math.round(n * 10000) / 10000;
}

function updateCoordsInFile(relPath, updates) {
  const path = join(root, relPath);
  let text = readFileSync(path, "utf8");
  let changed = 0;
  for (const u of updates) {
    const escaped = u.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(
      `(\\{\\s*name:\\s*"${escaped}"[^}]*?lat:\\s*)([\\d.-]+)(\\s*,\\s*lng:\\s*)([\\d.-]+)`,
      "s",
    );
    const next = text.replace(re, (_, a, _lat, c, _lng) => {
      changed += 1;
      return `${a}${u.newLat}${c}${u.newLng}`;
    });
    if (next === text) {
      console.warn(`  WARN: could not patch ${u.name} in ${relPath}`);
    }
    text = next;
  }
  if (changed) writeFileSync(path, text);
  return changed;
}

function fileForStation(station) {
  // Re-parse which file by searching
  for (const rel of SOURCE_FILES) {
    const text = readFileSync(join(root, rel), "utf8");
    if (text.includes(`name: "${station.name}"`)) return rel;
  }
  return null;
}

const stations = parseAllStationsFromRepo(root);
const osmItems = await fetchOsmTransport();

const mismatches = [];
const unmatched = [];
let ok = 0;

for (const station of stations) {
  const match = findBestMatch(station, osmItems);
  if (!match) {
    unmatched.push(station.name);
    continue;
  }
  // Reject absurd long-range "matches" (wrong town with similar short name).
  const maxPlausibleKm = match.score >= 100 ? 40 : 20;
  if (match.distKm > maxPlausibleKm) {
    unmatched.push(`${station.name} (best OSM ${match.name} @ ${match.distKm.toFixed(1)} km — skipped)`);
    continue;
  }
  if (match.distKm >= thresholdKm && match.score >= 50) {
    mismatches.push({
      name: station.name,
      country: station.country,
      oldLat: station.lat,
      oldLng: station.lng,
      newLat: roundCoord(match.lat),
      newLng: roundCoord(match.lng),
      distKm: Math.round(match.distKm * 100) / 100,
      osmName: match.name,
      score: Math.round(match.score),
      kind: match.kind,
      file: fileForStation(station),
    });
  } else {
    ok += 1;
  }
}

mismatches.sort((a, b) => b.distKm - a.distKm);

console.log(`\nOK within ${thresholdKm} km: ${ok}`);
console.log(`Mismatches ≥ ${thresholdKm} km: ${mismatches.length}`);
console.log(`No OSM match: ${unmatched.length}`);
if (unmatched.length && unmatched.length <= 40) {
  console.log(`  Unmatched: ${unmatched.join(", ")}`);
}

for (const m of mismatches) {
  console.log(
    `  ${m.name}: ${m.distKm} km — (${m.oldLat}, ${m.oldLng}) → (${m.newLat}, ${m.newLng}) [${m.osmName}, score=${m.score}]`,
  );
}

const reportPath = join(root, "data/station-coordinate-audit.json");
writeFileSync(
  reportPath,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), thresholdKm, mismatches, unmatched }, null, 2)}\n`,
);
console.log(`\nWrote ${reportPath}`);

if (writeList) {
  const names = mismatches.map((m) => m.name);
  writeFileSync(join(root, "data/stations-to-remap.txt"), `${names.join("\n")}\n`);
  console.log(`Wrote data/stations-to-remap.txt (${names.length} names)`);
}

if (!reportOnly && mismatches.length) {
  const byFile = new Map();
  for (const m of mismatches) {
    if (!m.file) continue;
    if (!byFile.has(m.file)) byFile.set(m.file, []);
    byFile.get(m.file).push(m);
  }
  let total = 0;
  for (const [file, list] of byFile) {
    const n = updateCoordsInFile(file, list);
    total += n;
    console.log(`Updated ${n} in ${file}`);
  }
  console.log(`\nApplied ${total} coordinate fix(es).`);
} else if (reportOnly) {
  console.log("\nReport only. Re-run with --fix to apply updates.");
}
