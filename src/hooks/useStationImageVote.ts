import { useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Vote, VotesMap } from "@/hooks/useStationVote";
import { trackVoteCast } from "@/lib/posthogEvents";
import { syncStationImageVoteToServer } from "@/lib/votesApi";

const COOKIE_NAME = "station_image_votes";

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

export function useStationImageVote(stationName: string) {
  const queryClient = useQueryClient();
  const votes = useSyncExternalStore(subscribe, getSnapshot, () => ({}));
  const vote: Vote = votes[stationName] ?? null;

  const cast = (direction: "up" | "down") => {
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
      voteType: "station_image",
      stationName,
      previous,
      next,
    });
    void syncStationImageVoteToServer(stationName, previous, next).then((stored) => {
      if (stored) {
        queryClient.invalidateQueries({ queryKey: ["global-ratings"] });
      }
    });
  };

  return { vote, cast };
}
