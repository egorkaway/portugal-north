import { useQuery } from "@tanstack/react-query";
import { getCpStationCode } from "@/data/cpStationCodes";
import { fetchStationDepartures } from "@/lib/cpTravelApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function useStationDepartures(stationName: string) {
  const stationCode = getCpStationCode(stationName);
  const online = useOnlineStatus();

  return useQuery({
    queryKey: ["station-departures", stationCode, stationName],
    queryFn: () => fetchStationDepartures(stationCode!, 3),
    enabled: Boolean(stationCode) && online,
    staleTime: 60_000,
    refetchInterval: 90_000,
    retry: 1,
  });
}
