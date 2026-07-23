/** Consecutive empty connection periods before an airport is hidden on the map (~several months). */
export const AIRPORT_MAP_HIDE_EMPTY_PERIODS = 3;

export type AirportMapVisibilityEntry = {
  consecutiveEmptyPeriods: number;
  lastEmptyPeriodId: string | null;
  lastOkPeriodId: string | null;
  hiddenFromMap: boolean;
  updatedAt: string;
};

export type AirportMapVisibilityManifest = {
  generatedAt: string;
  /** Periods of empty results required before hiding. */
  hideAfterEmptyPeriods: number;
  airports: Record<string, AirportMapVisibilityEntry>;
};

export function emptyAirportMapVisibilityManifest(
  hideAfterEmptyPeriods = AIRPORT_MAP_HIDE_EMPTY_PERIODS,
): AirportMapVisibilityManifest {
  return {
    generatedAt: new Date().toISOString(),
    hideAfterEmptyPeriods,
    airports: {},
  };
}

export function isAirportHiddenFromMap(
  manifest: AirportMapVisibilityManifest | null | undefined,
  iata: string,
): boolean {
  const code = iata.trim().toUpperCase();
  if (!code) return false;
  return Boolean(manifest?.airports?.[code]?.hiddenFromMap);
}

export function hiddenAirportIatas(
  manifest: AirportMapVisibilityManifest | null | undefined,
): Set<string> {
  const hidden = new Set<string>();
  if (!manifest?.airports) return hidden;
  for (const [iata, entry] of Object.entries(manifest.airports)) {
    if (entry.hiddenFromMap) hidden.add(iata.toUpperCase());
  }
  return hidden;
}

/**
 * Record a successful mappable-connections bake for this period.
 * Clears the empty streak and un-hides the airport.
 */
export function recordAirportConnectionsOk(
  manifest: AirportMapVisibilityManifest,
  iata: string,
  periodId: string,
  now = new Date(),
): AirportMapVisibilityManifest {
  const code = iata.trim().toUpperCase();
  const airports = { ...manifest.airports };
  airports[code] = {
    consecutiveEmptyPeriods: 0,
    lastEmptyPeriodId: airports[code]?.lastEmptyPeriodId ?? null,
    lastOkPeriodId: periodId,
    hiddenFromMap: false,
    updatedAt: now.toISOString(),
  };
  return {
    ...manifest,
    generatedAt: now.toISOString(),
    airports,
  };
}

/**
 * Record "No mappable connections" for this period.
 * Re-runs in the same period do not double-count.
 */
export function recordAirportConnectionsEmpty(
  manifest: AirportMapVisibilityManifest,
  iata: string,
  periodId: string,
  now = new Date(),
): AirportMapVisibilityManifest {
  const code = iata.trim().toUpperCase();
  const prev = manifest.airports[code];
  if (prev?.lastEmptyPeriodId === periodId) {
    return manifest;
  }

  const consecutiveEmptyPeriods = (prev?.consecutiveEmptyPeriods ?? 0) + 1;
  const hideAfter = manifest.hideAfterEmptyPeriods ?? AIRPORT_MAP_HIDE_EMPTY_PERIODS;
  const airports = { ...manifest.airports };
  airports[code] = {
    consecutiveEmptyPeriods,
    lastEmptyPeriodId: periodId,
    lastOkPeriodId: prev?.lastOkPeriodId ?? null,
    hiddenFromMap: consecutiveEmptyPeriods >= hideAfter,
    updatedAt: now.toISOString(),
  };
  return {
    ...manifest,
    generatedAt: now.toISOString(),
    airports,
  };
}
