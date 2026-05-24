#!/usr/bin/env node
/**
 * Append Lisbon commuter-belt CP stations to src/data/stations.ts and refresh cpStationCodes.ts.
 *
 *   node scripts/add-lisbon-commuter-stations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");

const RAILWAY_LINES = {
  "8": "Linha do Norte",
  "28": "Linha de Sintra",
  "29": "Linha de Cintura",
  "32": "Linha de Cascais",
  "34": "Linha do Sado",
  "37": "Linha do Sul",
  "57": "Linha de Cintura",
  "65": "Linha do Sudoeste",
  "66": "Linha do Sudoeste",
};

/** CP designation → display name (accents); omit to keep CP spelling. */
const DISPLAY_NAMES = {
  "Agualva - Cacem": "Agualva - Cacém",
  Alges: "Algés",
  "Algueirao - Mem Martins": "Algueirão - Mem Martins",
  Belem: "Belém",
  "Monte Abraao": "Monte Abraão",
  "Paco de Arcos": "Paço de Arcos",
  "Praca do Quebedo": "Praça do Quebedo",
  "Reguengo - Vale da Pedra - Pontevel": "Reguengo - Vale da Pedra - Pontevel",
};

function norm(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function linesFromRailways(railways) {
  const lines = [...new Set(railways.map((r) => RAILWAY_LINES[r]).filter(Boolean))];
  return lines.length ? lines : ["Lisboa Urbano"];
}

function typesFromLines(lines) {
  const urbanOnly = lines.every((l) =>
    ["Linha de Sintra", "Linha de Cascais", "Linha de Cintura", "Lisboa Urbano"].includes(l),
  );
  if (urbanOnly) return ["Urban"];
  if (lines.includes("Linha do Norte")) return ["Urban", "Regional"];
  return ["Urban", "Regional"];
}

function isLisbonCommuter(s) {
  const lat = +s.latitude;
  const c = s.code;
  if (/^94-69/.test(c)) return true;
  if (/^94-6(0|10|60|70)/.test(c)) return true;
  if (/^94-95/.test(c) && lat <= 38.67) return true;
  if (/^94-3[13]/.test(c) && lat >= 38.73 && lat <= 39.15 && +s.longitude >= -9.2) return true;
  if (/^94-68/.test(c) && lat < 38.58) return true;
  return false;
}

function matched(cpName, ourNorm) {
  const n = norm(cpName);
  if (ourNorm.has(n)) return true;
  const tokens = new Set(n.split(" ").filter(Boolean));
  for (const on of ourNorm.keys()) {
    const ot = new Set(on.split(" ").filter(Boolean));
    let score = 0;
    for (const t of tokens) if (ot.has(t)) score++;
    if (score >= Math.min(2, tokens.size)) return true;
  }
  return false;
}

const stationsTs = readFileSync(stationsPath, "utf8");
const existingNames = new Set([...stationsTs.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]));
const ourNorm = new Map([...existingNames].map((n) => [norm(n), n]));

const cfg = await (await fetch("https://www.cp.pt/fe-config.json")).json();
const cp = await (
  await fetch(`${cfg.travelApiUrl}/stations`, {
    headers: {
      Accept: "application/json",
      "x-api-key": cfg.travelApiKey,
      "x-cp-connect-id": cfg.xcck,
      "x-cp-connect-secret": cfg.xccs,
      Origin: "https://www.cp.pt",
      Referer: "https://www.cp.pt/",
    },
  })
).json();

const toAdd = cp
  .filter((s) => !matched(s.designation, ourNorm) && isLisbonCommuter(s))
  .sort((a, b) => a.designation.localeCompare(b.designation));

if (toAdd.length === 0) {
  console.log("No new Lisbon commuter stations to add.");
  process.exit(0);
}

const entries = toAdd.map((s) => {
  const name = DISPLAY_NAMES[s.designation] ?? s.designation;
  const lines = linesFromRailways(s.railways ?? []);
  const types = typesFromLines(lines);
  const lat = +(+s.latitude).toFixed(4);
  const lng = +(+s.longitude).toFixed(4);
  const linesJson = lines.map((l) => JSON.stringify(l)).join(", ");
  const typesJson = types.map((t) => JSON.stringify(t)).join(", ");
  return `  { name: ${JSON.stringify(name)}, lines: [${linesJson}], types: [${typesJson}], lat: ${lat}, lng: ${lng} },`;
});

const marker = "  // Lisbon south bank & Oeste";
if (!stationsTs.includes(marker)) {
  console.error(`Marker not found: ${marker}`);
  process.exit(1);
}

const block = `  // Lisbon commuter belt (${toAdd.length} stops)\n${entries.join("\n")}\n`;
const updated = stationsTs.replace(marker, `${block}${marker}`);
writeFileSync(stationsPath, updated);

console.log(`Added ${toAdd.length} stations to ${stationsPath}`);
execSync("node scripts/map-cp-stations.mjs", { cwd: root, stdio: "inherit" });
