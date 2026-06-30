import type { VoteDirection } from "@/lib/voteTypes";

export const STATION_IMAGE_VOTES_COOKIE = "station_image_votes";

export type StationImageVoteEntry = {
  vote: VoteDirection;
  imageUrl: string;
};

export type StationImageVotesMap = Record<string, StationImageVoteEntry | VoteDirection>;

export function normalizeStationImageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url;
  }
}

function parseEntry(
  entry: StationImageVoteEntry | VoteDirection | undefined,
): StationImageVoteEntry | null {
  if (!entry) return null;
  if (entry === "up" || entry === "down") {
    return { vote: entry, imageUrl: "" };
  }
  if (typeof entry === "object" && (entry.vote === "up" || entry.vote === "down")) {
    return entry;
  }
  return null;
}

export function readStationImageVotes(): StationImageVotesMap {
  if (typeof document === "undefined") return {};
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${STATION_IMAGE_VOTES_COOKIE}=`));
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1])) || {};
  } catch {
    return {};
  }
}

export function writeStationImageVotes(votes: StationImageVotesMap) {
  const value = encodeURIComponent(JSON.stringify(votes));
  document.cookie = `${STATION_IMAGE_VOTES_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function getStationImageVoteForUrl(
  votes: StationImageVotesMap,
  stationName: string,
  imageUrl: string,
): VoteDirection | null {
  const entry = parseEntry(votes[stationName]);
  if (!entry) return null;

  const current = normalizeStationImageUrl(imageUrl);
  const votedOn = normalizeStationImageUrl(entry.imageUrl);
  if (!votedOn || votedOn !== current) return null;

  return entry.vote;
}

export function setStationImageVoteForUrl(
  stationName: string,
  imageUrl: string,
  vote: VoteDirection | null,
): VoteDirection | null {
  const votes = readStationImageVotes();
  if (vote === null) {
    delete votes[stationName];
  } else {
    votes[stationName] = { vote, imageUrl: normalizeStationImageUrl(imageUrl) };
  }
  writeStationImageVotes(votes);
  return vote;
}

/** Vote on a replaced image, including legacy cookies without an image URL. */
export function getStaleStationImageVote(
  votes: StationImageVotesMap,
  stationName: string,
  imageUrl: string,
): VoteDirection | null {
  const entry = parseEntry(votes[stationName]);
  if (!entry) return null;

  const current = normalizeStationImageUrl(imageUrl);
  const votedOn = normalizeStationImageUrl(entry.imageUrl);
  if (votedOn && votedOn === current) return null;

  return entry.vote;
}

export function clearStationImageVote(stationName: string) {
  const votes = readStationImageVotes();
  if (!(stationName in votes)) return false;
  delete votes[stationName];
  writeStationImageVotes(votes);
  return true;
}
