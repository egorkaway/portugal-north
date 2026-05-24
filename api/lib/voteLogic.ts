import {
  HOTEL_CLOSED_REPORTS_PATH,
  HOTEL_VOTES_PATH,
  readClosedReportsFromBlob,
  readRatingsFromBlob,
  STATION_IMAGE_VOTES_PATH,
  STATION_VOTES_PATH,
  writeClosedReportsToBlob,
  writeRatingsToBlob,
} from "./blobVotes.js";

type VoteDirection = "up" | "down";

export type StationRating = { up: number; down: number };
export type GlobalRatings = Record<string, StationRating>;

export type HotelClosedReport = { reports: number };
export type HotelClosedReports = Record<string, HotelClosedReport>;

export function applyDeltaInMemory(
  ratings: GlobalRatings,
  key: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): GlobalRatings {
  const current = ratings[key] ? { ...ratings[key] } : { up: 0, down: 0 };

  if (previous) current[previous] = Math.max(0, current[previous] - 1);
  if (next) current[next] += 1;

  const nextRatings = { ...ratings };
  if (current.up === 0 && current.down === 0) {
    delete nextRatings[key];
  } else {
    nextRatings[key] = current;
  }
  return nextRatings;
}

export async function readGlobalStationRatings(): Promise<GlobalRatings> {
  return readRatingsFromBlob(STATION_VOTES_PATH);
}

export async function readGlobalHotelRatings(): Promise<GlobalRatings> {
  return readRatingsFromBlob(HOTEL_VOTES_PATH);
}

export async function applyStationVoteDelta(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const ratings = await readGlobalStationRatings();
  const updated = applyDeltaInMemory(ratings, station, previous, next);
  await writeRatingsToBlob(STATION_VOTES_PATH, updated);
  return true;
}

export async function applyHotelVoteDelta(
  hotelKey: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const ratings = await readGlobalHotelRatings();
  const updated = applyDeltaInMemory(ratings, hotelKey, previous, next);
  await writeRatingsToBlob(HOTEL_VOTES_PATH, updated);
  return true;
}

export async function readGlobalStationImageRatings(): Promise<GlobalRatings> {
  return readRatingsFromBlob(STATION_IMAGE_VOTES_PATH);
}

export async function applyStationImageVoteDelta(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const ratings = await readGlobalStationImageRatings();
  const updated = applyDeltaInMemory(ratings, station, previous, next);
  await writeRatingsToBlob(STATION_IMAGE_VOTES_PATH, updated);
  return true;
}

export function applyClosedReportDeltaInMemory(
  reports: HotelClosedReports,
  key: string,
  wasReported: boolean,
  isReported: boolean,
): HotelClosedReports {
  const current = reports[key] ? { ...reports[key] } : { reports: 0 };

  if (wasReported) current.reports = Math.max(0, current.reports - 1);
  if (isReported) current.reports += 1;

  const nextReports = { ...reports };
  if (current.reports === 0) {
    delete nextReports[key];
  } else {
    nextReports[key] = current;
  }
  return nextReports;
}

export async function readGlobalHotelClosedReports(): Promise<HotelClosedReports> {
  return readClosedReportsFromBlob(HOTEL_CLOSED_REPORTS_PATH);
}

export async function applyHotelClosedReportDelta(
  hotelKey: string,
  wasReported: boolean,
  isReported: boolean,
): Promise<boolean> {
  const reports = await readGlobalHotelClosedReports();
  const updated = applyClosedReportDeltaInMemory(reports, hotelKey, wasReported, isReported);
  await writeClosedReportsToBlob(HOTEL_CLOSED_REPORTS_PATH, updated);
  return true;
}

/** @deprecated Use readGlobalStationRatings */
export async function readGlobalRatings(): Promise<GlobalRatings> {
  return readGlobalStationRatings();
}

/** @deprecated Use applyStationVoteDelta */
export async function applyVoteDelta(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  return applyStationVoteDelta(station, previous, next);
}

export function isValidName(name: unknown): name is string {
  return typeof name === "string" && name.length >= 1 && name.length <= 120;
}

export function isValidHotelKey(key: unknown): key is string {
  if (!isValidName(key)) return false;
  const sep = key.indexOf("::");
  return sep > 0 && sep < key.length - 2;
}

export function isValidDirection(value: unknown): value is VoteDirection | null {
  return value === null || value === "up" || value === "down";
}

export function isValidVoteChange(
  previous: VoteDirection | null,
  next: VoteDirection | null,
): boolean {
  return previous !== null || next !== null;
}

export function isValidReportedFlag(value: unknown): value is boolean {
  return value === true || value === false;
}

export function isValidClosedReportChange(wasReported: boolean, isReported: boolean): boolean {
  return wasReported !== isReported;
}
