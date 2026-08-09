import { describe, expect, it } from "vitest";
import { parseOpenMeteoCurrentTemperatures } from "../../server/lib/openMeteoClient";
import {
  appendStationTemperatureReadings,
  computeStationMonthlyTemperatureAverages,
  formatStationMonthlyTemperatureLogLines,
  formatStationMonthlyTemperatureOkSuffix,
  readStationTemperatureLog,
  writeStationTemperatureLog,
} from "../../server/lib/stationTemperatureLog";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("openMeteoClient", () => {
  it("parses multi-location current temperature responses", () => {
    const readings = parseOpenMeteoCurrentTemperatures([
      {
        latitude: 41.15,
        longitude: -8.61,
        current: { time: "2026-07-23T19:30", temperature_2m: 21.2 },
      },
      {
        latitude: 38.72,
        longitude: -9.14,
        current: { time: "2026-07-23T19:30", temperature_2m: 22.4 },
      },
    ]);
    expect(readings).toEqual([
      { latitude: 41.15, longitude: -8.61, observedAt: "2026-07-23T19:30", tempC: 21.2 },
      { latitude: 38.72, longitude: -9.14, observedAt: "2026-07-23T19:30", tempC: 22.4 },
    ]);
  });

  it("parses a single-location object response", () => {
    const readings = parseOpenMeteoCurrentTemperatures({
      latitude: 40.4,
      longitude: -3.7,
      current: { time: "2026-07-23T12:00", temperature_2m: 31.5 },
    });
    expect(readings).toHaveLength(1);
    expect(readings[0]?.tempC).toBe(31.5);
  });
});

describe("stationTemperatureLog", () => {
  it("appends NDJSON readings", () => {
    const dir = mkdtempSync(join(tmpdir(), "temp-log-"));
    const path = join(dir, "station-temperature-log.ndjson");
    try {
      writeStationTemperatureLog(path, []);
      appendStationTemperatureReadings(path, [
        {
          recordedAt: "2026-07-23T20:00:00.000Z",
          observedAt: "2026-07-23T19:30",
          station: "Porto-Campanhã",
          country: "pt",
          lat: 41.15,
          lng: -8.61,
          tempC: 21.2,
          source: "open-meteo",
        },
      ]);
      appendStationTemperatureReadings(path, [
        {
          recordedAt: "2026-07-23T21:00:00.000Z",
          observedAt: "2026-07-23T20:30",
          station: "Lisboa Oriente",
          country: "pt",
          lat: 38.77,
          lng: -9.1,
          tempC: 23.1,
          source: "open-meteo",
        },
      ]);
      const rows = readStationTemperatureLog(path);
      expect(rows).toHaveLength(2);
      expect(rows[0]?.station).toBe("Porto-Campanhã");
      expect(rows[1]?.tempC).toBe(23.1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("computeStationMonthlyTemperatureAverages", () => {
  it("averages daily lows and highs for the Lisbon calendar month", () => {
    const averages = computeStationMonthlyTemperatureAverages({
      yearMonth: "2026-08",
      stationNames: ["Porto-Campanhã", "Lisboa Oriente"],
      readings: [
        {
          recordedAt: "2026-08-01T08:00:00.000Z",
          observedAt: "2026-08-01T08:00",
          station: "Porto-Campanhã",
          lat: 41.15,
          lng: -8.61,
          tempC: 18,
          source: "open-meteo",
        },
        {
          recordedAt: "2026-08-01T16:00:00.000Z",
          observedAt: "2026-08-01T16:00",
          station: "Porto-Campanhã",
          lat: 41.15,
          lng: -8.61,
          tempC: 26,
          source: "open-meteo",
        },
        {
          recordedAt: "2026-08-02T09:00:00.000Z",
          observedAt: "2026-08-02T09:00",
          station: "Porto-Campanhã",
          lat: 41.15,
          lng: -8.61,
          tempC: 20,
          source: "open-meteo",
        },
        {
          recordedAt: "2026-08-02T17:00:00.000Z",
          observedAt: "2026-08-02T17:00",
          station: "Porto-Campanhã",
          lat: 41.15,
          lng: -8.61,
          tempC: 28,
          source: "open-meteo",
        },
        // Outside month / inactive station — ignored
        {
          recordedAt: "2026-07-31T12:00:00.000Z",
          observedAt: "2026-07-31T12:00",
          station: "Porto-Campanhã",
          lat: 41.15,
          lng: -8.61,
          tempC: 99,
          source: "open-meteo",
        },
        {
          recordedAt: "2026-08-01T12:00:00.000Z",
          observedAt: "2026-08-01T12:00",
          station: "Ghost Station",
          lat: 0,
          lng: 0,
          tempC: 40,
          source: "open-meteo",
        },
      ],
    });

    expect(averages).toEqual([
      {
        station: "Porto-Campanhã",
        yearMonth: "2026-08",
        avgLowC: 19,
        avgHighC: 27,
        dayCount: 2,
        sampleCount: 4,
      },
    ]);

    const lines = formatStationMonthlyTemperatureLogLines(averages);
    expect(lines[0]).toContain("August 2026");
    expect(lines[1]).toContain(
      "this month average low 19°C / high 27°C (2 day(s), 4 sample(s))",
    );
    expect(formatStationMonthlyTemperatureOkSuffix(averages[0]!)).toBe(
      "this month average low 19°C / high 27°C (2 day(s), 4 sample(s))",
    );
  });
});
