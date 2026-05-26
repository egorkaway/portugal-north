import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { flushVoteSyncQueue } from "@/lib/voteSyncQueue";
import { postVotePayload } from "@/lib/votesApi";

/** Flushes queued vote syncs when the browser comes back online. */
export function VoteSyncBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const sync = () => {
      void flushVoteSyncQueue(postVotePayload).then(() => {
        queryClient.invalidateQueries({ queryKey: ["global-ratings"] });
      });
    };

    sync();
    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, [queryClient]);

  return null;
}
