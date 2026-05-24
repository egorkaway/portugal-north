import { useQuery } from "@tanstack/react-query";
import { getCpStationCode } from "@/data/cpStationCodes";
import { fetchStationDepartures } from "@/lib/cpTravelApi";

export function useStationDepartures(stationName: string) {
  const stationCode = getCpStationCode(stationName);

  return useQuery({
    queryKey: ["station-departures", stationCode, stationName],
    queryFn: () => fetchStationDepartures(stationCode!, 3),
    enabled: Boolean(stationCode),
    staleTime: 60_000,
    refetchInterval: 90_000,
    retry: 1,
  });
}
