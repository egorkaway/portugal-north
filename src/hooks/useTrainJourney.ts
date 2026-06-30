import { useQuery } from "@tanstack/react-query";
import type { TrainJourney } from "@/lib/trainJourney";

type TrainJourneyResponse = {
  journey: TrainJourney | null;
  configured: boolean;
  error?: string;
};

export async function fetchTrainJourney(
  trainNumber: string,
  timetableDate: string,
  options?: {
    originStationCode?: string;
    departureTime?: string;
    destinationName?: string;
  },
): Promise<TrainJourney> {
  const params = new URLSearchParams({
    train: trainNumber,
    date: timetableDate,
  });
  if (options?.originStationCode) {
    params.set("origin", options.originStationCode);
  }
  if (options?.departureTime) {
    params.set("departure", options.departureTime);
  }
  if (options?.destinationName) {
    params.set("destination", options.destinationName);
  }
  const res = await fetch(`/api/train-journey?${params.toString()}`, { cache: "no-store" });
  const data = (await res.json()) as TrainJourneyResponse;
  if (!res.ok || !data.journey) {
    throw new Error(data.error ?? `train-journey returned ${res.status}`);
  }
  return data.journey;
}

export function useTrainJourney(
  trainNumber: string | null,
  timetableDate: string | null,
  options?: {
    originStationCode?: string;
    departureTime?: string;
    destinationName?: string;
  },
) {
  return useQuery({
    queryKey: [
      "train-journey",
      trainNumber,
      timetableDate,
      options?.originStationCode,
      options?.departureTime,
      options?.destinationName,
    ],
    queryFn: () =>
      fetchTrainJourney(trainNumber!, timetableDate!, {
        originStationCode: options?.originStationCode,
        departureTime: options?.departureTime,
        destinationName: options?.destinationName,
      }),
    enabled: Boolean(trainNumber && timetableDate),
    staleTime: 60_000,
    refetchInterval: 90_000,
  });
}
