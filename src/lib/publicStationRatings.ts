import { pageStations } from "@/data/stationRegistry";
import type { GlobalRatings } from "@/lib/voteTypes";

/** Stations that still have public pages (Iberian rail + PT/ES hub airports). */
const publicStationNames = new Set(pageStations.map((station) => station.name));

export function isPublicStationVoteName(name: string): boolean {
  return publicStationNames.has(name);
}

function hotelStationName(key: string): string {
  const sep = key.indexOf("::");
  return sep > 0 ? key.slice(0, sep) : "";
}

/** Drop leftover votes for places that no longer have `/stations/:slug` pages. */
export function pickPublicStationRatings(ratings: GlobalRatings): GlobalRatings {
  const next: GlobalRatings = {};
  for (const [name, counts] of Object.entries(ratings)) {
    if (publicStationNames.has(name)) next[name] = counts;
  }
  return next;
}

/** Hotel / closed-report keys are `stationName::hotelName`. */
export function pickPublicHotelRatings<T>(ratings: Record<string, T>): Record<string, T> {
  const next: Record<string, T> = {};
  for (const [key, value] of Object.entries(ratings)) {
    if (publicStationNames.has(hotelStationName(key))) next[key] = value;
  }
  return next;
}
