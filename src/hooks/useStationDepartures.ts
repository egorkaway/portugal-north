import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCpStationCode } from "@/data/cpStationCodes";
import { INITIAL_DEPARTURES_LIMIT, clampDeparturesLimit } from "@/lib/departureLimits";
import { fetchStationBoard } from "@/lib/cpTravelApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function useStationBoard(stationName: string, limit = INITIAL_DEPARTURES_LIMIT) {
  const stationCode = getCpStationCode(stationName);
  const online = useOnlineStatus();
  const cappedLimit = clampDeparturesLimit(limit);

  return useQuery({
    queryKey: ["station-board", stationCode, stationName, cappedLimit],
    queryFn: () => fetchStationBoard(stationCode!, cappedLimit),
    enabled: Boolean(stationCode) && online,
    staleTime: 60_000,
    refetchInterval: 90_000,
    retry: 1,
    placeholderData: keepPreviousData,
  });
}

export function useStationDepartures(stationName: string, limit = INITIAL_DEPARTURES_LIMIT) {
  const board = useStationBoard(stationName, limit);
  return {
    ...board,
    data: board.data?.departures,
  };
}

export function useStationArrivals(stationName: string, limit = INITIAL_DEPARTURES_LIMIT) {
  const board = useStationBoard(stationName, limit);
  return {
    ...board,
    data: board.data?.arrivals,
  };
}
