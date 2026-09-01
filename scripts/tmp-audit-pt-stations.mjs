#!/usr/bin/env node
/**
 * Compare Portuguese CP stations in src/data/stations.ts against CP's
 * current GTFS stops (publico.cp.pt) — stations with passenger service.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gtfsDir = process.argv[2] || "/tmp/cp-gtfs";

function norm(s) {
  return String(s)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/sao /g, "sao ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\bporto\b$/, "")
    .trim();
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

function gtfsCodeToCp(stopId) {
  return String(stopId).replace(/^94_/, "94-");
}

const stationsTs = readFileSync(join(root, "src/data/stations.ts"), "utf8");
const start = stationsTs.indexOf("const cpStations");
const end = stationsTs.indexOf("];", start) + 2;
const block = stationsTs.slice(start, end);
const our = [...block.matchAll(/\{\s*name: "([^"]+)",[\s\S]*?types: \[([^\]]*)\]/g)].map((m) => ({
  name: m[1],
  types: m[2],
  inactive: /Inactive/.test(m[2]),
}));

const codesTs = readFileSync(join(root, "src/data/cpStationCodes.ts"), "utf8");
const codeByName = new Map(
  [...codesTs.matchAll(/"([^"]+)":\s*"(94-\d+)"/g)].map((m) => [m[1], m[2]]),
);

const ourByCode = new Map();
const ourByNorm = new Map();
for (const s of our) {
  const code = codeByName.get(s.name);
  if (code) ourByCode.set(code, s);
  ourByNorm.set(norm(s.name), s);
}

const stops = parseCsv(readFileSync(join(gtfsDir, "stops.txt"), "utf8"));
const stopTimes = parseCsv(readFileSync(join(gtfsDir, "stop_times.txt"), "utf8"));
const hits = new Map();
for (const row of stopTimes) {
  hits.set(row.stop_id, (hits.get(row.stop_id) || 0) + 1);
}

const missing = [];
const matched = [];
for (const stop of stops) {
  const code = gtfsCodeToCp(stop.stop_id);
  const n = norm(stop.stop_name);
  const hit = ourByCode.get(code) || ourByNorm.get(n);
  const activity = hits.get(stop.stop_id) || 0;
  if (hit) matched.push({ stop, ours: hit, activity });
  else missing.push({ stop, code, activity, name: stop.stop_name });
}

missing.sort((a, b) => b.activity - a.activity || a.name.localeCompare(b.name));

const ourActive = our.filter((s) => !s.inactive);
const ourActiveUnmatched = ourActive.filter((s) => {
  const code = codeByName.get(s.name);
  if (code && stops.some((st) => gtfsCodeToCp(st.stop_id) === code)) return false;
  const n = norm(s.name);
  return !stops.some((st) => norm(st.stop_name) === n);
});

console.log(`CP GTFS stops: ${stops.length}`);
console.log(`Our CP catalog: ${our.length} (${ourActive.length} active, ${our.length - ourActive.length} inactive/historic)`);
console.log(`Matched to GTFS: ${matched.length}`);
console.log(`GTFS stops not in our catalog: ${missing.length}`);
console.log(`Our active stations not in GTFS: ${ourActiveUnmatched.length}`);

const withTrains = missing.filter((m) => m.activity > 0);
const noTrains = missing.filter((m) => m.activity === 0);
console.log(`  of which with stop_times (active in this feed): ${withTrains.length}`);
console.log(`  listed in stops.txt with no stop_times: ${noTrains.length}`);

console.log("\nMissing active CP stops (in GTFS stop_times), busiest first:");
for (const m of withTrains) {
  console.log(`  ${String(m.activity).padStart(5)}  ${m.code.padEnd(10)}  ${m.name}`);
}

if (noTrains.length) {
  console.log("\nGTFS stops with no scheduled trains (probably unused):");
  for (const m of noTrains) {
    console.log(`  ${m.code.padEnd(10)}  ${m.name}`);
  }
}

if (ourActiveUnmatched.length) {
  console.log("\nOur active CP stations not found in GTFS:");
  for (const s of ourActiveUnmatched) {
    console.log(`  ${(codeByName.get(s.name) || "no-code").padEnd(10)}  ${s.name}`);
  }
}
