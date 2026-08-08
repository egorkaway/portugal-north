import { describe, expect, it } from "vitest";
import {
  lisbonYearMonth,
  monthlyTemperatureTone,
  shouldDisplayStationMonthlyTemperature,
  type StationMonthlyTemperaturesManifest,
} from "@/lib/stationMonthlyTemperatures";
import { buildStationMonthlyTemperaturesManifest } from "../../server/lib/stationTemperatureLog";

describe("shouldDisplayStationMonthlyTemperature", () => {
  const manifest: StationMonthlyTemperaturesManifest = {
    generatedAt: "2026-08-08T12:00:00.000Z",
    yearMonth: "2026-08",
    stations: {
      Beja: { avgLowC: 21, avgHighC: 25.5, dayCount: 4, sampleCount: 14 },
      Sparse: { avgLowC: 20, avgHighC: 22, dayCount: 2, sampleCount: 9 },
    },
  };

  it("shows only for the current Lisbon month with enough samples", () => {
    expect(
      shouldDisplayStationMonthlyTemperature(manifest, "Beja", new Date("2026-08-15T12:00:00Z")),
    ).toBe(true);
    expect(
      shouldDisplayStationMonthlyTemperature(manifest, "Sparse", new Date("2026-08-15T12:00:00Z")),
    ).toBe(false);
  });

  it("hides on the first day of the next month even if JSON is stale", () => {
    expect(
      shouldDisplayStationMonthlyTemperature(manifest, "Beja", new Date("2026-09-01T00:30:00Z")),
    ).toBe(false);
    expect(
      shouldDisplayStationMonthlyTemperature(manifest, "Beja", new Date("2026-11-01T12:00:00Z")),
    ).toBe(false);
  });
});

describe("monthlyTemperatureTone", () => {
  it("colors cool and hot temperatures", () => {
    expect(monthlyTemperatureTone(19.9)).toContain("sky");
    expect(monthlyTemperatureTone(20)).toContain("foreground");
    expect(monthlyTemperatureTone(30)).toContain("foreground");
    expect(monthlyTemperatureTone(30.1)).toContain("orange");
  });
});

describe("buildStationMonthlyTemperaturesManifest", () => {
  it("publishes only stations with more than nine samples", () => {
    const readings = [];
    for (let i = 0; i < 10; i += 1) {
      readings.push({
        recordedAt: `2026-08-0${(i % 8) + 1}T12:00:00.000Z`,
        observedAt: `2026-08-0${(i % 8) + 1}T12:00`,
        station: "Beja",
        lat: 38.0,
        lng: -7.8,
        tempC: 20 + i,
        source: "open-meteo" as const,
      });
    }
    for (let i = 0; i < 5; i += 1) {
      readings.push({
        recordedAt: `2026-08-0${i + 1}T12:00:00.000Z`,
        observedAt: `2026-08-0${i + 1}T12:00`,
        station: "Sparse",
        lat: 38.0,
        lng: -7.8,
        tempC: 18,
        source: "open-meteo" as const,
      });
    }

    const manifest = buildStationMonthlyTemperaturesManifest({
      readings,
      yearMonth: "2026-08",
      generatedAt: "2026-08-08T12:00:00.000Z",
    });

    expect(manifest.yearMonth).toBe("2026-08");
    expect(manifest.stations.Beja?.sampleCount).toBe(10);
    expect(manifest.stations.Sparse).toBeUndefined();
    expect(lisbonYearMonth(new Date("2026-08-08T12:00:00Z"))).toBe("2026-08");
  });
});
