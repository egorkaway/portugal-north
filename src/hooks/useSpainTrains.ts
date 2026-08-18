import { useQuery } from "@tanstack/react-query";
import { fetchSpainTrains } from "@/lib/spainTrains";

export function useSpainTrains() {
  return useQuery({
    queryKey: ["spain-trains"],
    queryFn: fetchSpainTrains,
    refetchInterval: 20_000,
    staleTime: 15_000,
    retry: false,
  });
}
