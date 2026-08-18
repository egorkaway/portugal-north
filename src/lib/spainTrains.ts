import type { SpainTrainsManifest } from "@/lib/spainTrainPositions";

export type { SpainTrainPosition, SpainTrainsManifest } from "@/lib/spainTrainPositions";

export async function fetchSpainTrains(): Promise<SpainTrainsManifest> {
  const res = await fetch("/api/spain-trains", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`spain-trains returned ${res.status}`);
  }
  const data = (await res.json()) as Partial<SpainTrainsManifest>;
  if (!Array.isArray(data.trains)) {
    throw new Error("spain-trains is missing trains");
  }
  return {
    fetchedAt: typeof data.fetchedAt === "string" ? data.fetchedAt : "",
    trainCount: typeof data.trainCount === "number" ? data.trainCount : data.trains.length,
    trains: data.trains,
  };
}
