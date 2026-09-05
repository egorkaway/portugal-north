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

/** Map built from Iberian hubs that fly here. Kept alongside the all-flights map. */
export const IBERIAN_INBOUND_PROVIDER = "iberian-inbound";

export type ExternalMapKind = "iberian" | "all";

export type ExternalAirportMapRow = {
  iata?: string;
  slug?: string;
  provider?: string;
  mapImage?: string;
  iberianMapImage?: string;
  destinationCount?: number;
  iberianDestinationCount?: number;
  allFlightsIberianDestinationCount?: number;
};

export type ExternalMapCoverage = {
  /** Has an all-flights (outbound API) map. */
  completeIatas: ReadonlySet<string>;
  /** Has an Iberian-flights map. An airport can be in both sets. */
  inboundIatas: ReadonlySet<string>;
  /** All-flights map has fewer destinations than the Iberian map — redraw. */
  staleAllFlightsIatas: ReadonlySet<string>;
};

export function externalMapFilename(slug: string, kind: ExternalMapKind): string {
  return kind === "iberian" ? `${slug}-iberian-connections.png` : `${slug}-connections.png`;
}

export function externalMapPublicPath(slug: string, kind: ExternalMapKind): string {
  return `/maps/airports/external/${externalMapFilename(slug, kind)}`;
}

export function hasIberianMap(row: ExternalAirportMapRow | null | undefined): boolean {
  if (row?.iberianMapImage) return true;
  return row?.provider === IBERIAN_INBOUND_PROVIDER && Boolean(row?.mapImage);
}

export function hasAllFlightsMap(row: ExternalAirportMapRow | null | undefined): boolean {
  const provider = String(row?.provider ?? "").trim();
  if (!provider || provider === IBERIAN_INBOUND_PROVIDER) return false;
  return Boolean(row?.mapImage);
}

export function hasBothExternalMaps(row: ExternalAirportMapRow | null | undefined): boolean {
  const normalized = row ? normalizeExternalAirportRow(row) : row;
  return hasIberianMap(normalized) && hasAllFlightsMap(normalized);
}

/** All-flights sample missed Iberian destinations the inbound map already shows. */
export function allFlightsMapNeedsRegeneration(
  row: ExternalAirportMapRow | null | undefined,
): boolean {
  if (!row) return false;
  const normalized = normalizeExternalAirportRow(row);
  if (!hasIberianMap(normalized) || !hasAllFlightsMap(normalized)) return false;
  const allCount = Number(normalized.destinationCount);
  const iberianCount = Number(normalized.iberianDestinationCount);
  if (!Number.isFinite(allCount) || !Number.isFinite(iberianCount)) return false;
  if (allCount < iberianCount) return true;
  const iberianInAll = Number(normalized.allFlightsIberianDestinationCount);
  return (
    Number.isFinite(iberianInAll) && allCount > iberianCount && iberianInAll === 0
  );
}

export function isIberianAirportCountry(country: string | undefined): boolean {
  const iso = isoCountry(String(country ?? ""));
  return iso === "PT" || iso === "ES";
}

export function countIberianConnectionDestinations(
  connections: Array<{ country?: string }> | null | undefined,
): number {
  return (connections ?? []).filter((connection) => isIberianAirportCountry(connection.country))
    .length;
}

/** Lift a legacy inbound-only row (one PNG that used to be replaced) into dual-map fields. */
export function normalizeExternalAirportRow<T extends ExternalAirportMapRow>(row: T): T {
  if (row.iberianMapImage) return row;
  if (row.provider !== IBERIAN_INBOUND_PROVIDER || !row.mapImage) return row;
  const iberianMapImage = row.slug
    ? externalMapPublicPath(row.slug, "iberian")
    : String(row.mapImage).replace(/-connections\.png$/i, "-iberian-connections.png");
  const next = {
    ...row,
    iberianMapImage,
    iberianDestinationCount: (row as { destinationCount?: number }).destinationCount,
    iberianSampledFlights: (row as { sampledFlights?: number }).sampledFlights,
    iberianSampledAt: (row as { sampledAt?: string }).sampledAt,
    iberianPeriodId: (row as { periodId?: string }).periodId,
    iberianBasemapId: (row as { basemapId?: string }).basemapId,
  };
  delete (next as { mapImage?: string }).mapImage;
  delete (next as { destinationCount?: number }).destinationCount;
  delete (next as { sampledFlights?: number }).sampledFlights;
  delete (next as { sampledAt?: string }).sampledAt;
  delete (next as { periodId?: string }).periodId;
  delete (next as { provider?: string }).provider;
  delete (next as { basemapId?: string }).basemapId;
  return next;
}

