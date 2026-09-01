export type TrainSpotlightEntry = {
  trainNumber: string;
  serviceType: string;
  avgDelayMinutes: number;
  observations: number;
  stationsSampled: number;
  majorStations: string[];
};

export type TrainSpotlightReliableEntry = TrainSpotlightEntry & {
  selectionMode: "stable" | "rotating";
  poolSize: number;
};

export type TrainReliabilitySpotlightManifest = {
  generatedAt: string;
  runCount: number;
  mostDelayed: TrainSpotlightEntry[];
  mostReliable: TrainSpotlightReliableEntry[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSpotlightEntry(value: unknown): value is TrainSpotlightEntry {
  if (!isRecord(value)) return false;
  return typeof value.trainNumber === "string" && typeof value.serviceType === "string";
}

function asEntryList(value: unknown): TrainSpotlightEntry[] {
  if (Array.isArray(value)) return value.filter(isSpotlightEntry);
  if (isSpotlightEntry(value)) return [value];
  return [];
}

function asReliableList(value: unknown): TrainSpotlightReliableEntry[] {
  return asEntryList(value).map((entry) => {
    const record = entry as TrainSpotlightEntry & Partial<TrainSpotlightReliableEntry>;
    return {
      ...entry,
      selectionMode: record.selectionMode === "rotating" ? "rotating" : "stable",
      poolSize: typeof record.poolSize === "number" ? record.poolSize : 1,
    };
  });
}

/** Accepts current arrays and the older single-train JSON shape. */
export function normalizeTrainReliabilitySpotlight(value: unknown): TrainReliabilitySpotlightManifest {
  const record = isRecord(value) ? value : {};
  return {
    generatedAt: typeof record.generatedAt === "string" ? record.generatedAt : "",
    runCount: typeof record.runCount === "number" ? record.runCount : 0,
    mostDelayed: asEntryList(record.mostDelayed),
    mostReliable: asReliableList(record.mostReliable),
  };
}

export async function fetchTrainReliabilitySpotlight(): Promise<TrainReliabilitySpotlightManifest> {
  const res = await fetch("/data/train-reliability-spotlight.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`train-reliability-spotlight.json returned ${res.status}`);
  }

  return normalizeTrainReliabilitySpotlight(await res.json());
}

export function formatTrainSpotlightDelay(minutes: number): string {
  const rounded = Math.round(minutes * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
