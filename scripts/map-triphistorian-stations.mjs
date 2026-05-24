#!/usr/bin/env node
/**
 * Match src/data/stations.ts to TripHistorian station IDs and rewrite
 * src/data/tripHistorianStationIds.ts.
 *
 *   node scripts/map-triphistorian-stations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const outPath = join(root, "src/data/tripHistorianStationIds.ts");

const SEARCH_URL = "https://triphistorian.com/api/airports/search";

function norm(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/ railway station$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const r = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

function parseStations(ts) {
  const entries = [];
  const re =
    /name: "([^"]+)"[^}]*lat: ([-\d.]+)[^}]*lng: ([-\d.]+)/gs;
  let m;
  while ((m = re.exec(ts)) !== null) {
    entries.push({ name: m[1], lat: Number(m[2]), lng: Number(m[3]) });
  }
  return entries;
}

function searchQueries(name) {
  const base = name
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const hyphenAsSpace = name.replace(/\s*\([^)]*\)\s*/g, " ").replace(/-/g, " ").trim();
  return [
    ...new Set([
      base,
      hyphenAsSpace,
      `${base} Railway Station`,
      `${hyphenAsSpace} Railway Station`,
      name.replace(/-/g, " "),
    ]),
  ];
}

function isRailHit(hit) {
  return hit.transportMode === "rail" || hit.type === "train_station";
}

function scoreHit(hit, station) {
  const hitNorm = norm(hit.name);
  const stationNorm = norm(station.name);
  const baseNorm = norm(station.name.replace(/\s*\([^)]*\)\s*/g, " "));
  let score = 0;
  if (hitNorm === stationNorm || hitNorm === baseNorm) score += 100;
  else if (hitNorm.startsWith(baseNorm) || baseNorm.startsWith(hitNorm)) score += 60;
  else if (hitNorm.includes(baseNorm) || baseNorm.includes(hitNorm)) score += 30;

  const lat = Number(hit.latitude);
  const lng = Number(hit.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const km = haversineKm(station.lat, station.lng, lat, lng);
    if (km <= 1.5) score += 80 - km * 20;
    else if (km <= 5) score += 40 - km * 5;
    else if (km <= 15) score += 5 - km;
    else score -= km * 2;
  }
  if (isRailHit(hit)) score += 20;
  return score;
}

async function search(q) {
  const res = await fetch(`${SEARCH_URL}?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function matchStation(station) {
  const seen = new Map();
  for (const q of searchQueries(station.name)) {
    for (const hit of await search(q)) {
      if (!isRailHit(hit)) continue;
      const prev = seen.get(hit.id);
      const scored = { hit, score: scoreHit(hit, station) };
      if (!prev || scored.score > prev.score) seen.set(hit.id, scored);
    }
    await new Promise((r) => setTimeout(r, 60));
  }
  const ranked = [...seen.values()].sort((a, b) => b.score - a.score);
  const best = ranked[0];
  if (!best || best.score < 35) return null;
  const lat = Number(best.hit.latitude);
  const lng = Number(best.hit.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const km = haversineKm(station.lat, station.lng, lat, lng);
    if (km > 8) return null;
  }
  return best.hit.id;
}

const stationsTs = readFileSync(stationsPath, "utf8");
const stations = parseStations(stationsTs);
const map = {};
const unmatched = [];

for (const station of stations) {
  const id = await matchStation(station);
  if (id != null) map[station.name] = id;
  else unmatched.push(station.name);
  process.stderr.write(`\r${Object.keys(map).length}/${stations.length} matched`);
}

process.stderr.write("\n");

const lines = Object.entries(map)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, id]) => `  ${JSON.stringify(name)}: ${id},`);

const content = `/** TripHistorian hub IDs for /stations/:id. Regenerate: node scripts/map-triphistorian-stations.mjs */
export const TRIP_HISTORIAN_BASE = "https://triphistorian.com";

export const tripHistorianStationIds: Partial<Record<string, number>> = {
${lines.join("\n")}
};

export function getTripHistorianStationUrl(stationName: string): string | undefined {
  const id = tripHistorianStationIds[stationName];
  if (id == null) return undefined;
  return \`\${TRIP_HISTORIAN_BASE}/stations/\${id}\`;
}
`;

writeFileSync(outPath, content);
console.log(`Wrote ${Object.keys(map).length} mappings to ${outPath}`);
if (unmatched.length) {
  console.log(`Unmatched (${unmatched.length}):`);
  for (const name of unmatched) console.log(`  - ${name}`);
}
