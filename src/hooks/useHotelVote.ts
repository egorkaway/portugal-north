import { useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Vote, VotesMap } from "@/hooks/useStationVote";
import { hotelVoteKey } from "@/lib/rankHotels";
import { syncHotelVoteToServer } from "@/lib/votesApi";

const COOKIE_NAME = "hotel_votes";

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
  const queryClient = useQueryClient();
  const key = hotelVoteKey(stationName, hotelName);
  const votes = useAllHotelVotes();
  const vote: Vote = votes[key] ?? null;

  const cast = (direction: "up" | "down") => {
    const current = readVotes();
    const previous = current[key] ?? null;
    let next: "up" | "down" | null;

    if (previous === direction) {
      delete current[key];
      next = null;
    } else {
      current[key] = direction;
      next = direction;
    }

    writeVotes(current);
    emit();
    void syncHotelVoteToServer(key, previous, next).then(() => {
      queryClient.invalidateQueries({ queryKey: ["global-ratings"] });
    });
  };

  return { vote, cast };
}
