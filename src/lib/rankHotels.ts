import { getTopDownvoted, getTopUpvoted } from "@/lib/rankVotes";
import type { GlobalRatings } from "@/lib/voteTypes";

export type RankedHotel = {
  id: string;
  hotelName: string;
  stationName: string;
  up: number;
  down: number;
};

export function hotelVoteKey(stationName: string, hotelName: string): string {
  return `${stationName}::${hotelName}`;
}

export function parseHotelVoteKey(key: string): { stationName: string; hotelName: string } {
  const sep = key.indexOf("::");
  if (sep <= 0) {
    return { stationName: "", hotelName: key };
  }
  return {
    stationName: key.slice(0, sep),
    hotelName: key.slice(sep + 2),
  };
}

function toRankedHotel(item: { id: string; up: number; down: number }): RankedHotel {
  const { stationName, hotelName } = parseHotelVoteKey(item.id);
  return {
    id: item.id,
    hotelName,
    stationName,
    up: item.up,
    down: item.down,
  };
}

export function getTopUpvotedHotels(ratings: GlobalRatings, limit = 3): RankedHotel[] {
  return getTopUpvoted(ratings, limit).map(toRankedHotel);
}

export function getTopDownvotedHotels(ratings: GlobalRatings, limit = 3): RankedHotel[] {
  return getTopDownvoted(ratings, limit).map(toRankedHotel);
}
