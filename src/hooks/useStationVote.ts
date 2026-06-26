import { useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { trackVoteCast } from "@/lib/posthogEvents";
import { syncVoteToServer } from "@/lib/votesApi";

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

export function castStationVote(
  stationName: string,
  direction: "up" | "down",
  onSynced?: () => void,
): Vote {
  const current = readVotes();
  const previous = current[stationName] ?? null;
  let next: "up" | "down" | null;

  if (previous === direction) {
    delete current[stationName];
    next = null;
  } else {
    current[stationName] = direction;
    next = direction;
  }

  writeVotes(current);
  emit();
  trackVoteCast({
    voteType: "station",
    stationName,
    previous,
    next,
  });
  void syncVoteToServer(stationName, previous, next).then(() => {
    onSynced?.();
  });

  return next;
}

export function useStationVote(stationName: string) {
  const queryClient = useQueryClient();
  const votes = useAllVotes();
  const vote: Vote = votes[stationName] ?? null;

  const cast = (direction: "up" | "down") => {
    castStationVote(stationName, direction, () => {
      queryClient.invalidateQueries({ queryKey: ["global-ratings"] });
    });
  };

  return { vote, cast };
}
