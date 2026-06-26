import { describe, expect, it } from "vitest";
import { LOCALES } from "@/i18n/types";
import { SPAIN_SUMMARY_NAMES } from "@/data/stationSummaries/spain/names";
import { getStationSummary } from "@/lib/stationSummary";

describe("Spain station summaries i18n", () => {
  it("has all 48 Spain keys in every locale", () => {
    expect(SPAIN_SUMMARY_NAMES).toHaveLength(48);

    for (const locale of LOCALES) {
      for (const name of SPAIN_SUMMARY_NAMES) {
        const summary = getStationSummary(name, locale);
        expect(summary, `${locale}: ${name}`).toBeDefined();
        expect(summary).toMatch(/\.\s*$/);
        expect(summary).not.toMatch(/\bAP\b|\bIC\b/);
      }
    }
  });
});
