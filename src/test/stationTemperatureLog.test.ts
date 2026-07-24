import { describe, expect, it } from "vitest";
import { parseOpenMeteoCurrentTemperatures } from "../../server/lib/openMeteoClient";
import {
  appendStationTemperatureReadings,
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
