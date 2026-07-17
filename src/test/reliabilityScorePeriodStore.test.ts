import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  ensureReliabilityPeriodSnapshot,
  frozenReliabilityPath,
  loadReliabilityPeriodsIndex,
} from "../../scripts/lib/reliabilityScorePeriodStore.mjs";

describe("reliabilityScorePeriodStore", () => {
  /** @type {string[]} */
  const temps = [];

  afterEach(() => {
    while (temps.length) {
      const dir = temps.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function makeRoot() {
    const rootDir = mkdtempSync(join(tmpdir(), "reliability-periods-"));
    temps.push(rootDir);
    mkdirSync(join(rootDir, "public/data"), { recursive: true });
    writeFileSync(
      join(rootDir, "public/data/reliability-scores.json"),
      `${JSON.stringify(
        {
          generatedAt: "2026-07-15T12:00:00.000Z",
          runCount: 10,
          stationCount: 2,
          periodId: "2026-07-05",
          periodStart: "2026-07-05",
          periodEndExclusive: "2026-08-11",
          scores: { Aveiro: 7.1, Pombal: 5.6 },
          movements: { Aveiro: 100, Pombal: 40 },
        },
        null,
        2,
      )}\n`,
    );
    writeFileSync(
      join(rootDir, "public/data/reliability-scores-periods.json"),
      `${JSON.stringify(
        {
          timezone: "Europe/Lisbon",
          currentPeriodId: "2026-07-05",
          currentPeriodStart: "2026-07-05",
          currentPeriodEndExclusive: "2026-08-11",
          periods: [],
        },
        null,
        2,
      )}\n`,
    );
    return rootDir;
  }

  it("stamps the live period without freezing while still inside it", () => {
    const rootDir = makeRoot();
    const previous = JSON.parse(
      readFileSync(join(rootDir, "public/data/reliability-scores.json"), "utf8"),
    );
    const next = {
      ...previous,
      runCount: 11,
      scores: { Aveiro: 7.2, Pombal: 5.7 },
    };
    const result = ensureReliabilityPeriodSnapshot({
      rootDir,
      previousLiveManifest: previous,
      nextLiveManifest: next,
      asOf: "2026-08-10",
    });
    expect(result.rolled).toBe(false);
    expect(result.frozen).toBe(false);
    expect(result.stampedManifest.periodId).toBe("2026-07-05");
    expect(result.stampedManifest.scores.Aveiro).toBe(7.2);
  });

  it("freezes previous live scores on the open date and stamps the new period", () => {
    const rootDir = makeRoot();
    const previous = JSON.parse(
      readFileSync(join(rootDir, "public/data/reliability-scores.json"), "utf8"),
    );
    const next = {
      generatedAt: "2026-08-11T10:00:00.000Z",
      runCount: 12,
      stationCount: 2,
      scores: { Aveiro: 7.5, Pombal: 6.0 },
      movements: { Aveiro: 120, Pombal: 50 },
    };
    const result = ensureReliabilityPeriodSnapshot({
      rootDir,
      previousLiveManifest: previous,
      nextLiveManifest: next,
      asOf: "2026-08-11",
    });

    expect(result.rolled).toBe(true);
    expect(result.frozen).toBe(true);
    expect(result.stampedManifest.periodId).toBe("2026-08-11");
    expect(result.stampedManifest.scores.Aveiro).toBe(7.5);

    const frozenPath = frozenReliabilityPath(rootDir, "2026-07-05");
    expect(existsSync(frozenPath)).toBe(true);
    const frozen = JSON.parse(readFileSync(frozenPath, "utf8"));
    expect(frozen.periodId).toBe("2026-07-05");
    expect(frozen.scores.Aveiro).toBe(7.1);
    expect(typeof frozen.frozenAt).toBe("string");

    const index = loadReliabilityPeriodsIndex(rootDir);
    expect(index.currentPeriodId).toBe("2026-08-11");
    expect(index.periods.map((p) => p.id)).toContain("2026-07-05");
  });
});
