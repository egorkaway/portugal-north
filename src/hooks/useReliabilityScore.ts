import { useQuery } from "@tanstack/react-query";
import { getCpStationCode } from "@/data/cpStationCodes";
import { fetchReliabilityScores, fetchSpainReliabilityScores } from "@/lib/reliabilityScore";

export function useReliabilityScores() {
  return useQuery({
    queryKey: ["reliability-scores"],
    queryFn: fetchReliabilityScores,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useSpainReliabilityScores(enabled = true) {
  return useQuery({
    queryKey: ["spain-reliability-scores"],
    queryFn: fetchSpainReliabilityScores,
    staleTime: 5 * 60_000,
    retry: 1,
    enabled,
  });
}

export function useReliabilityScore(stationName: string) {
  const cpCode = getCpStationCode(stationName);
  const portugalQuery = useReliabilityScores();

  return {
    ...portugalQuery,
    score: portugalQuery.data?.scores[stationName],
    hasScoreSource: Boolean(cpCode),
  };
}
