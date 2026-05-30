import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCpStationCode } from "@/data/cpStationCodes";
import { INITIAL_DEPARTURES_LIMIT, clampDeparturesLimit } from "@/lib/departureLimits";
import { fetchStationDepartures } from "@/lib/cpTravelApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function useStationDepartures(stationName: string, limit = INITIAL_DEPARTURES_LIMIT) {
  const stationCode = getCpStationCode(stationName);
  const online = useOnlineStatus();
  const cappedLimit = clampDeparturesLimit(limit);

  return useQuery({
    queryKey: ["station-departures", stationCode, stationName, cappedLimit],
    queryFn: () => fetchStationDepartures(stationCode!, cappedLimit),
    enabled: Boolean(stationCode) && online,
    staleTime: 60_000,
    refetchInterval: 90_000,
    retry: 1,
    placeholderData: keepPreviousData,
  });
}
