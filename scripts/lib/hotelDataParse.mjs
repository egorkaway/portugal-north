import { parseHotelMap } from "./stationHotelFetch.mjs";

/**
 * @param {string} metroTs
 * @returns {Record<string, import('./stationHotelFetch.mjs').Hotel[]>}
 */
export function parseMetroHotelMap(metroTs) {
  const map = {};
  for (const match of metroTs.matchAll(/^  ("(?:[^"\\]|\\.)*"): \[([\s\S]*?)\n  \],/gm)) {
    const stationName = JSON.parse(match[1]);
    const body = match[2];
    const hotels = [
      ...body.matchAll(
        /name:\s*"([^"]+)"[\s\S]*?distanceKm:\s*([\d.]+)[\s\S]*?priceFrom:\s*(\d+)[\s\S]*?bookingUrl:\s*(?:"([^"]+)"|bookingSearch\([^)]+\))/g,
      ),
    ].map((m) => ({
      name: m[1],
      distanceKm: Number(m[2]),
      priceFrom: Number(m[3]),
      bookingUrl: m[4] ?? "",
    }));
    map[stationName] = hotels.filter((hotel) => hotel.bookingUrl);
  }
  return map;
}

/**
 * @param {string} hotelsTs
 * @param {string} [metroTs]
 * @returns {{ stationName: string, name: string, distanceKm: number, priceFrom: number, bookingUrl: string, source: string }[]}
 */
export function parseAllHotelEntries(hotelsTs, metroTs = "") {
  /** @type {{ stationName: string, name: string, distanceKm: number, priceFrom: number, bookingUrl: string, source: string }[]} */
  const entries = [];

  for (const [stationName, hotels] of Object.entries(parseHotelMap(hotelsTs))) {
    for (const hotel of hotels) {
      entries.push({ ...hotel, stationName, source: "hotels.ts" });
    }
  }

  if (metroTs) {
    for (const [stationName, hotels] of Object.entries(parseMetroHotelMap(metroTs))) {
      for (const hotel of hotels) {
        entries.push({ ...hotel, stationName, source: "metroStationAssets.ts" });
      }
    }
  }

  return entries.sort((a, b) => {
    const station = a.stationName.localeCompare(b.stationName);
    if (station !== 0) return station;
    return a.name.localeCompare(b.name);
  });
}