export function coverageFromExternalMapRows(
  rows: Array<ExternalAirportMapRow>,
): ExternalMapCoverage {
  const completeIatas = new Set<string>();
  const inboundIatas = new Set<string>();
  const staleAllFlightsIatas = new Set<string>();
  for (const row of rows) {
    const iata = String(row.iata ?? "").trim().toUpperCase();
    if (!iata) continue;
    const normalized = normalizeExternalAirportRow(row);
    if (hasIberianMap(normalized)) inboundIatas.add(iata);
    if (hasAllFlightsMap(normalized)) completeIatas.add(iata);
    if (allFlightsMapNeedsRegeneration(normalized)) staleAllFlightsIatas.add(iata);
  }
  return { completeIatas, inboundIatas, staleAllFlightsIatas };
}

function formatIataList(codes: string[]): string {
  return codes.length ? `${codes.join(" ")} (${codes.length})` : `(0)`;
}

/** Compact collect-log: disjoint IATA lists (Iberian-only, all-flights-only, both). */
export function formatExternalAirportMapsLog(
  store: { airports?: Array<ExternalAirportMapRow> } | null | undefined,
): string {
  const iberianOnly: string[] = [];
  const allFlightsOnly: string[] = [];
  const both: string[] = [];
  const staleAllFlights: string[] = [];
  for (const row of store?.airports ?? []) {
    const iata = String(row.iata ?? "").trim().toUpperCase();
    if (!iata) continue;
    const normalized = normalizeExternalAirportRow(row);
    const iberian = hasIberianMap(normalized);
    const allFlights = hasAllFlightsMap(normalized);
    if (iberian && allFlights) both.push(iata);
    else if (iberian) iberianOnly.push(iata);
    else if (allFlights) allFlightsOnly.push(iata);
    if (allFlightsMapNeedsRegeneration(normalized)) staleAllFlights.push(iata);
  }

  if (iberianOnly.length === 0 && allFlightsOnly.length === 0 && both.length === 0) {
    return "External destination maps (outside Iberian peninsula): none yet";
  }

  const lines = [
    "External destination maps (outside Iberian peninsula):",
    `  Iberian flights only: ${formatIataList(iberianOnly)}`,
    `  All flights only: ${formatIataList(allFlightsOnly)}`,
    `  Both maps: ${formatIataList(both)}`,
  ];
  if (staleAllFlights.length) {
    lines.push(
      `  All-flights needs regen (missed Iberian destinations): ${formatIataList(staleAllFlights)}`,
    );
  }
  return lines.join("\n");
}

function asCoverage(
  sampledOrCoverage: ReadonlySet<string> | ExternalMapCoverage,
): ExternalMapCoverage {
  if (sampledOrCoverage instanceof Set) {
    return {
      completeIatas: sampledOrCoverage,
      inboundIatas: new Set(),
      staleAllFlightsIatas: new Set(),
    };
  }
  return {
    completeIatas: sampledOrCoverage.completeIatas,
    inboundIatas: sampledOrCoverage.inboundIatas,
    staleAllFlightsIatas: sampledOrCoverage.staleAllFlightsIatas ?? new Set(),
  };
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

/** `--external-count=all` is Infinity; otherwise a positive integer (default 1). */
export function externalSpotlightLimit(count: number | undefined | null): number {
  if (count === Number.POSITIVE_INFINITY) return Number.POSITIVE_INFINITY;
  if (typeof count === "number" && Number.isFinite(count) && count > 0) {
    return Math.floor(count);
  }
  return 1;
}

export type PickExternalAirportOptions = {
  /**
   * When true (default), pick an airport that still needs an all-flights map.
   * When false, pick the next airport that still needs an Iberian-flights map.
   */
  flightApisAvailable?: boolean;
};

/**
 * One external map per collect step. Iberian and all-flights maps are kept separately.
 * APIs up: airport that has Iberian but not all-flights, else missing all-flights,
 * else all-flights that missed Iberian destinations, else refresh #1.
 * APIs down: next airport missing an Iberian map (including ones that already have all-flights).
 */
export function pickExternalAirportForRun(
  ranked: RankedExternalAirport[],
  sampledOrCoverage: ReadonlySet<string> | ExternalMapCoverage,
  options: PickExternalAirportOptions = {},
): RankedExternalAirport | null {
  if (ranked.length === 0) return null;
  const { completeIatas, inboundIatas, staleAllFlightsIatas } = asCoverage(sampledOrCoverage);
  const flightApisAvailable = options.flightApisAvailable !== false;

  if (flightApisAvailable) {
    const hasIberianMissingAll = ranked.find(
      (row) => inboundIatas.has(row.iata) && !completeIatas.has(row.iata),
    );
    if (hasIberianMissingAll) return hasIberianMissingAll;
    const missingAllFlights = ranked.find((row) => !completeIatas.has(row.iata));
    if (missingAllFlights) return missingAllFlights;
    const staleAllFlights = ranked.find((row) => staleAllFlightsIatas.has(row.iata));
    if (staleAllFlights) return staleAllFlights;
    return ranked[0] ?? null;
  }

  return ranked.find((row) => !inboundIatas.has(row.iata)) ?? null;
}

export function externalAirportDisplayName(
  iata: string,
  coords: AirportCoordinate | undefined,
): string {
  return destinationAirportDisplayName(iata, coords?.name || iata);
}
