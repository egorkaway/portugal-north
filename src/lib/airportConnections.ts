import type {
  AirportConnectionsEntry,
  AirportConnectionsManifest,
} from "../../server/lib/airportConnections.js";

let cachedManifest: AirportConnectionsManifest | null = null;

function findAirportEntry(
  airports: Record<string, AirportConnectionsEntry> | undefined,
  {
    iata,
    slug,
    stationName,
  }: {
    iata?: string;
    slug?: string;
    stationName?: string;
  },
): AirportConnectionsEntry | null {
  if (!airports) return null;
  const code = iata?.trim().toUpperCase();
  if (code && airports[code]?.connections?.length) return airports[code];
  return (
    Object.values(airports).find(
      (airport) =>
        Boolean(airport.connections?.length) &&
        ((slug && airport.slug === slug) ||
          (stationName && airport.stationName === stationName)),
    ) ?? null
  );
}

/** Prefer current-period samples; otherwise previous-period display fallback. */
export function resolveAirportConnectionsEntry(
  manifest: AirportConnectionsManifest | null | undefined,
  opts: {
    iata?: string;
    slug?: string;
    stationName?: string;
  },
): AirportConnectionsEntry | null {
  if (!manifest) return null;
  return (
    findAirportEntry(manifest.airports, opts) ??
    findAirportEntry(manifest.fallbackAirports, opts)
  );
}

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
      periodId: typeof data.periodId === "string" ? data.periodId : undefined,
      airports: data.airports,
      fallbackPeriodId:
        typeof data.fallbackPeriodId === "string" ? data.fallbackPeriodId : null,
      fallbackAirports:
        data.fallbackAirports && typeof data.fallbackAirports === "object"
          ? data.fallbackAirports
          : {},
    };
    return cachedManifest;
  } catch {
    return null;
  }
}

export function getAirportConnectionsMapImagePath(
  entryOrSlug: AirportConnectionsEntry | string,
): string {
  if (typeof entryOrSlug === "string") {
    return `/maps/airports/${entryOrSlug}-connections.png`;
  }
  if (entryOrSlug.mapImage?.startsWith("/")) return entryOrSlug.mapImage;
  return `/maps/airports/${entryOrSlug.slug}-connections.png`;
}
