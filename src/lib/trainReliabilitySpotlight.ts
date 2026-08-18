export type TrainSpotlightEntry = {
  trainNumber: string;
  serviceType: string;
  avgDelayMinutes: number;
  observations: number;
  stationsSampled: number;
  majorStations: string[];
};

export type TrainReliabilitySpotlightManifest = {
  generatedAt: string;
  runCount: number;
  mostDelayed: TrainSpotlightEntry | null;
  mostReliable: (TrainSpotlightEntry & {
    selectionMode: "stable" | "rotating";
    poolSize: number;
  }) | null;
};

export async function fetchTrainReliabilitySpotlight(): Promise<TrainReliabilitySpotlightManifest> {
  const res = await fetch("/data/train-reliability-spotlight.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`train-reliability-spotlight.json returned ${res.status}`);
  }

  return (await res.json()) as TrainReliabilitySpotlightManifest;
}

export function formatTrainSpotlightDelay(minutes: number): string {
  const rounded = Math.round(minutes * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
