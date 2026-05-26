#!/usr/bin/env node
/**
 * Append West/Centro (Linha do Oeste, etc.) and Douro/Aveiro corridor CP stations.
 *
 *   node scripts/add-west-douro-stations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const INSERT_MARKER = "  // Lisbon commuter belt";

const RAILWAY_LINES = {
  "6": "Linha do Douro",
  "8": "Linha do Norte",
  "13": "Linha do Douro",
  "16": "Linha do Norte",
  "20": "Linha da Beira Alta",
  "22": "Ramal de Alfarelos",
  "23": "Linha do Oeste",
  "24": "Ramal de Tomar",
  "25": "Linha do Leste",
  "30": "Linha da Beira Baixa",
  "33": "Linha do Norte",
  "58": "Ramal de Alfarelos",
};

/** CP designation → display name (accents); omit to keep CP spelling. */
const DISPLAY_NAMES = {
  Obidos: "Óbidos",
  "Chao de Macas - Fatima": "Chão de Maçãs – Fátima",
  "Famalicao da Nazare": "Famalicão da Nazaré",
  "Sao Martinho do Porto": "São Martinho do Porto",
  "Seica - Ourem": "Seiça – Ourém",
  "Pacos de Brandao": "Paços de Brandão",
  "Vila Franca de Xira": "Vila Franca de Xira",
  Regua: "Régua",
  "Silvalde - Vouga": "Silvalde – Vouga",
  "Valongo - Vouga": "Valongo – Vouga",
  "Santiago de Riba - Ul": "Santiago de Riba – Ul",
  "Sao Joao Loure": "São João Loure",
  "Barca da Amieira - Envendos": "Barca da Amieira – Envendos",
  "Freixo de Numao - Mos do Douro": "Freixo de Numão – Mós do Douro",
  "Martinganca - Maceira": "Martingança – Maceira",
  "Valado - Nazare - Alcobaca": "Valado – Nazaré – Alcobaça",
  "Riachos - Torres Novas - Golega": "Riachos – Torres Novas – Golegã",
  "Alvega - Ortiga": "Alvega – Ortiga",
  "Carrascal - Delongo": "Carrascal – Delongo",
  "Monte de Paramos": "Monte de Páramos",
  "Mourisca do Vouga": "Mourisca do Vouga",
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
  const lines = [...new Set((railways ?? []).map((r) => RAILWAY_LINES[r]).filter(Boolean))];
  return lines.length ? lines : ["Regional"];
}

function typesFromLines(lines) {
  if (lines.some((l) => l === "Linha do Norte" && lines.length === 1)) {
    return ["Regional"];
  }
  if (lines.includes("Linha do Norte")) {
    return ["Intercidades", "Regional"];
  }
  if (lines.every((l) => l === "Linha do Oeste" || l === "Ramal de Alfarelos")) {
    return ["Regional"];
  }
  if (lines.includes("Linha do Douro")) {
    return ["Regional"];
  }
  if (lines.includes("Linha do Leste") || lines.includes("Linha da Beira Baixa")) {
    return ["Regional"];
  }
  if (lines.includes("Ramal de Tomar")) {
    return ["Regional"];
  }
  return ["Regional"];
}

function isWestCentro(s) {
  const lat = +s.latitude;
  const lng = +s.longitude;
  if (lat >= 38.95 && lat <= 40.15 && lng >= -9.45 && lng <= -8.35) return true;
  return false;
}

function isDouroAveiroCorridor(s) {
  const lat = +s.latitude;
  const lng = +s.longitude;
  const r = s.railways ?? [];
  // Douro valley (Porto – Régua)
  if (lat >= 40.95 && lat <= 41.22 && lng >= -8.55 && lng <= -7.35) return true;
  // Norte: Aveiro – Espinho gaps
  if (r.includes("16") && lat >= 40.55 && lat <= 41.05 && lng >= -8.75 && lng <= -8.45) {
    return true;
  }
  // Tejo / Leste: Belver – Abrantes scenic corridor
  if (
    (r.includes("25") || r.includes("6")) &&
    lat >= 39.35 &&
    lat <= 39.65 &&
    lng >= -8.5 &&
    lng <= -7.65
  ) {
    return true;
  }
  return false;
}

function shouldInclude(s) {
  // CP halt "Regua" duplicates our Peso da Régua stop
  if (norm(s.designation) === "regua") return false;
  return isWestCentro(s) || isDouroAveiroCorridor(s);
}

const stationsTs = readFileSync(stationsPath, "utf8");
const existingNames = new Set([...stationsTs.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]));
const existingNorm = new Set([...existingNames].map(norm));

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

const forceCodes = new Set(["94-31278"]); // Vila Franca de Xira (fuzzy-skipped elsewhere)

const toAdd = cp
  .filter((s) => {
    const name = DISPLAY_NAMES[s.designation] ?? s.designation;
    if (existingNorm.has(norm(name))) return false;
    if (forceCodes.has(s.code)) return true;
    return shouldInclude(s);
  })
  .sort((a, b) => a.designation.localeCompare(b.designation));

if (toAdd.length === 0) {
  console.log("No new West/Centro or Douro corridor stations to add.");
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

if (!stationsTs.includes(INSERT_MARKER)) {
  console.error(`Marker not found: ${INSERT_MARKER}`);
  process.exit(1);
}

const block = `  // West, Centro & Douro corridor (${toAdd.length} stops)\n${entries.join("\n")}\n`;
const updated = stationsTs.replace(INSERT_MARKER, `${block}${INSERT_MARKER}`);
writeFileSync(stationsPath, updated);

console.log(`Added ${toAdd.length} stations:\n`);
for (const s of toAdd) {
  console.log(`  - ${DISPLAY_NAMES[s.designation] ?? s.designation}`);
}
execSync("node scripts/map-cp-stations.mjs", { cwd: root, stdio: "inherit" });
