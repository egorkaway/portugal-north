import { readRatingsFromBlob, writeRatingsToBlob } from "./blobVotes.js";

type VoteDirection = "up" | "down";

export type StationRating = { up: number; down: number };
export type GlobalRatings = Record<string, StationRating>;

export function applyDeltaInMemory(
  ratings: GlobalRatings,
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): GlobalRatings {
  const current = ratings[station]
    ? { ...ratings[station] }
    : { up: 0, down: 0 };

  if (previous) current[previous] = Math.max(0, current[previous] - 1);
  if (next) current[next] += 1;

  const nextRatings = { ...ratings };
  if (current.up === 0 && current.down === 0) {
    delete nextRatings[station];
  } else {
    nextRatings[station] = current;
  }
  return nextRatings;
}

export async function readGlobalRatings(): Promise<GlobalRatings> {
  return readRatingsFromBlob();
}

export async function applyVoteDelta(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const ratings = await readRatingsFromBlob();
  const updated = applyDeltaInMemory(ratings, station, previous, next);
  await writeRatingsToBlob(updated);
  return true;
}

export function isValidStationName(name: unknown): name is string {
  return typeof name === "string" && name.length >= 1 && name.length <= 120;
}

export function isValidDirection(value: unknown): value is VoteDirection | null {
  return value === null || value === "up" || value === "down";
}

export function isValidVoteChange(
  previous: VoteDirection | null,
  next: VoteDirection | null,
): boolean {
  return previous !== null || next !== null;
}
