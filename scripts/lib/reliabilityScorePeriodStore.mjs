/**
 * Freeze reliability score manifests on the shared snapshot calendar.
 * Live `reliability-scores.json` keeps updating; archives are write-only (no UI yet).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  PERIOD_TIMEZONE,
  buildEmptyPeriodsIndex,
  periodContaining,
} from "./snapshotPeriods.mjs";

export function reliabilityPeriodsIndexPath(rootDir) {
  return join(rootDir, "public/data/reliability-scores-periods.json");
}

export function liveReliabilityPath(rootDir) {
  return join(rootDir, "public/data/reliability-scores.json");
}

export function frozenReliabilityPath(rootDir, periodId) {
  return join(rootDir, "public/data/reliability-scores/periods", `${periodId}.json`);
}

export function loadReliabilityPeriodsIndex(rootDir) {
  const path = reliabilityPeriodsIndexPath(rootDir);
  if (!existsSync(path)) {
    return buildEmptyPeriodsIndex();
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return buildEmptyPeriodsIndex();
  }
}

export function saveReliabilityPeriodsIndex(rootDir, index) {
  mkdirSync(join(rootDir, "public/data"), { recursive: true });
  writeFileSync(reliabilityPeriodsIndexPath(rootDir), `${JSON.stringify(index, null, 2)}\n`);
}

export function loadLiveReliabilityManifest(rootDir) {
  const path = liveReliabilityPath(rootDir);
  if (!existsSync(path)) {
    return null;
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/**
 * Write a frozen copy of the live reliability manifest for a closing period.
 * @param {string} rootDir
 * @param {string} periodId
 * @param {Record<string, unknown>} liveManifest
 */
export function freezeReliabilityPeriod(rootDir, periodId, liveManifest) {
  const periodMeta = periodContaining(periodId);
  const outPath = frozenReliabilityPath(rootDir, periodId);
  mkdirSync(join(rootDir, "public/data/reliability-scores/periods"), { recursive: true });
  const snapshot = {
    ...liveManifest,
    periodId,
    periodStart: periodMeta.start,
    periodEndExclusive: periodMeta.endExclusive,
    frozenAt: new Date().toISOString(),
  };
  writeFileSync(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);
  return outPath;
}

/**
 * After computing fresh live reliability scores: if the calendar period advanced,
 * freeze the *previous* live file under the closing period id. Live keeps updating
 * (scores are not reset).
 *
 * @param {{
 *   rootDir: string,
 *   previousLiveManifest: Record<string, unknown> | null,
 *   nextLiveManifest: Record<string, unknown>,
 *   asOf?: Date | string,
 *   dryRun?: boolean,
 * }} opts
 * @returns {{
 *   period: { id: string, start: string, endExclusive: string },
 *   stampedManifest: Record<string, unknown>,
 *   rolled: boolean,
 *   frozen: boolean,
 * }}
 */
export function ensureReliabilityPeriodSnapshot({
  rootDir,
  previousLiveManifest,
  nextLiveManifest,
  asOf = new Date(),
  dryRun = false,
}) {
  const todayPeriod = periodContaining(asOf);
  let index = loadReliabilityPeriodsIndex(rootDir);
  const livePeriodId =
    (previousLiveManifest &&
      typeof previousLiveManifest.periodId === "string" &&
      previousLiveManifest.periodId) ||
    (typeof index.currentPeriodId === "string" ? index.currentPeriodId : null);

  let rolled = false;
  let frozen = false;

  if (livePeriodId && livePeriodId !== todayPeriod.id && previousLiveManifest) {
    const alreadyFrozen = (index.periods ?? []).some((entry) => entry.id === livePeriodId);
    if (!alreadyFrozen) {
      if (!dryRun) {
        const path = freezeReliabilityPeriod(rootDir, livePeriodId, previousLiveManifest);
        console.log(`Froze reliability scores period ${livePeriodId} → ${path}`);
      } else {
        console.log(`[dry-run] would freeze reliability period ${livePeriodId}`);
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
    rolled = true;
    console.log(
      `Reliability scores period → ${todayPeriod.id} (until ${todayPeriod.endExclusive}); live file keeps updating`,
    );
  }

  index = {
    ...index,
    timezone: PERIOD_TIMEZONE,
    currentPeriodId: todayPeriod.id,
    currentPeriodStart: todayPeriod.start,
    currentPeriodEndExclusive: todayPeriod.endExclusive,
    periods: Array.isArray(index.periods) ? index.periods : [],
  };

  const stampedManifest = {
    ...nextLiveManifest,
    periodId: todayPeriod.id,
    periodStart: todayPeriod.start,
    periodEndExclusive: todayPeriod.endExclusive,
  };

  if (!dryRun) {
    saveReliabilityPeriodsIndex(rootDir, index);
  }

  return { period: todayPeriod, stampedManifest, rolled, frozen };
}
