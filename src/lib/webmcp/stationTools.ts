import { stations, type Station } from "@/data/stations";
import { getCpStationCode } from "@/data/cpStationCodes";
import { fetchStationDepartures } from "@/lib/cpTravelApi";
import { getTopDownvoted, getTopUpvoted } from "@/lib/rankStations";
import { getStationBySlug, getStationPath, stationToSlug } from "@/lib/stationSlug";
import { fetchGlobalRatings } from "@/lib/votesApi";

export type StationSummary = {
  name: string;
  slug: string;
  path: string;
  lines: string[];
  types: string[];
  lat: number;
  lng: number;
  cpCode: string | null;
};

function toSummary(station: Station): StationSummary {
  return {
    name: station.name,
    slug: stationToSlug(station.name),
    path: getStationPath(station),
    lines: station.lines,
    types: station.types,
    lat: station.lat,
    lng: station.lng,
    cpCode: getCpStationCode(station.name) ?? null,
  };
}

export function resolveStation(slugOrName: string): Station | undefined {
  const trimmed = slugOrName.trim();
  if (!trimmed) return undefined;

  const bySlug = getStationBySlug(trimmed);
  if (bySlug) return bySlug;

  const lower = trimmed.toLowerCase();
  return stations.find((s) => s.name.toLowerCase() === lower);
}

export function searchStations(query: string, limit = 20): StationSummary[] {
  const capped = Math.min(Math.max(limit, 1), 50);
  const q = query.trim().toLowerCase();

  const matches = q
    ? stations.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.lines.some((line) => line.toLowerCase().includes(q)),
      )
    : [...stations];

  return matches.slice(0, capped).map(toSummary);
}

export function getStationDetails(slugOrName: string): StationSummary | { error: string } {
  const station = resolveStation(slugOrName);
  if (!station) {
    return { error: `Station not found: ${slugOrName}` };
  }
  return toSummary(station);
}

export async function getStationDepartures(input: {
  stationName?: string;
  slug?: string;
  cpCode?: string;
  limit?: number;
}): Promise<unknown> {
  const limit = Math.min(Math.max(input.limit ?? 3, 1), 10);

  let code = input.cpCode?.trim();
  if (!code) {
    const station =
      (input.slug && getStationBySlug(input.slug)) ||
      (input.stationName && resolveStation(input.stationName));
    if (!station) {
      return { error: "Provide cpCode or a valid stationName/slug." };
    }
    code = getCpStationCode(station.name);
    if (!code) {
      return { error: `No CP departures code for ${station.name}.` };
    }
  }

  try {
    const departures = await fetchStationDepartures(code, limit);
    return { cpCode: code, departures };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "departures_fetch_failed",
      cpCode: code,
    };
  }
}

export async function getCommunityRankings(limit = 5): Promise<unknown> {
  const capped = Math.min(Math.max(limit, 1), 20);
  try {
    const { ratings, configured } = await fetchGlobalRatings();
    if (!configured) {
      return { configured: false, topUpvoted: [], topDownvoted: [] };
    }
    return {
      configured: true,
      topUpvoted: getTopUpvoted(ratings, capped),
      topDownvoted: getTopDownvoted(ratings, capped),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "ratings_fetch_failed",
    };
  }
}
