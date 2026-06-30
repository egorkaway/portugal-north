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
): Promise<TrainJourney> {
  const params = new URLSearchParams({
    train: trainNumber,
    date: timetableDate,
  });
  const res = await fetch(`/api/train-journey?${params.toString()}`, { cache: "no-store" });
  const data = (await res.json()) as TrainJourneyResponse;
  if (!res.ok || !data.journey) {
    throw new Error(data.error ?? `train-journey returned ${res.status}`);
  }
  return data.journey;
}

export function useTrainJourney(trainNumber: string | null, timetableDate: string | null) {
  return useQuery({
    queryKey: ["train-journey", trainNumber, timetableDate],
    queryFn: () => fetchTrainJourney(trainNumber!, timetableDate!),
    enabled: Boolean(trainNumber && timetableDate),
    staleTime: 60_000,
    refetchInterval: 90_000,
  });
}
