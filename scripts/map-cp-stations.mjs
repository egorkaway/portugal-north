#!/usr/bin/env node
/**
 * Match src/data/stations.ts names to CP travel-api codes and rewrite cpStationCodes.ts.
 *
 *   node scripts/map-cp-stations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stationsPath = join(root, "src/data/stations.ts");
const outPath = join(root, "src/data/cpStationCodes.ts");

function norm(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const stationsTs = readFileSync(stationsPath, "utf8");
const names = [...stationsTs.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]);

const cfg = await (await fetch("https://www.cp.pt/fe-config.json")).json();
const headers = {
  Accept: "application/json",
  "x-api-key": cfg.travelApiKey,
  "x-cp-connect-id": cfg.xcck,
  "x-cp-connect-secret": cfg.xccs,
  Origin: "https://www.cp.pt",
  Referer: "https://www.cp.pt/",
};
const cpStations = await (await fetch(`${cfg.travelApiUrl}/stations`, { headers })).json();

const byNorm = new Map(cpStations.map((s) => [norm(s.designation), s]));
const map = {};
const unmatched = [];

for (const name of names) {
  const n = norm(name);
  let hit = byNorm.get(n);
  if (!hit) {
    const tokens = new Set(n.split(" ").filter(Boolean));
    let best = null;
    let bestScore = 0;
    for (const s of cpStations) {
      const st = new Set(norm(s.designation).split(" ").filter(Boolean));
      let score = 0;
      for (const t of tokens) if (st.has(t)) score++;
      if (score > bestScore && score >= Math.min(2, tokens.size)) {
        bestScore = score;
        best = s;
      }
    }
    hit = best;
  }
  if (hit) map[name] = hit.code;
  else unmatched.push(name);
}

// Drop known bad fuzzy matches
delete map["Bragança"];

const lines = Object.entries(map)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, code]) => `  ${JSON.stringify(name)}: ${JSON.stringify(code)},`);

const content = `/** CP travel-api station codes (\`94-xxxx\`). Regenerate: node scripts/map-cp-stations.mjs */
export const cpStationCodes: Partial<Record<string, string>> = {
${lines.join("\n")}
};

export function getCpStationCode(stationName: string): string | undefined {
  return cpStationCodes[stationName];
}
`;

writeFileSync(outPath, content);
console.log(`Wrote ${Object.keys(map).length} codes to ${outPath}`);
if (unmatched.length) {
  console.log(`Unmatched (${unmatched.length}): ${unmatched.join(", ")}`);
}
