import { useQuery } from "@tanstack/react-query";
import { fetchTrainReliabilitySpotlight } from "@/lib/trainReliabilitySpotlight";

export function useTrainReliabilitySpotlight() {
  return useQuery({
    queryKey: ["train-reliability-spotlight"],
    queryFn: fetchTrainReliabilitySpotlight,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
