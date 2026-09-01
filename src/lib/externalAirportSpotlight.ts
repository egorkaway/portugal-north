import {
  destinationAirportDisplayName,
  isNonMainlandIberiaAirport,
  type AirportCoordinate,
} from "./europeAirportDestinations";

export type SpotlightConnection = {
  iata?: string;
  flightCount?: number;
};

export type SpotlightHubEntry = {
  iata?: string;
  connections?: SpotlightConnection[];
};

export type SpotlightManifest = {
  airports?: Record<string, SpotlightHubEntry>;
  fallbackAirports?: Record<string, SpotlightHubEntry>;
};

export type RankedExternalAirport = {
  iata: string;
  iberianFlightCount: number;
  hubCount: number;
};

function isoCountry(country: string): string {
  const value = country.trim().toUpperCase();
  if (value === "SPAIN") return "ES";
  if (value === "PORTUGAL") return "PT";
  return value;
}

/** Airports that are not mainland Iberia hubs (islands and everywhere else). */
export function isOutsideIberianPeninsula(
  iata: string,
  coords: AirportCoordinate | undefined,
  hubIatas: ReadonlySet<string>,
): boolean {
  const code = iata.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(code)) return false;
  if (hubIatas.has(code)) return false;
  if (!coords) return false;

  const iso = isoCountry(coords.country ?? "");
  if (iso === "PT" || iso === "ES") {
    return isNonMainlandIberiaAirport(iso, coords.lat, coords.lng);
  }
  return Number.isFinite(coords.lat) && Number.isFinite(coords.lng);
}

function hubNetwork(manifest: SpotlightManifest): SpotlightHubEntry[] {
  const byIata = new Map<string, SpotlightHubEntry>();
  for (const entry of Object.values(manifest.fallbackAirports ?? {})) {
    const iata = entry.iata?.trim().toUpperCase();
    if (iata) byIata.set(iata, entry);
  }
  for (const entry of Object.values(manifest.airports ?? {})) {
    const iata = entry.iata?.trim().toUpperCase();
    if (iata) byIata.set(iata, entry);
  }
  return [...byIata.values()];
}

/**
 * Rank non-peninsula destinations by sampled flights FROM Iberian hubs.
 */
export function rankExternalAirportsFromManifest(
  manifest: SpotlightManifest,
  hubIatas: ReadonlySet<string>,
  coordinates: Record<string, AirportCoordinate>,
): RankedExternalAirport[] {
  const flights = new Map<string, number>();
  const hubs = new Map<string, Set<string>>();

  for (const hub of hubNetwork(manifest)) {
    const origin = hub.iata?.trim().toUpperCase();
    if (!origin || !hubIatas.has(origin)) continue;
    for (const connection of hub.connections ?? []) {
      const dest = connection.iata?.trim().toUpperCase();
      if (!dest) continue;
      const coords = coordinates[dest];
      if (!isOutsideIberianPeninsula(dest, coords, hubIatas)) continue;
      const count = Number(connection.flightCount) || 0;
      flights.set(dest, (flights.get(dest) ?? 0) + count);
      const serving = hubs.get(dest) ?? new Set();
      serving.add(origin);
      hubs.set(dest, serving);
    }
  }

  return [...flights.entries()]
    .map(([iata, iberianFlightCount]) => ({
      iata,
      iberianFlightCount,
      hubCount: hubs.get(iata)?.size ?? 0,
    }))
    .filter((row) => row.iberianFlightCount > 0)
    .sort(
      (a, b) =>
        b.iberianFlightCount - a.iberianFlightCount ||
        b.hubCount - a.hubCount ||
        a.iata.localeCompare(b.iata),
    );
}

/**
 * One new external airport per collect run: highest Iberian traffic not yet
 * mapped, or the current #1 again once every candidate has a map.
 */
export function pickExternalAirportForRun(
  ranked: RankedExternalAirport[],
  alreadySampledIatas: ReadonlySet<string>,
): RankedExternalAirport | null {
  if (ranked.length === 0) return null;
  const next = ranked.find((row) => !alreadySampledIatas.has(row.iata));
  return next ?? ranked[0] ?? null;
}

export function externalAirportDisplayName(
  iata: string,
  coords: AirportCoordinate | undefined,
): string {
  return destinationAirportDisplayName(iata, coords?.name || iata);
}
