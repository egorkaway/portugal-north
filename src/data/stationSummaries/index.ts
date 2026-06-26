import type { Locale } from "@/i18n/types";
import { stationSummariesEn } from "./en";
import { stationSummariesPt } from "./pt";
import { stationSummariesEs } from "./es";
import { stationSummariesCa } from "./ca";
import { stationSummariesGl } from "./gl";
import { spainSummariesEn } from "./spain/en";
import { spainSummariesPt } from "./spain/pt";
import { spainSummariesEs } from "./spain/es";
import { spainSummariesCa } from "./spain/ca";
import { spainSummariesGl } from "./spain/gl";

/** Portuguese station names that have editorial summaries (busiest stops first). */
export const STATION_SUMMARY_NAMES = Object.keys(stationSummariesEn);

export const stationSummariesByLocale: Record<Locale, Record<string, string>> = {
  en: { ...stationSummariesEn, ...spainSummariesEn },
  pt: { ...stationSummariesPt, ...spainSummariesPt },
  es: { ...stationSummariesEs, ...spainSummariesEs },
  ca: { ...stationSummariesCa, ...spainSummariesCa },
  gl: { ...stationSummariesGl, ...spainSummariesGl },
};
