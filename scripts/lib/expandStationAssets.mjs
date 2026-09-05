import { readFileSync } from "node:fs";
import { join } from "node:path";
import { formatCountryName } from "../../server/lib/countryName.ts";
import { isPlaceholderHotelName } from "./stationHotelFetch.mjs";

/** True when OSM should run: no list, or only Booking search stubs from a failed lookup. */
export function hotelListNeedsFill(hotels) {
  if (!Array.isArray(hotels) || hotels.length === 0) return true;
  return hotels.every((hotel) => isPlaceholderHotelName(hotel?.name ?? ""));
}

export function bookingStubHotels(name, country = "pt") {
  const iso = String(country ?? "pt").trim().toUpperCase();
  const nation =
    iso === "PT" ? "Portugal" : iso === "ES" ? "Spain" : formatCountryName(iso) || "Portugal";
  const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${name}, ${nation}`)}&order=price`;
  return [
    { name: `Budget stays near ${name}`, distanceKm: 0.8, priceFrom: 35, bookingUrl: url },
    { name: `Guest houses near ${name}`, distanceKm: 1.1, priceFrom: 30, bookingUrl: url },
    { name: `Hotels near ${name}`, distanceKm: 1.4, priceFrom: 25, bookingUrl: url },
  ];
}

export async function createExpandAssetContext(root) {
  const {
    parseAllStationsFromRepo,
    parseImageMap,
    seedUsedImages,
  } = await import("./stationImageFetch.mjs");
  const { parseHotelMap } = await import("./stationHotelFetch.mjs");
  const { allRejectedUrls, readImageHistory } = await import("./stationImageHistory.mjs");
  const { loadPexelsCredits } = await import("./pexelsCredits.mjs");
  const { readRejectedHotels } = await import("./rejectedHotels.mjs");

  const imagesPath = join(root, "src/data/stationImages.ts");
  const hotelsPath = join(root, "src/data/hotels.ts");
  const creditsPath = join(root, "src/data/pexelsPhotoCredits.ts");
  const imageMap = parseImageMap(readFileSync(imagesPath, "utf8"));
  const history = readImageHistory(join(root, "data/station-image-history.json"));
  return {
    root,
    imagesPath,
    hotelsPath,
    creditsPath,
    stations: parseAllStationsFromRepo(root),
    imageMap,
    usedUrls: seedUsedImages([...Object.values(imageMap), ...allRejectedUrls(history)]),
    pexelsCredits: loadPexelsCredits(creditsPath),
    hotelMap: parseHotelMap(readFileSync(hotelsPath, "utf8")),
    rejectedHotels: readRejectedHotels(join(root, "scripts/data/rejected-hotels.json")),
    apiKey: process.env.PEXELS_API_KEY ?? "",
  };
}

async function resolveUniqueImage(station, ctx) {
  const { resolveStationImage, sleep } = await import("./stationImageFetch.mjs");
  if (ctx.imageMap[station.name]) return { url: ctx.imageMap[station.name], source: "existing" };
  try {
    const result = await resolveStationImage(station, {
      apiKey: ctx.apiKey || "missing",
      usedUrls: ctx.usedUrls,
      pexelsOnly: false,
    });
    await sleep(400);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`  image ${station.name}: ERROR — ${message}`);
    return null;
  }
}

async function resolveHotelsWithRetry(station, ctx) {
  const { resolveHotelsForStation, sleep } = await import("./stationHotelFetch.mjs");
  if (!hotelListNeedsFill(ctx.hotelMap[station.name])) {
    return { hotels: ctx.hotelMap[station.name], source: "existing" };
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await resolveHotelsForStation(station, [], {
        target: 3,
        rejected: ctx.rejectedHotels,
      });
      if (result.added.length) {
        return { hotels: result.curated, source: "osm" };
      }
      break;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`  hotels ${station.name}: attempt ${attempt + 1} failed (${message})`);
      if (attempt === 0) await sleep(2000);
    }
  }
  return { hotels: bookingStubHotels(station.name, station.country), source: "stubs" };
}

