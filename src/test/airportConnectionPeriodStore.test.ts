import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  ensureAirportConnectionPeriodRoll,
  frozenMapsDir,
  frozenManifestPath,
  loadPeriodsIndex,
} from "../../scripts/lib/airportConnectionPeriodStore.mjs";

describe("airportConnectionPeriodStore", () => {
  /** @type {string[]} */
  const temps = [];

  afterEach(() => {
    while (temps.length) {
      const dir = temps.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  function makeRoot() {
    const rootDir = mkdtempSync(join(tmpdir(), "airport-periods-"));
    temps.push(rootDir);
    mkdirSync(join(rootDir, "public/data"), { recursive: true });
    mkdirSync(join(rootDir, "public/maps/airports"), { recursive: true });
    writeFileSync(
      join(rootDir, "public/data/airport-connections.json"),
      `${JSON.stringify(
        {
          generatedAt: "2026-07-15T12:00:00.000Z",
          runCount: 1,
          airportCount: 1,
          periodId: "2026-07-05",
          periodStart: "2026-07-05",
          periodEndExclusive: "2026-08-11",
          airports: {
            FAO: {
              stationName: "Faro Airport (FAO)",
              slug: "faro-airport-fao",
              iata: "FAO",
              connections: [],
              topDestinations: [],
              mapImage: "/maps/airports/faro-airport-fao-connections.png",
            },
          },
        },
        null,
        2,
      )}\n`,
    );
    writeFileSync(join(rootDir, "public/maps/airports/faro-airport-fao-connections.png"), "png");
    writeFileSync(
      join(rootDir, "public/data/airport-connections-periods.json"),
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

  it("keeps live airports when still inside the open period", () => {
    const rootDir = makeRoot();
    const result = ensureAirportConnectionPeriodRoll({
      rootDir,
      asOf: "2026-08-10",
    });
    expect(result.rolled).toBe(false);
    expect(result.frozen).toBe(false);
    expect(result.period.id).toBe("2026-07-05");
    expect(result.airports.FAO?.iata).toBe("FAO");
  });

  it("freezes the previous period and clears live airports on the open date", () => {
    const rootDir = makeRoot();
    const result = ensureAirportConnectionPeriodRoll({
      rootDir,
      asOf: "2026-08-11",
    });

    expect(result.rolled).toBe(true);
    expect(result.frozen).toBe(true);
    expect(result.period.id).toBe("2026-08-11");
    expect(result.airports).toEqual({});

    expect(existsSync(frozenManifestPath(rootDir, "2026-07-05"))).toBe(true);
    expect(existsSync(join(frozenMapsDir(rootDir, "2026-07-05"), "faro-airport-fao-connections.png"))).toBe(
      true,
    );

    const frozen = JSON.parse(readFileSync(frozenManifestPath(rootDir, "2026-07-05"), "utf8"));
    expect(frozen.periodId).toBe("2026-07-05");
    expect(frozen.airports.FAO.iata).toBe("FAO");
    expect(typeof frozen.frozenAt).toBe("string");

    const index = loadPeriodsIndex(rootDir);
    expect(index.currentPeriodId).toBe("2026-08-11");
    expect(index.periods.map((p) => p.id)).toContain("2026-07-05");
  });
});
