/** Discover hotels near stations via OpenStreetMap (Overpass API). */

import { writeFileSync } from "node:fs";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const USER_AGENT = "portugal-north-hotel-fetch/1.0 (https://www.verystays.com)";

const PLACEHOLDER_NAME = /^(Hotels|Guest houses|Budget stays) near /i;

const TOURISM_TYPES = new Set([
  "hotel",
  "guest_house",
  "hostel",
  "motel",
  "chalet",
]);

export function isPlaceholderHotelName(name) {
  return PLACEHOLDER_NAME.test(name);
}

export function parseHotelMap(ts) {
  const map = {};
  for (const match of ts.matchAll(/^  ("(?:[^"\\]|\\.)*"): \[([\s\S]*?)\n  \],/gm)) {
    const name = JSON.parse(match[1]);
    const body = match[2];
    const hotels = [
      ...body.matchAll(
        /name:\s*"([^"]+)"[\s\S]*?distanceKm:\s*([\d.]+)[\s\S]*?priceFrom:\s*(\d+)[\s\S]*?bookingUrl:\s*"([^"]+)"/g,
      ),
    ].map((m) => ({
      name: m[1],
      distanceKm: Number(m[2]),
      priceFrom: Number(m[3]),
      bookingUrl: m[4],
    }));
    map[name] = hotels;
  }
  return map;
}

export function writeHotelMap(hotelsPath, map, stationOrder) {
  const orderNames = stationOrder?.map((s) => s.name) ?? [];
  const mapKeys = Object.keys(map).filter((n) => map[n]?.length);
  const names = orderNames.length
    ? [
        ...orderNames.filter((n) => map[n]?.length),
        ...mapKeys.filter((n) => !orderNames.includes(n)).sort((a, b) => a.localeCompare(b)),
      ]
    : mapKeys.sort((a, b) => a.localeCompare(b));

  const blocks = names.map((stationName) => {
    const hotels = map[stationName];
    const lines = hotels.map(
      (h) =>
        `    { name: ${JSON.stringify(h.name)}, distanceKm: ${h.distanceKm}, priceFrom: ${h.priceFrom}, bookingUrl: ${JSON.stringify(h.bookingUrl)} },`,
    );
    return `  ${JSON.stringify(stationName)}: [\n${lines.join("\n")}\n  ],`;
  });

  const content = `export interface Hotel {
  name: string;
  distanceKm: number;
  priceFrom: number; // EUR per night
  bookingUrl: string;
}

export type StationHotels = Record<string, Hotel[]>;

// Recommended budget hotels within ~2km of each station
// Prices are approximate starting rates in EUR
export const stationHotels: StationHotels = {
${blocks.join("\n")}
};
`;
  writeFileSync(hotelsPath, content);
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function elementCoords(element) {
  if (element.type === "node") return { lat: element.lat, lng: element.lon };
  if (element.center) return { lat: element.center.lat, lng: element.center.lon };
  return null;
}

function isAccommodation(element) {
  const tags = element.tags ?? {};
  const tourism = tags.tourism;
  const amenity = tags.amenity;
  if (tourism && TOURISM_TYPES.has(tourism)) return true;
  if (amenity === "hotel" || amenity === "guest_house" || amenity === "hostel") return true;
  return false;
}

function estimatePrice(tags) {
  const t = tags.tourism ?? tags.amenity ?? "hotel";
  if (t === "hostel") return 25;
  if (t === "guest_house") return 30;
  if (t === "motel") return 32;
  return 38;
}

export function bookingSearchUrl(query) {
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(query)}&order=price`;
}

function bookingUrlFor(tags, hotelName, stationName) {
  const website = tags.website ?? tags["contact:website"] ?? "";
  if (/booking\.com/i.test(website)) return website;
  return bookingSearchUrl(`${hotelName}, ${stationName}, Portugal`);
}

function normName(name) {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export async function fetchNearbyHotels(station, { radiusM = 2000 } = {}) {
  const query = `[out:json][timeout:45];
(
  nwr["tourism"~"hotel|guest_house|hostel|motel"](around:${radiusM},${station.lat},${station.lng});
  nwr["amenity"~"hotel|guest_house|hostel"](around:${radiusM},${station.lat},${station.lng});
);
out center tags;`;

  let res = null;
  let lastError = null;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(3000 * attempt);

    const attemptRes = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (attemptRes.ok) {
      res = attemptRes;
      break;
    }
    lastError = new Error(`overpass_http_${attemptRes.status}`);
    if (attemptRes.status !== 429 && attemptRes.status !== 504) break;
  }

  if (!res) throw lastError ?? new Error("overpass_failed");

  const data = await res.json();
  const seen = new Set();
  const hotels = [];

  for (const element of data.elements ?? []) {
    if (!isAccommodation(element)) continue;
    const tags = element.tags ?? {};
    const name = tags.name?.trim();
    if (!name || name.length < 3) continue;

    const coords = elementCoords(element);
    if (!coords) continue;

    const key = normName(name);
    if (seen.has(key)) continue;
    seen.add(key);

    const distanceKm = Math.round(haversineKm(station.lat, station.lng, coords.lat, coords.lng) * 10) / 10;
    if (distanceKm > radiusM / 1000 + 0.5) continue;

    hotels.push({
      name,
      distanceKm,
      priceFrom: estimatePrice(tags),
      bookingUrl: bookingUrlFor(tags, name, station.name),
      source: tags.tourism ?? tags.amenity ?? "hotel",
    });
  }

  hotels.sort((a, b) => a.distanceKm - b.distanceKm);
  return hotels;
}

export async function resolveHotelsForStation(station, existingHotels, { target = 3 } = {}) {
  const curated = existingHotels.filter((h) => !isPlaceholderHotelName(h.name));
  const needed = target - curated.length;
  if (needed <= 0) return { curated, added: [], skipped: "full" };

  let radiusM = 2000;
  let candidates = await fetchNearbyHotels(station, { radiusM });
  if (candidates.length < needed) {
    radiusM = 3500;
    candidates = await fetchNearbyHotels(station, { radiusM });
  }

  const existingKeys = new Set(curated.map((h) => normName(h.name)));
  const added = [];

  for (const candidate of candidates) {
    if (added.length >= needed) break;
    const key = normName(candidate.name);
    if (existingKeys.has(key)) continue;
    existingKeys.add(key);
    added.push({
      name: candidate.name,
      distanceKm: candidate.distanceKm,
      priceFrom: candidate.priceFrom,
      bookingUrl: candidate.bookingUrl,
    });
  }

  return {
    curated: [...curated, ...added],
    added,
    radiusM,
    skipped: added.length ? undefined : "not_found",
  };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
