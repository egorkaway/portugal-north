import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Vote } from "@/hooks/useStationVote";
import { trackVoteCast } from "@/lib/posthogEvents";
import {
  clearStationImageVote,
  getStaleStationImageVote,
  getStationImageVoteForUrl,
  readStationImageVotes,
  setStationImageVoteForUrl,
} from "@/lib/stationImageVoteStorage";
import { syncStationImageVoteToServer } from "@/lib/votesApi";

const listeners = new Set<() => void>();
let cache = readStationImageVotes();

function getSnapshot() {
  return cache;
}

function emit() {
  cache = readStationImageVotes();
  listeners.forEach((listener) => listener());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStationImageVote(stationName: string, imageUrl: string) {
  const queryClient = useQueryClient();
  const votes = useSyncExternalStore(subscribe, getSnapshot, () => ({}));
  const vote: Vote = getStationImageVoteForUrl(votes, stationName, imageUrl);

  useEffect(() => {
    const staleVote = getStaleStationImageVote(readStationImageVotes(), stationName, imageUrl);
    if (!staleVote) return;

    clearStationImageVote(stationName);
    emit();
    void syncStationImageVoteToServer(stationName, staleVote, null).then((stored) => {
      if (stored) {
        queryClient.invalidateQueries({ queryKey: ["global-ratings"] });
      }
    });
  }, [imageUrl, queryClient, stationName]);

  const cast = (direction: "up" | "down") => {
    const previous = getStationImageVoteForUrl(readStationImageVotes(), stationName, imageUrl);
    let next: Vote;

    if (previous === direction) {
      setStationImageVoteForUrl(stationName, imageUrl, null);
      next = null;
    } else {
      setStationImageVoteForUrl(stationName, imageUrl, direction);
      next = direction;
    }

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
