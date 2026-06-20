import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  flushVoteSyncQueue,
  scheduleVoteSyncFlush,
  subscribeVoteSyncEnqueue,
} from "@/lib/voteSyncQueue";
import { postVotePayload } from "@/lib/votesApi";

/** Flushes queued vote syncs on mount, when new items enqueue, and when back online. */
export function VoteSyncBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const flush = () =>
      flushVoteSyncQueue((payload) =>
        postVotePayload(payload, { requeueOnFailure: false }),
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: ["global-ratings"] });
      });

    const schedule = () => scheduleVoteSyncFlush(flush);

    schedule();
    const unsubEnqueue = subscribeVoteSyncEnqueue(schedule);
    window.addEventListener("online", schedule);
    return () => {
      unsubEnqueue();
      window.removeEventListener("online", schedule);
    };
  }, [queryClient]);

  return null;
}
