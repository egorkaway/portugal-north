import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");

async function importFromSrc(relativePath) {
  const url = pathToFileURL(path.join(repoRoot, relativePath)).href;
  return import(url);
}

export async function syncMobileData() {
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

  const airportConnectionsPath = path.join(repoRoot, "public/data/airport-connections.json");
  const airportConnections = fs.existsSync(airportConnectionsPath)
    ? JSON.parse(fs.readFileSync(airportConnectionsPath, "utf8"))
    : { generatedAt: "", runCount: 0, airportCount: 0, airports: {} };

  const airportMapVisibilityPath = path.join(repoRoot, "public/data/airport-map-visibility.json");
  const airportMapVisibility = fs.existsSync(airportMapVisibilityPath)
    ? JSON.parse(fs.readFileSync(airportMapVisibilityPath, "utf8"))
    : { generatedAt: "", hideAfterEmptyPeriods: 3, airports: {} };

  const { buildTicketGuide } = await importFromSrc("src/data/ticketGuide.ts");
  const ticketLocales = await Promise.all([
    importFromSrc("src/i18n/messages/en.ts").then((m) => ["en", m.en]),
    importFromSrc("src/i18n/messages/pt.ts").then((m) => ["pt", m.pt]),
    importFromSrc("src/i18n/messages/es.ts").then((m) => ["es", m.es]),
    importFromSrc("src/i18n/messages/gl.ts").then((m) => ["gl", m.gl]),
    importFromSrc("src/i18n/messages/ca.ts").then((m) => ["ca", m.ca]),
  ]);

  const ticketGuides = Object.fromEntries(
    ticketLocales.map(([code, messages]) => [code, buildTicketGuide(messages.tickets)]),
  );

  // Mobile-only locales (not on the website yet).
  for (const code of ["uk", "ru"]) {
    const overridePath = path.join(__dirname, `../i18n/ticketGuide/${code}.ts`);
    if (fs.existsSync(overridePath)) {
      const mod = await import(pathToFileURL(overridePath).href);
      const guide = mod.ticketGuideUk ?? mod.ticketGuideRu ?? mod.default;
      if (guide) ticketGuides[code] = guide;
    }
    if (!ticketGuides[code]) ticketGuides[code] = ticketGuides.en;
  }

  const { pexelsPhotoCredits } = await importFromSrc("src/data/pexelsPhotoCredits.ts");

  fs.writeFileSync(path.join(outDir, "stations.json"), JSON.stringify(stationsLite));
  fs.writeFileSync(path.join(outDir, "stations-full.json"), JSON.stringify(stationsFull));
  fs.writeFileSync(path.join(outDir, "cpStationCodes.json"), JSON.stringify(cpStationCodes));
  fs.writeFileSync(path.join(outDir, "stationImages.json"), JSON.stringify(stationImages));
  fs.writeFileSync(path.join(outDir, "hotels.json"), JSON.stringify(stationHotels));
  fs.writeFileSync(path.join(outDir, "summaries-en.json"), JSON.stringify(summaries));
  fs.writeFileSync(path.join(outDir, "reliability-scores.json"), JSON.stringify(reliability));
  fs.writeFileSync(
    path.join(outDir, "airport-connections.json"),
    JSON.stringify(airportConnections),
  );
  fs.writeFileSync(
    path.join(outDir, "airport-map-visibility.json"),
    JSON.stringify(airportMapVisibility),
  );
  fs.writeFileSync(path.join(outDir, "ticket-guides.json"), JSON.stringify(ticketGuides, null, 2));
  // Keep a single-locale English file for any older imports / tooling.
  fs.writeFileSync(
    path.join(outDir, "ticket-guide.json"),
    JSON.stringify(ticketGuides.en, null, 2),
  );
  fs.writeFileSync(
    path.join(outDir, "pexelsPhotoCredits.json"),
    JSON.stringify(pexelsPhotoCredits),
  );

  const stationToSlug = (name) =>
    name
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/[()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const siriCatalog = stationsFull.map((station) => ({
    id: stationToSlug(station.name),
    name: station.name,
    lines: station.lines.slice(0, 4),
    country: station.country,
  }));
  fs.writeFileSync(path.join(outDir, "stations-siri.json"), JSON.stringify(siriCatalog));

  const iosResourcesDir = path.join(__dirname, "../ios/VeryStays/Resources");
  fs.mkdirSync(iosResourcesDir, { recursive: true });
  fs.writeFileSync(
    path.join(iosResourcesDir, "stations-siri.json"),
    JSON.stringify(siriCatalog),
  );

  console.log(
    `Synced ${stationsFull.length} stations, ${Object.keys(cpStationCodes).length} CP codes, ` +
      `${Object.keys(stationImages).length} images, ${Object.keys(stationHotels).length} hotel lists, ` +
      `${Object.keys(summaries).length} summaries, ` +
      `${Object.keys(airportConnections.airports ?? {}).length} airport connection maps, ` +
      `${Object.keys(pexelsPhotoCredits).length} Pexels credits, ` +
      `ticket guides (${Object.keys(ticketGuides).join(", ")}), ` +
      `Siri catalog (${siriCatalog.length}).`,
  );
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  syncMobileData().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
