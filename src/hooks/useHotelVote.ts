import { useSyncExternalStore } from "react";
import type { Vote, VotesMap } from "@/hooks/useStationVote";

const COOKIE_NAME = "hotel_votes";

function voteKey(stationName: string, hotelName: string): string {
  return `${stationName}::${hotelName}`;
}

function readVotes(): VotesMap {
  if (typeof document === "undefined") return {};
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1])) || {};
  } catch {
    return {};
  }
}

function writeVotes(votes: VotesMap) {
  const value = encodeURIComponent(JSON.stringify(votes));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

const listeners = new Set<() => void>();
let cache: VotesMap | null = null;

function getSnapshot(): VotesMap {
  if (cache === null) cache = readVotes();
  return cache;
}

function emit() {
  cache = readVotes();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useAllHotelVotes(): VotesMap {
  return useSyncExternalStore(subscribe, getSnapshot, () => ({}));
}

export function useHotelVote(stationName: string, hotelName: string) {
  const key = voteKey(stationName, hotelName);
  const votes = useAllHotelVotes();
  const vote: Vote = votes[key] ?? null;

  const cast = (direction: "up" | "down") => {
    const current = readVotes();
    const previous = current[key] ?? null;

    if (previous === direction) {
      delete current[key];
    } else {
      current[key] = direction;
    }

    writeVotes(current);
    emit();
  };

  return { vote, cast };
}
