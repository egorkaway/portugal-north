import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  mergeStationTypes,
  stationTypesFromDepartureStats,
} from "../src/lib/cpTrainTypeMapping.ts";

const root = process.cwd();
const stationsPath = join(root, "src/data/stations.ts");
const statsPath = join(root, "data/departure-stats.json");
const write = process.argv.includes("--write");

const stats = JSON.parse(readFileSync(statsPath, "utf8"));
let stationsTs = readFileSync(stationsPath, "utf8");

const stationPattern =
  /\{ name: "([^"]+)", lines: \[([^\]]*)\], types: \[([^\]]*)\], lat: ([\d.-]+), lng: ([\d.-]+) \}/g;

const changes = [];

stationsTs = stationsTs.replace(stationPattern, (full, name, lines, typesRaw, lat, lng) => {
  const existingTypes = [...typesRaw.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const fromStats = stationTypesFromDepartureStats(stats.stations[name]?.byTrainType);
  const merged = mergeStationTypes(existingTypes, fromStats);

  const added = merged.filter((type) => !existingTypes.includes(type));
  if (added.length === 0) return full;

  changes.push({ name, added, before: existingTypes, after: merged });

  const typesLiteral = `[${merged.map((type) => `"${type}"`).join(", ")}]`;
  return `{ name: "${name}", lines: [${lines}], types: ${typesLiteral}, lat: ${lat}, lng: ${lng} }`;
});

console.log(`Station type updates from departure stats: ${changes.length}`);
for (const change of changes.sort((a, b) => a.name.localeCompare(b.name))) {
  console.log(
    `  ${change.name}: +${change.added.join(", ")} (${change.before.join(", ")} → ${change.after.join(", ")})`,
  );
}

if (write) {
  writeFileSync(stationsPath, stationsTs);
  console.log(`\nWrote ${stationsPath}`);
} else {
  console.log("\nDry run — pass --write to update stations.ts");
}
