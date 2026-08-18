import { useQuery } from "@tanstack/react-query";
import { getCpStationCode } from "@/data/cpStationCodes";
import { primarySpainStopId } from "@/data/spainAdifStopIds";
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
  const spainStopId = primarySpainStopId(stationName);
  const portugalQuery = useReliabilityScores();
  const spainQuery = useSpainReliabilityScores(Boolean(spainStopId));

  if (spainStopId) {
    return {
      ...spainQuery,
      score: spainQuery.data?.scores[stationName],
      hasScoreSource: true,
    };
  }

  return {
    ...portugalQuery,
    score: portugalQuery.data?.scores[stationName],
    hasScoreSource: Boolean(cpCode),
  };
}
