import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/types";
import { STATION_SUMMARY_NAMES } from "@/data/stationSummaries";
import { hasStationSummary, getStationSummary } from "@/lib/stationSummary";
import { stationsNeedingSummaries } from "@/lib/stationSummaryQueue";
import { rankStationsByTrainVolume } from "@/lib/stationTrainVolume";

describe("station summaries coverage", () => {
  it("lists the next five stations without summaries", () => {
    expect(stationsNeedingSummaries(5)).toEqual([]);
  });

  it("covers every ranked station that has a summary", () => {
    const ranked = rankStationsByTrainVolume().map((entry) => entry.station.name);
    const pending = new Set(stationsNeedingSummaries());

    for (const name of ranked) {
      if (hasStationSummary(name)) {
        expect(getStationSummary(name), name).toMatch(/\.\s*$/);
      } else {
        expect(pending.has(name), `unexpected gap: ${name}`).toBe(true);
      }
    }

    expect(STATION_SUMMARY_NAMES.length + pending.size).toBe(ranked.length);
  });
});

describe("station summaries i18n", () => {
  it("has all station keys in every locale", () => {
    expect(STATION_SUMMARY_NAMES.length).toBe(347);

    for (const locale of LOCALES) {
      for (const name of STATION_SUMMARY_NAMES) {
        const summary = getStationSummary(name, locale);
        expect(summary, `${locale}: ${name}`).toBeDefined();
        expect(summary).toMatch(/\.\s*$/);
        expect(summary).not.toMatch(/\bAP\b|\bIC\b/);
      }
    }
  });

  it("falls back to English for unknown locale keys", () => {
    const en = getStationSummary("Lisboa Oriente", "en");
    // @ts-expect-error testing runtime fallback
    expect(getStationSummary("Lisboa Oriente", "xx")).toBe(en);
  });
});
