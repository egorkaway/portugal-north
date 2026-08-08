import { useQuery } from "@tanstack/react-query";
import {
  fetchStationMonthlyTemperatures,
  shouldDisplayStationMonthlyTemperature,
  type StationMonthlyTemperatureEntry,
} from "@/lib/stationMonthlyTemperatures";

export function useStationMonthlyTemperatures() {
  return useQuery({
    queryKey: ["station-monthly-temperatures"],
    queryFn: fetchStationMonthlyTemperatures,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useStationMonthlyTemperature(stationName: string): {
  entry: StationMonthlyTemperatureEntry | undefined;
  isLoading: boolean;
  isError: boolean;
  visible: boolean;
} {
  const query = useStationMonthlyTemperatures();
  const visible = shouldDisplayStationMonthlyTemperature(query.data, stationName);
  const entry = visible ? query.data?.stations[stationName] : undefined;

  return {
    entry,
    isLoading: query.isLoading,
    isError: query.isError,
    visible: Boolean(visible && entry),
  };
}
