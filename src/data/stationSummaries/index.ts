import type { Locale } from "@/i18n/types";
import { stationSummariesEn } from "./en";
import { stationSummariesPt } from "./pt";
import { stationSummariesEs } from "./es";
import { stationSummariesCa } from "./ca";
import { stationSummariesGl } from "./gl";

/** Station names that have editorial summaries (busiest stops first). */
export const STATION_SUMMARY_NAMES = Object.keys(stationSummariesEn);

export const stationSummariesByLocale: Record<Locale, Record<string, string>> = {
  en: stationSummariesEn,
  pt: stationSummariesPt,
  es: stationSummariesEs,
  ca: stationSummariesCa,
  gl: stationSummariesGl,
};
