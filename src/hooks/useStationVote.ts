import { useEffect, useState, useSyncExternalStore } from "react";

export type Vote = "up" | "down" | null;
export type VotesMap = Record<string, "up" | "down">;

const COOKIE_NAME = "station_votes";

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

// Simple pub/sub so all consumers stay in sync within one tab.
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

export function useAllVotes(): VotesMap {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => ({}) as VotesMap,
  );
}

export function useStationVote(stationName: string) {
  const votes = useAllVotes();
  const vote: Vote = votes[stationName] ?? null;

  const cast = (next: "up" | "down") => {
    const current = readVotes();
    if (current[stationName] === next) {
      delete current[stationName];
    } else {
      current[stationName] = next;
    }
    writeVotes(current);
    emit();
  };

  return { vote, cast };
}
