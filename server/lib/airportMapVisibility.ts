/** Consecutive empty connection periods before a previously-active hub is hidden (~several months). */
export const AIRPORT_MAP_HIDE_EMPTY_PERIODS = 3;

/** After a period opens, keep sampling hubs that have never recorded flights for this many Lisbon calendar days. */
export const NEVER_SEEN_AIRPORT_RECHECK_DAYS = 14;

export type AirportMapVisibilityEntry = {
  consecutiveEmptyPeriods: number;
  lastEmptyPeriodId: string | null;
  lastOkPeriodId: string | null;
  hiddenFromMap: boolean;
  updatedAt: string;
};

export type AirportMapVisibilityManifest = {
  generatedAt: string;
  /** Periods of empty results required before hiding a hub that once had flights. */
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

/** True if we have ever baked mappable destinations for this hub. */
export function airportHasRecordedFlights(
  entry: AirportMapVisibilityEntry | null | undefined,
): boolean {
  return Boolean(entry?.lastOkPeriodId);
}

/**
 * Add calendar days to a YYYY-MM-DD string (UTC date arithmetic; period ids are Lisbon calendar dates).
 */
export function addCalendarDays(ymd: string, days: number): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * First `days` Lisbon calendar days of a period (start inclusive, start+days exclusive).
 * Example: period starts 2026-07-05 → window is 2026-07-05 .. 2026-07-18 inclusive.
 */
export function isWithinNeverSeenRecheckWindow(
  periodStart: string,
  todayYmd: string,
  days = NEVER_SEEN_AIRPORT_RECHECK_DAYS,
): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(periodStart) || !/^\d{4}-\d{2}-\d{2}$/.test(todayYmd)) {
    return false;
  }
  const endExclusive = addCalendarDays(periodStart, days);
  return todayYmd >= periodStart && todayYmd < endExclusive;
}

/**
 * Whether collect should call the flight API for this hub.
 * Hubs that once had flights are always sampled; never-seen hubs only during the
 * first two weeks after each period opens (unless `force`).
 */
export function shouldSampleAirportHub(options: {
  visibilityEntry?: AirportMapVisibilityEntry | null;
  /** Destinations already unioned into this period's live entry. */
  hasLiveConnections?: boolean;
  force?: boolean;
  periodStart: string;
  todayYmd: string;
}): boolean {
  const {
    visibilityEntry,
    hasLiveConnections = false,
    force = false,
    periodStart,
    todayYmd,
  } = options;
  if (force) return true;
  if (hasLiveConnections || airportHasRecordedFlights(visibilityEntry)) return true;
  return isWithinNeverSeenRecheckWindow(periodStart, todayYmd);
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
 * Hubs that have never recorded flights are hidden immediately; hubs that once
 * had flights hide after `hideAfterEmptyPeriods` consecutive empty periods.
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

  const neverRecorded = !airportHasRecordedFlights(prev);
  const consecutiveEmptyPeriods = (prev?.consecutiveEmptyPeriods ?? 0) + 1;
  const hideAfter = manifest.hideAfterEmptyPeriods ?? AIRPORT_MAP_HIDE_EMPTY_PERIODS;
  const airports = { ...manifest.airports };
  airports[code] = {
    consecutiveEmptyPeriods,
    lastEmptyPeriodId: periodId,
    lastOkPeriodId: prev?.lastOkPeriodId ?? null,
    hiddenFromMap: neverRecorded || consecutiveEmptyPeriods >= hideAfter,
    updatedAt: now.toISOString(),
  };
  return {
    ...manifest,
    generatedAt: now.toISOString(),
    airports,
  };
}

/**
 * Mark hubs that have never recorded flights as hidden (idempotent backfill).
 */
export function hideNeverRecordedAirports(
  manifest: AirportMapVisibilityManifest,
  now = new Date(),
): AirportMapVisibilityManifest {
  let changed = false;
  const airports = { ...manifest.airports };
  for (const [iata, entry] of Object.entries(airports)) {
    if (!airportHasRecordedFlights(entry) && !entry.hiddenFromMap) {
      airports[iata] = {
        ...entry,
        hiddenFromMap: true,
        updatedAt: now.toISOString(),
      };
      changed = true;
    }
  }
  if (!changed) return manifest;
  return {
    ...manifest,
    generatedAt: now.toISOString(),
    airports,
  };
}
