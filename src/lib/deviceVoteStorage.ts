import { readCookieJson } from "./cookieJson";
import type { GlobalRatings, GlobalRatingsResult, VoteDirection } from "./voteTypes";

export const VOTE_COOKIE_NAMES = {
  station: "station_votes",
  hotel: "hotel_votes",
  stationImage: "station_image_votes",
  hotelClosed: "hotel_closed_reports",
} as const;

type DirectionVotes = Record<string, VoteDirection>;

function directionVotesToRatings(votes: DirectionVotes): GlobalRatings {
  const ratings: GlobalRatings = {};
  for (const [id, direction] of Object.entries(votes)) {
    ratings[id] = {
      up: direction === "up" ? 1 : 0,
      down: direction === "down" ? 1 : 0,
    };
  }
  return ratings;
}

export function readDeviceVoteMaps() {
  return {
    station: readCookieJson<DirectionVotes>(VOTE_COOKIE_NAMES.station),
    hotel: readCookieJson<DirectionVotes>(VOTE_COOKIE_NAMES.hotel),
    stationImage: readCookieJson<DirectionVotes>(VOTE_COOKIE_NAMES.stationImage),
    hotelClosed: readCookieJson<Record<string, true>>(VOTE_COOKIE_NAMES.hotelClosed),
  };
}

export function buildRatingsFromDeviceVotes(): GlobalRatingsResult {
  const maps = readDeviceVoteMaps();
  return {
    ratings: directionVotesToRatings(maps.station),
    hotelRatings: directionVotesToRatings(maps.hotel),
    imageRatings: directionVotesToRatings(maps.stationImage),
    configured: true,
    source: "device",
  };
}

export function hasDeviceVotes(result: GlobalRatingsResult): boolean {
  const all = [
    ...Object.values(result.ratings),
    ...Object.values(result.hotelRatings),
    ...Object.values(result.imageRatings),
  ];
  return all.some((r) => r.up > 0 || r.down > 0);
}
