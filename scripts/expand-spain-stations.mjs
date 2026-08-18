#!/usr/bin/env node
/**
 * Add the next batch of Spanish stations seen in Renfe trip-update logs.
 *
 *   npm run stats:spain-expand
 *   npm run stats:spain-expand -- --dry-run
 *   npm run stats:spain-expand -- --limit 3
 *
 * Also invoked from collect-departure-stats.mjs after Spain reliability sampling.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const STATIONS_PATH = join(root, "src/data/spain/stations.ts");
const ADIF_PATH = join(root, "src/data/spainAdifStopIds.ts");
const IMAGES_PATH = join(root, "src/data/stationImages.ts");
const HOTELS_PATH = join(root, "src/data/hotels.ts");
const CREDITS_PATH = join(root, "src/data/pexelsPhotoCredits.ts");
const HISTORY_PATH = join(root, "data/station-image-history.json");
const DELAY_LOG_PATH = join(root, "data/spain-train-delay-log.ndjson");

const SUMMARY_FILES = {
  en: join(root, "src/data/stationSummaries/spain/en.ts"),
  es: join(root, "src/data/stationSummaries/spain/es.ts"),
  pt: join(root, "src/data/stationSummaries/spain/pt.ts"),
  gl: join(root, "src/data/stationSummaries/spain/gl.ts"),
  ca: join(root, "src/data/stationSummaries/spain/ca.ts"),
};

function insertBeforeMarker(content, marker, insertion) {
  const index = content.lastIndexOf(marker);
  if (index === -1) throw new Error(`marker not found: ${marker}`);
  const prefix = content.slice(0, index).replace(/[ \t]+$/, "");
  const block = insertion.startsWith("\n") ? insertion : `\n${insertion}`;
  return `${prefix}${block}${content.slice(index).replace(/^\n+/, "\n")}`;
}

function stationTsBlock(station) {
  const lines = station.lines.map((line) => JSON.stringify(line)).join(", ");
  const types = station.types.map((type) => JSON.stringify(type)).join(", ");
  return `  {
    name: ${JSON.stringify(station.name)},
    country: "es",
    lines: [${lines}],
    types: [${types}],
    lat: ${station.lat},
    lng: ${station.lng},
  },
`;
}

function summaryTemplates(name, kinds) {
  const cerc = kinds.includes("cercanias");
  const longDistance = kinds.includes("longDistance");
  const serviceEn =
    cerc && longDistance
      ? "Cercanías and long-distance"
      : cerc
        ? "Cercanías"
        : "long-distance";
  const serviceEs =
    cerc && longDistance ? "cercanías y larga distancia" : cerc ? "cercanías" : "larga distancia";
  const servicePt =
    cerc && longDistance ? "cercanías e longa distância" : cerc ? "cercanías" : "longa distância";
  const serviceGl =
    cerc && longDistance ? "cercanías e longa distancia" : cerc ? "cercanías" : "longa distancia";
  const serviceCa =
    cerc && longDistance ? "rodalies i llarga distància" : cerc ? "rodalies" : "llarga distància";
  return {
    en: `${name} is a Renfe ${serviceEn} station in Spain. It is a practical rail stop for exploring the surrounding area, with live boards for suburban and long-distance services.`,
    es: `${name} es una estación de Renfe de ${serviceEs} en España. Es una parada práctica para explorar los alrededores, con paneles en vivo de cercanías y larga distancia.`,
    pt: `${name} é uma estação Renfe de ${servicePt} em Espanha. É uma paragem prática para explorar os arredores, com painéis em direto de suburbanos e longa distância.`,
    gl: `${name} é unha estación de Renfe de ${serviceGl} en España. É unha parada práctica para explorar os arredores, con paneis en directo de suburbanos e longa distancia.`,
    ca: `${name} és una estació de Renfe de ${serviceCa} a Espanya. És una parada pràctica per explorar els voltants, amb panells en directe de rodalies i llarga distància.`,
  };
}

function appendSummary(filePath, name, text) {
  const current = readFileSync(filePath, "utf8");
  if (current.includes(JSON.stringify(name))) return false;
  const block = `  ${JSON.stringify(name)}:\n    ${JSON.stringify(text)},\n`;
  writeFileSync(filePath, insertBeforeMarker(current, "\n};", block));
  return true;
}

function appendSpainStation(station) {
  const current = readFileSync(STATIONS_PATH, "utf8");
  if (current.includes(`name: ${JSON.stringify(station.name)}`)) return;
  writeFileSync(STATIONS_PATH, insertBeforeMarker(current, "\n];", stationTsBlock(station)));
}

function appendAdifIds(name, stopIds) {
  const current = readFileSync(ADIF_PATH, "utf8");
  if (current.includes(`${JSON.stringify(name)}:`)) return;
  const ids = stopIds.map((id) => JSON.stringify(id)).join(", ");
  const line = `  ${JSON.stringify(name)}: [${ids}],\n`;
  writeFileSync(
    ADIF_PATH,
    insertBeforeMarker(current, "\n};\n\nexport function normalizeSpainStopId", line),
  );
}

function spainStubHotels(name) {
  const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${name}, Spain`)}&order=price`;
  return [
    { name: `Budget stays near ${name}`, distanceKm: 0.8, priceFrom: 35, bookingUrl: url },
    { name: `Guest houses near ${name}`, distanceKm: 1.1, priceFrom: 30, bookingUrl: url },
    { name: `Hotels near ${name}`, distanceKm: 1.4, priceFrom: 25, bookingUrl: url },
  ];
}

export async function expandSpainStations(options = {}) {
  const dryRun = Boolean(options.dryRun);
  const limit = Number(options.limit ?? 3);
  const { loadEnvFile, parseAllStationsFromRepo, parseImageMap, resolveStationImage, seedUsedImages, updateImageInMap, writeImageMap, sleep } =
    await import("./lib/stationImageFetch.mjs");
  const { loadSpainGtfsStops } = await import("./lib/spainGtfsStops.mjs");
  const { pickNextSpainStations } = await import("../src/lib/spainStationCandidates.ts");
  const { readSpainTrainDelayLog } = await import("../server/lib/spainTrainDelayLog.ts");
  const { parseHotelMap, resolveHotelsForStation, writeHotelMap } = await import(
    "./lib/stationHotelFetch.mjs"
  );
  const { allRejectedUrls, readImageHistory } = await import("./lib/stationImageHistory.mjs");
  const { loadPexelsCredits, pexelsPhotoIdFromUrl, upsertPexelsCredit, writePexelsCredits } =
    await import("./lib/pexelsCredits.mjs");
  const { readRejectedHotels } = await import("./lib/rejectedHotels.mjs");

  loadEnvFile(join(root, ".env"));

  const existing = parseAllStationsFromRepo(root);
  const observations = readSpainTrainDelayLog(DELAY_LOG_PATH).map((entry) => ({
    stopId: entry.stopId,
    kind: entry.kind,
  }));
  if (!observations.length) {
    console.log("Spain expand skipped: no trip-update samples yet.");
    return { added: [], skipped: "no_observations" };
  }

  let stops;
  try {
    stops = await loadSpainGtfsStops(root);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Spain expand skipped: GTFS stops failed (${message})`);
    return { added: [], skipped: "gtfs_failed" };
  }

  const picked = pickNextSpainStations({
    stops,
    observations,
    existing,
    limit,
  });
  if (!picked.length) {
    console.log("Spain expand: no new catalog candidates this run.");
    return { added: [], skipped: "none" };
  }

  console.log(
    `${dryRun ? "[dry-run] " : ""}Spain expand: adding ${picked.length} station(s) — ${picked
      .map((row) => `${row.name} (${row.observations} samples)`)
      .join("; ")}`,
  );

  if (dryRun) return { added: picked.map((row) => row.name), skipped: undefined, dryRun: true };

  for (const station of picked) {
    appendSpainStation(station);
    appendAdifIds(station.name, station.stopIds);
    const summaries = summaryTemplates(station.name, station.kinds);
    for (const [locale, filePath] of Object.entries(SUMMARY_FILES)) {
      appendSummary(filePath, station.name, summaries[locale]);
    }
  }

  const stations = parseAllStationsFromRepo(root);
  const imageMap = parseImageMap(readFileSync(IMAGES_PATH, "utf8"));
  const history = readImageHistory(HISTORY_PATH);
  const usedUrls = seedUsedImages([...Object.values(imageMap), ...allRejectedUrls(history)]);
  const pexelsCredits = loadPexelsCredits(CREDITS_PATH);
  const apiKey = process.env.PEXELS_API_KEY ?? "";
  const hotelMap = parseHotelMap(readFileSync(HOTELS_PATH, "utf8"));
  const rejectedHotels = readRejectedHotels(join(root, "scripts/data/rejected-hotels.json"));

  for (const candidate of picked) {
    const station = {
      name: candidate.name,
      lines: candidate.lines,
      types: candidate.types,
      lat: candidate.lat,
      lng: candidate.lng,
      country: "es",
    };

    if (!imageMap[station.name]) {
      try {
        const result = await resolveStationImage(station, {
          apiKey: apiKey || "missing",
          usedUrls,
          pexelsOnly: false,
        });
        if (result) {
          updateImageInMap(imageMap, station.name, result.url);
          if (result.credit && apiKey) {
            const photoId = pexelsPhotoIdFromUrl(result.url);
            upsertPexelsCredit(pexelsCredits, photoId, result.credit);
            writePexelsCredits(CREDITS_PATH, pexelsCredits);
          }
          writeImageMap(IMAGES_PATH, imageMap);
          console.log(`  image ${station.name}: ${result.source}`);
        } else {
          console.log(`  image ${station.name}: NOT FOUND`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  image ${station.name}: ERROR — ${message}`);
      }
      await sleep(400);
    }

    if (!hotelMap[station.name]?.length) {
      try {
        const result = await resolveHotelsForStation(station, [], { target: 3, rejected: rejectedHotels });
        hotelMap[station.name] = result.added.length ? result.curated : spainStubHotels(station.name);
        writeHotelMap(HOTELS_PATH, hotelMap, stations);
        console.log(
          result.added.length
            ? `  hotels ${station.name}: +${result.added.length}`
            : `  hotels ${station.name}: Booking stubs (no OSM listings)`,
        );
      } catch (error) {
        hotelMap[station.name] = spainStubHotels(station.name);
        writeHotelMap(HOTELS_PATH, hotelMap, stations);
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  hotels ${station.name}: stubs after error (${message})`);
      }
      await sleep(1500);
    }
  }

  return { added: picked.map((row) => row.name) };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const dryRun = process.argv.includes("--dry-run");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : 3;
  expandSpainStations({ dryRun, limit }).then((result) => {
    if (result.added?.length) {
      console.log(`Done: ${result.added.join(", ")}`);
    }
    process.exit(0);
  });
}
