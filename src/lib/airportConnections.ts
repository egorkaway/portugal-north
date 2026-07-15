import type { AirportConnectionsEntry } from "../../server/lib/airportConnections.js";

let cachedManifest: AirportConnectionsManifest | null = null;

export async function fetchAirportConnectionsManifest(): Promise<AirportConnectionsManifest | null> {
  if (cachedManifest) return cachedManifest;

  try {
    const res = await fetch("/data/airport-connections.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<AirportConnectionsManifest>;
    if (!data.airports || typeof data.airports !== "object") return null;

    cachedManifest = {
      generatedAt: typeof data.generatedAt === "string" ? data.generatedAt : "",
      runCount: typeof data.runCount === "number" ? data.runCount : 0,
      airportCount: typeof data.airportCount === "number" ? data.airportCount : 0,
      airports: data.airports,
    };
    return cachedManifest;
  } catch {
    return null;
  }
}

export function getAirportConnectionsMapImagePath(slug: string): string {
  return `/maps/airports/${slug}-connections.png`;
}
