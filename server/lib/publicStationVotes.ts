import { europeDestinationAirports } from "../../src/data/europe/airports.js";
import {
  mergeAliasedHotelClosedReports,
  mergeAliasedHotelRatings,
} from "../../src/lib/hotelVoteAliases.js";
import type { GlobalRatings, HotelClosedReports } from "./voteLogic.js";
import type { CommunityVotesBlob } from "./blobVotes.js";

const destinationAirportNames = new Set(
  europeDestinationAirports.map((station) => station.name),
);

export function isDestinationAirportVoteName(name: string): boolean {
  return destinationAirportNames.has(name);
}

export function isVotableStationName(name: string): boolean {
  return !destinationAirportNames.has(name);
}

export function isVotableHotelKey(key: string): boolean {
  const sep = key.indexOf("::");
  const stationName = sep > 0 ? key.slice(0, sep) : "";
  return stationName.length > 0 && isVotableStationName(stationName);
}

function hotelStationName(key: string): string {
  const sep = key.indexOf("::");
  return sep > 0 ? key.slice(0, sep) : "";
}

export function omitDestinationAirportRatings(ratings: GlobalRatings): GlobalRatings {
  const next: GlobalRatings = {};
  for (const [name, counts] of Object.entries(ratings)) {
    if (!destinationAirportNames.has(name)) next[name] = counts;
  }
  return next;
}

export function omitDestinationAirportKeyedRecords<T>(
  records: Record<string, T>,
): Record<string, T> {
  const next: Record<string, T> = {};
  for (const [key, value] of Object.entries(records)) {
    if (!destinationAirportNames.has(hotelStationName(key))) next[key] = value;
  }
  return next;
}

export function filterCommunityVotesForPublicStations(
  data: CommunityVotesBlob,
): CommunityVotesBlob {
  return {
    ratings: omitDestinationAirportRatings(data.ratings),
    hotelRatings: mergeAliasedHotelRatings(
      omitDestinationAirportKeyedRecords(data.hotelRatings),
    ),
    imageRatings: omitDestinationAirportRatings(data.imageRatings),
    hotelClosedReports: mergeAliasedHotelClosedReports(
      omitDestinationAirportKeyedRecords(data.hotelClosedReports),
    ),
  };
}

export function destinationAirportVoteNames(): string[] {
  return [...destinationAirportNames];
}
