/**
 * Read/write airport connection period index and freeze live artifacts.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import {
  PERIOD_TIMEZONE,
  buildEmptyPeriodsIndex,
  periodContaining,
} from "./airportConnectionPeriods.mjs";

export function periodsIndexPath(rootDir) {
  return join(rootDir, "public/data/airport-connections-periods.json");
}

export function liveManifestPath(rootDir) {
  return join(rootDir, "public/data/airport-connections.json");
}

export function liveMapsDir(rootDir) {
  return join(rootDir, "public/maps/airports");
}

export function frozenManifestPath(rootDir, periodId) {
  return join(rootDir, "public/data/airport-connections/periods", `${periodId}.json`);
}

export function frozenMapsDir(rootDir, periodId) {
  return join(rootDir, "public/maps/airports/periods", periodId);
}

export function loadPeriodsIndex(rootDir) {
  const path = periodsIndexPath(rootDir);
  if (!existsSync(path)) {
    return buildEmptyPeriodsIndex();
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return buildEmptyPeriodsIndex();
  }
}

export function savePeriodsIndex(rootDir, index) {
  const path = periodsIndexPath(rootDir);
  mkdirSync(join(rootDir, "public/data"), { recursive: true });
  writeFileSync(path, `${JSON.stringify(index, null, 2)}\n`);
}

export function loadLiveManifest(rootDir) {
  const path = liveManifestPath(rootDir);
  if (!existsSync(path)) {
    return { airports: {} };
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { airports: {} };
  }
}

/**
 * Copy live JSON + PNGs into the frozen period tree. Does not clear live files.
 * @returns {{ frozenJson: string, frozenMapsDir: string, pngCount: number }}
 */
export function freezeLivePeriodArtifacts(rootDir, periodId, liveManifest) {
  const periodMeta = periodContaining(periodId);
  const frozenJson = frozenManifestPath(rootDir, periodId);
  const mapsOut = frozenMapsDir(rootDir, periodId);
  mkdirSync(join(rootDir, "public/data/airport-connections/periods"), { recursive: true });
  mkdirSync(mapsOut, { recursive: true });

  const snapshot = {
    ...liveManifest,
    periodId,
    periodStart: periodMeta.start,
    periodEndExclusive: periodMeta.endExclusive,
    frozenAt: new Date().toISOString(),
  };
  writeFileSync(frozenJson, `${JSON.stringify(snapshot, null, 2)}\n`);

  const liveDir = liveMapsDir(rootDir);
  let pngCount = 0;
  if (existsSync(liveDir)) {
    for (const name of readdirSync(liveDir)) {
      if (!name.endsWith("-connections.png")) continue;
      copyFileSync(join(liveDir, name), join(mapsOut, name));
      pngCount += 1;
    }
  }

  return { frozenJson, frozenMapsDir: mapsOut, pngCount };
}

/**
 * Ensure live data matches today's open period: freeze previous if needed, reset live on roll.
 *
 * @param {{
 *   rootDir: string,
 *   asOf?: Date | string,
 *   dryRun?: boolean,
 * }} opts
 */
export function ensureAirportConnectionPeriodRoll({ rootDir, asOf = new Date(), dryRun = false }) {
  const todayPeriod = periodContaining(asOf);
  let index = loadPeriodsIndex(rootDir);
  const live = loadLiveManifest(rootDir);
  const livePeriodId =
    typeof live.periodId === "string" && live.periodId
      ? live.periodId
      : typeof index.currentPeriodId === "string"
        ? index.currentPeriodId
        : null;

  // First-time bootstrap: stamp index to today's period, keep live airports.
  if (!livePeriodId) {
    index = {
      timezone: PERIOD_TIMEZONE,
      currentPeriodId: todayPeriod.id,
      currentPeriodStart: todayPeriod.start,
      currentPeriodEndExclusive: todayPeriod.endExclusive,
      periods: Array.isArray(index.periods) ? index.periods : [],
    };
    if (!dryRun) savePeriodsIndex(rootDir, index);
    return {
      period: todayPeriod,
      airports: { ...(live.airports ?? {}) },
      rolled: false,
      frozen: false,
      index,
    };
  }

  if (livePeriodId === todayPeriod.id) {
    index = {
      ...index,
      timezone: PERIOD_TIMEZONE,
      currentPeriodId: todayPeriod.id,
      currentPeriodStart: todayPeriod.start,
      currentPeriodEndExclusive: todayPeriod.endExclusive,
      periods: Array.isArray(index.periods) ? index.periods : [],
    };
    if (!dryRun) savePeriodsIndex(rootDir, index);
    return {
      period: todayPeriod,
      airports: { ...(live.airports ?? {}) },
      rolled: false,
      frozen: false,
      index,
    };
  }

  // Live still belongs to an older period — freeze it, then start today's period empty.
  const alreadyFrozen = (index.periods ?? []).some((entry) => entry.id === livePeriodId);
  let frozen = false;
  if (!alreadyFrozen) {
    if (!dryRun) {
      const result = freezeLivePeriodArtifacts(rootDir, livePeriodId, live);
      console.log(
        `Froze airport connections period ${livePeriodId} → ${result.frozenJson} (${result.pngCount} PNGs)`,
      );
    } else {
      console.log(`[dry-run] would freeze period ${livePeriodId}`);
    }
    frozen = true;
    const oldPeriod = periodContaining(livePeriodId);
    index = {
      ...index,
      periods: [
        ...(index.periods ?? []).filter((entry) => entry.id !== livePeriodId),
        {
          id: livePeriodId,
          start: oldPeriod.start,
          endExclusive: oldPeriod.endExclusive,
          frozenAt: new Date().toISOString(),
        },
      ],
    };
  }

  index = {
    ...index,
    timezone: PERIOD_TIMEZONE,
    currentPeriodId: todayPeriod.id,
    currentPeriodStart: todayPeriod.start,
    currentPeriodEndExclusive: todayPeriod.endExclusive,
    periods: index.periods ?? [],
  };
  if (!dryRun) savePeriodsIndex(rootDir, index);

  console.log(
    `Starting airport connections period ${todayPeriod.id} (until ${todayPeriod.endExclusive})`,
  );

  return {
    period: todayPeriod,
    airports: {},
    rolled: true,
    frozen,
    index,
  };
}
