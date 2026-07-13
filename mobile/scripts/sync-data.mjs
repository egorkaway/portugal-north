import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

async function importFromSrc(relativePath) {
  const url = pathToFileURL(path.join(repoRoot, relativePath)).href;
  return import(url);
}

async function main() {
  const [
    { allStations },
    { cpStationCodes },
    { stationImages },
    { stationHotels },
    { stationSummariesEn },
    { spainSummariesEn },
  ] = await Promise.all([
    importFromSrc("src/data/stationRegistry.ts"),
    importFromSrc("src/data/cpStationCodes.ts"),
    importFromSrc("src/data/stationImages.ts"),
    importFromSrc("src/data/hotels.ts"),
    importFromSrc("src/data/stationSummaries/en.ts"),
    importFromSrc("src/data/stationSummaries/spain/en.ts"),
  ]);

  const outDir = path.join(__dirname, "../data");
  fs.mkdirSync(outDir, { recursive: true });

  const stationsFull = allStations.map((s) => ({
    name: s.name,
    lines: s.lines,
    types: s.types,
    lat: s.lat,
    lng: s.lng,
    country: s.country,
  }));

  const stationsLite = stationsFull.map(({ name, lat, lng }) => ({ name, lat, lng }));
  const summaries = { ...stationSummariesEn, ...spainSummariesEn };

  const reliabilityPath = path.join(repoRoot, "public/data/reliability-scores.json");
  const reliability = JSON.parse(fs.readFileSync(reliabilityPath, "utf8"));

  const { en } = await importFromSrc("src/i18n/messages/en.ts");
  const { buildTicketGuide } = await importFromSrc("src/data/ticketGuide.ts");
  const ticketGuide = buildTicketGuide(en.tickets);

  fs.writeFileSync(path.join(outDir, "stations.json"), JSON.stringify(stationsLite));
  fs.writeFileSync(path.join(outDir, "stations-full.json"), JSON.stringify(stationsFull));
  fs.writeFileSync(path.join(outDir, "cpStationCodes.json"), JSON.stringify(cpStationCodes));
  fs.writeFileSync(path.join(outDir, "stationImages.json"), JSON.stringify(stationImages));
  fs.writeFileSync(path.join(outDir, "hotels.json"), JSON.stringify(stationHotels));
  fs.writeFileSync(path.join(outDir, "summaries-en.json"), JSON.stringify(summaries));
  fs.writeFileSync(path.join(outDir, "reliability-scores.json"), JSON.stringify(reliability));
  fs.writeFileSync(path.join(outDir, "ticket-guide.json"), JSON.stringify(ticketGuide, null, 2));

  console.log(
    `Synced ${stationsFull.length} stations, ${Object.keys(cpStationCodes).length} CP codes, ` +
      `${Object.keys(stationImages).length} images, ${Object.keys(stationHotels).length} hotel lists, ` +
      `${Object.keys(summaries).length} summaries, ticket guide (${ticketGuide.countries.length} countries).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
