import { useQuery } from "@tanstack/react-query";
import { APP_UPDATE_CHECK_INTERVAL_MS } from "@/lib/appUpdate";
import { fetchGlobalRatings } from "@/lib/votesApi";

export function useGlobalRatings() {
  return useQuery({
    queryKey: ["global-ratings"],
    queryFn: fetchGlobalRatings,
    staleTime: APP_UPDATE_CHECK_INTERVAL_MS,
    refetchInterval: APP_UPDATE_CHECK_INTERVAL_MS,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

/** Station-only slice of global ratings (backwards compatible). */
export function useGlobalStationRatings() {
  const query = useGlobalRatings();
  return {
    ...query,
    data: query.data
      ? { ratings: query.data.ratings, configured: query.data.configured }
      : undefined,
  };
}

/** Aggregated photo feedback totals per station (up = good photo, down = not representative). */
export function useGlobalImageRatings() {
  const query = useGlobalRatings();
  return {
    ...query,
    data: query.data
      ? { imageRatings: query.data.imageRatings, configured: query.data.configured }
      : undefined,
  };
}
