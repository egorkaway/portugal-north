import { useSyncExternalStore } from "react";
import { hotelVoteKey } from "@/lib/rankHotels";
import { syncHotelClosedReportToServer } from "@/lib/votesApi";

const COOKIE_NAME = "hotel_closed_reports";

type ClosedReportsMap = Record<string, true>;

function readReports(): ClosedReportsMap {
  if (typeof document === "undefined") return {};
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return {};
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1])) || {};
  } catch {
    return {};
  }
}

function writeReports(reports: ClosedReportsMap) {
  const value = encodeURIComponent(JSON.stringify(reports));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

const listeners = new Set<() => void>();
let cache: ClosedReportsMap | null = null;

function getSnapshot(): ClosedReportsMap {
  if (cache === null) cache = readReports();
  return cache;
}

function emit() {
  cache = readReports();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useHotelClosedReport(stationName: string, hotelName: string) {
  const key = hotelVoteKey(stationName, hotelName);
  const reports = useSyncExternalStore(subscribe, getSnapshot, () => ({}));
  const reported = Boolean(reports[key]);

  const toggle = () => {
    const current = readReports();
    const wasReported = Boolean(current[key]);
    const isReported = !wasReported;

    if (isReported) {
      current[key] = true;
    } else {
      delete current[key];
    }

    writeReports(current);
    emit();
    void syncHotelClosedReportToServer(key, wasReported, isReported);
  };

  return { reported, toggle };
}
