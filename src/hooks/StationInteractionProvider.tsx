import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  castStationVote,
  useAllVotes,
  type Vote,
} from "@/hooks/useStationVote";
import {
  toggleStationVisitedAt,
  useAllVisited,
} from "@/hooks/useStationVisited";
import type { VisitedMap } from "@/lib/stationVisitedStorage";
import type { VotesMap } from "@/hooks/useStationVote";

type StationInteractionContextValue = {
  votes: VotesMap;
  visitedMap: VisitedMap;
  castVote: (stationName: string, direction: "up" | "down") => Vote;
  toggleVisited: (stationName: string) => boolean;
};

const StationInteractionContext = createContext<StationInteractionContextValue | null>(
  null,
);

/** Single vote/visited subscription for large station grids (home page). */
export function StationInteractionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const votes = useAllVotes();
  const visitedMap = useAllVisited();

  const castVote = useCallback(
    (stationName: string, direction: "up" | "down") =>
      castStationVote(stationName, direction, () => {
        queryClient.invalidateQueries({ queryKey: ["global-ratings"] });
      }),
    [queryClient],
  );

  const toggleVisited = useCallback(
    (stationName: string) => toggleStationVisitedAt(stationName),
    [],
  );

  const value = useMemo(
    () => ({ votes, visitedMap, castVote, toggleVisited }),
    [votes, visitedMap, castVote, toggleVisited],
  );

  return (
    <StationInteractionContext.Provider value={value}>
      {children}
    </StationInteractionContext.Provider>
  );
}

export function useStationInteraction(stationName: string) {
  const context = useContext(StationInteractionContext);
  if (!context) return null;

  return {
    vote: context.votes[stationName] ?? null,
    visited: Boolean(context.visitedMap[stationName]),
    cast: (direction: "up" | "down") => context.castVote(stationName, direction),
    toggleVisited: () => context.toggleVisited(stationName),
  };
}
