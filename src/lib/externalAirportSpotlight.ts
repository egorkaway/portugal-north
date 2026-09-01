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

/** Map built from Iberian hubs that fly here, used when outbound APIs are exhausted. */
export const IBERIAN_INBOUND_PROVIDER = "iberian-inbound";

export type ExternalMapCoverage = {
  /** Already mapped from a real outbound sample. */
  completeIatas: ReadonlySet<string>;
  /** Mapped from Iberian inbound only — redraw with full outbound when APIs return. */
  inboundOnlyIatas: ReadonlySet<string>;
};

export function coverageFromExternalMapRows(
  rows: Array<{ iata?: string; provider?: string }>,
): ExternalMapCoverage {
  const completeIatas = new Set<string>();
  const inboundOnlyIatas = new Set<string>();
  for (const row of rows) {
    const iata = String(row.iata ?? "").trim().toUpperCase();
    if (!iata) continue;
    if (row.provider === IBERIAN_INBOUND_PROVIDER) inboundOnlyIatas.add(iata);
    else completeIatas.add(iata);
  }
  return { completeIatas, inboundOnlyIatas };
}

function asCoverage(
  sampledOrCoverage: ReadonlySet<string> | ExternalMapCoverage,
): ExternalMapCoverage {
  if (sampledOrCoverage instanceof Set) {
    return { completeIatas: sampledOrCoverage, inboundOnlyIatas: new Set() };
  }
  return sampledOrCoverage;
}

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
 * One external airport per collect run. Prefer an Iberian-inbound map that
 * still needs a full outbound redraw, then an unmapped airport, then refresh
 * the current #1.
 */
export function pickExternalAirportForRun(
  ranked: RankedExternalAirport[],
  sampledOrCoverage: ReadonlySet<string> | ExternalMapCoverage,
): RankedExternalAirport | null {
  if (ranked.length === 0) return null;
  const { completeIatas, inboundOnlyIatas } = asCoverage(sampledOrCoverage);
  const needsRedraw = ranked.find((row) => inboundOnlyIatas.has(row.iata));
  if (needsRedraw) return needsRedraw;
  const unmapped = ranked.find(
    (row) => !completeIatas.has(row.iata) && !inboundOnlyIatas.has(row.iata),
  );
  return unmapped ?? ranked[0] ?? null;
}

export function externalAirportDisplayName(
  iata: string,
  coords: AirportCoordinate | undefined,
): string {
  return destinationAirportDisplayName(iata, coords?.name || iata);
}
