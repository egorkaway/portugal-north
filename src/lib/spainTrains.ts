import type { SpainTrainsManifest } from "@/lib/spainTrainPositions";

export type { SpainTrainPosition, SpainTrainsManifest } from "@/lib/spainTrainPositions";

const EMPTY_SPAIN_TRAINS: SpainTrainsManifest = {
  fetchedAt: "",
  trainCount: 0,
  trains: [],
};

const FETCH_TIMEOUT_MS = 6_000;

/** Live Renfe overlay only — failures must not throw or the map stays usable. */
export async function fetchSpainTrains(): Promise<SpainTrainsManifest> {
  try {
    const res = await fetch("/api/spain-trains", {
      cache: "no-store",
      signal:
        typeof AbortSignal !== "undefined" && "timeout" in AbortSignal
          ? AbortSignal.timeout(FETCH_TIMEOUT_MS)
          : undefined,
    });
    if (!res.ok) return EMPTY_SPAIN_TRAINS;
    const data = (await res.json()) as Partial<SpainTrainsManifest>;
    if (!Array.isArray(data.trains)) return EMPTY_SPAIN_TRAINS;
    return {
      fetchedAt: typeof data.fetchedAt === "string" ? data.fetchedAt : "",
      trainCount: typeof data.trainCount === "number" ? data.trainCount : data.trains.length,
      trains: data.trains,
    };
  } catch {
    return EMPTY_SPAIN_TRAINS;
  }
}
