import { getRedis, HASH_KEY } from "./redis.js";

type VoteDirection = "up" | "down";

export type StationRating = { up: number; down: number };
export type GlobalRatings = Record<string, StationRating>;

function field(station: string, direction: VoteDirection): string {
  return `${station}:${direction}`;
}

function parseHash(raw: Record<string, number | string> | null): GlobalRatings {
  const ratings: GlobalRatings = {};
  if (!raw) return ratings;

  for (const [key, value] of Object.entries(raw)) {
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) continue;
    const count = Math.max(0, Math.floor(n));
    const sep = key.lastIndexOf(":");
    if (sep <= 0) continue;
    const station = key.slice(0, sep);
    const dir = key.slice(sep + 1);
    if (dir !== "up" && dir !== "down") continue;
    if (!ratings[station]) ratings[station] = { up: 0, down: 0 };
    ratings[station][dir] = count;
  }

  return ratings;
}

export async function readGlobalRatings(): Promise<GlobalRatings> {
  const redis = getRedis();
  if (!redis) return {};
  const raw = await redis.hgetall<Record<string, number>>(HASH_KEY);
  return parseHash(raw);
}

export async function applyVoteDelta(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  const pipe = redis.pipeline();
  if (previous) pipe.hincrby(HASH_KEY, field(station, previous), -1);
  if (next) pipe.hincrby(HASH_KEY, field(station, next), 1);
  await pipe.exec();
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