/** Unique photo required; OSM hotels with Booking stubs if the lookup is empty or errors. */
export async function resolveExpandedStationAssets(station, ctx) {
  const image = await resolveUniqueImage(station, ctx);
  const inCatalog = ctx.stations.some((row) => row.name === station.name);
  if (!image?.url && !inCatalog) {
    return { image: null, hotels: [], hotelSource: "skipped" };
  }
  const hotels = await resolveHotelsWithRetry(station, ctx);
  return { image, hotels: hotels.hotels, hotelSource: hotels.source };
}

export async function persistExpandedStationAssets(station, assets, ctx) {
  const { updateImageInMap, writeImageMap } = await import("./stationImageFetch.mjs");
  const { writeHotelMap } = await import("./stationHotelFetch.mjs");
  const { pexelsPhotoIdFromUrl, upsertPexelsCredit, writePexelsCredits } = await import(
    "./pexelsCredits.mjs"
  );

  if (assets.image?.url && !ctx.imageMap[station.name]) {
    updateImageInMap(ctx.imageMap, station.name, assets.image.url);
    if (assets.image.credit && ctx.apiKey) {
      const photoId = pexelsPhotoIdFromUrl(assets.image.url);
      upsertPexelsCredit(ctx.pexelsCredits, photoId, assets.image.credit);
      writePexelsCredits(ctx.creditsPath, ctx.pexelsCredits);
    }
    writeImageMap(ctx.imagesPath, ctx.imageMap);
    console.log(`  image ${station.name}: ${assets.image.source}`);
  } else if (!assets.image?.url) {
    console.log(`  image ${station.name}: NOT FOUND`);
  }

  if (hotelListNeedsFill(ctx.hotelMap[station.name]) && assets.hotels?.length) {
    ctx.hotelMap[station.name] = assets.hotels;
    writeHotelMap(ctx.hotelsPath, ctx.hotelMap, ctx.stations);
    console.log(
      assets.hotelSource === "osm"
        ? `  hotels ${station.name}: +${assets.hotels.length}`
        : assets.hotelSource === "existing"
          ? `  hotels ${station.name}: already listed`
          : `  hotels ${station.name}: Booking stubs (no OSM listings)`,
    );
  }
}

export async function fillExpandedStationAssets(picked, ctx) {
  const missingImages = [];
  for (const raw of picked) {
    const station = {
      name: raw.name,
      lines: raw.lines ?? [],
      types: raw.types ?? [],
      lat: raw.lat,
      lng: raw.lng,
      country: raw.country ?? "pt",
    };
    const assets = await resolveExpandedStationAssets(station, ctx);
    if (!assets.image?.url && !ctx.imageMap[station.name]) missingImages.push(station.name);
    await persistExpandedStationAssets(station, assets, ctx);
  }
  return { missingImages };
}

/** Photos and hotels for destination airports that have compact station pages. */
export async function fillExternalAirportPageAssets(rootDir) {
  const { loadEnvFile } = await import("./stationImageFetch.mjs");
  loadEnvFile(join(rootDir, ".env"));
  const { EXTERNAL_AIRPORT_PAGE_IATAS } = await import("../../src/data/externalAirportPageIatas.ts");
  const { europeDestinationAirports } = await import("../../src/data/europe/airports.ts");
  const pageIatas = new Set(
    EXTERNAL_AIRPORT_PAGE_IATAS.map((iata) => String(iata).trim().toUpperCase()),
  );
  const picked = europeDestinationAirports.filter((station) =>
    pageIatas.has(String(station.lines[0] ?? "").trim().toUpperCase()),
  );
  if (!picked.length) return { missingImages: [] };
  const ctx = await createExpandAssetContext(rootDir);
  console.log(`Filling images/hotels for ${picked.length} external airport page(s)…`);
  return fillExpandedStationAssets(picked, ctx);
}
