import { useQuery } from "@tanstack/react-query";
import { getCpStationCode } from "@/data/cpStationCodes";
import { fetchReliabilityScores } from "@/lib/reliabilityScore";

export function useReliabilityScores() {
  return useQuery({
    queryKey: ["reliability-scores"],
    queryFn: fetchReliabilityScores,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useReliabilityScore(stationName: string) {
  const cpCode = getCpStationCode(stationName);
  const query = useReliabilityScores();
  const score = query.data?.scores[stationName];

  return {
    ...query,
    score,
    hasCpCode: Boolean(cpCode),
  };
}
