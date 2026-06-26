import type { Locale } from "@/i18n/types";
import { stationSummariesByLocale } from "@/data/stationSummaries";

export function getStationSummary(
  stationName: string,
  locale: Locale = "en",
): string | undefined {
  return (
    stationSummariesByLocale[locale]?.[stationName] ??
    stationSummariesByLocale.en[stationName]
  );
}

export function hasStationSummary(stationName: string): boolean {
  return stationName in stationSummariesByLocale.en;
}
