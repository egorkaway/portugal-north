import { useQuery } from "@tanstack/react-query";
import { fetchAirportConnectionsManifest } from "@/lib/airportConnections";

export function useAirportConnections() {
  return useQuery({
    queryKey: ["airport-connections"],
    queryFn: fetchAirportConnectionsManifest,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
