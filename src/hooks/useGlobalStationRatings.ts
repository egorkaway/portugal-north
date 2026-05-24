import { useQuery } from "@tanstack/react-query";
import { fetchGlobalRatings } from "@/lib/votesApi";

export function useGlobalStationRatings() {
  return useQuery({
    queryKey: ["global-station-ratings"],
    queryFn: fetchGlobalRatings,
    staleTime: 60_000,
    retry: 1,
  });
}
