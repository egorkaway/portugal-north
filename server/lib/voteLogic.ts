import {
  readCommunityVotesFromBlob,
  writeCommunityVotesToBlob,
  type CommunityVotesBlob,
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
  const data = await readCommunityVotesFromBlob();
  return data.ratings;
}

export async function readGlobalHotelRatings(): Promise<GlobalRatings> {
  const data = await readCommunityVotesFromBlob();
  return data.hotelRatings;
}

export async function readAllCommunityVotes(): Promise<CommunityVotesBlob> {
  return readCommunityVotesFromBlob();
}

export async function applyStationVoteDelta(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const data = await readCommunityVotesFromBlob();
  const updated = applyDeltaInMemory(data.ratings, station, previous, next);
  await writeCommunityVotesToBlob({ ...data, ratings: updated });
  return true;
}

export async function applyHotelVoteDelta(
  hotelKey: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const data = await readCommunityVotesFromBlob();
  const updated = applyDeltaInMemory(data.hotelRatings, hotelKey, previous, next);
  await writeCommunityVotesToBlob({ ...data, hotelRatings: updated });
  return true;
}

export async function readGlobalStationImageRatings(): Promise<GlobalRatings> {
  const data = await readCommunityVotesFromBlob();
  return data.imageRatings;
}

export async function applyStationImageVoteDelta(
  station: string,
  previous: VoteDirection | null,
  next: VoteDirection | null,
): Promise<boolean> {
  const data = await readCommunityVotesFromBlob();
  const updated = applyDeltaInMemory(data.imageRatings, station, previous, next);
  await writeCommunityVotesToBlob({ ...data, imageRatings: updated });
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
  const data = await readCommunityVotesFromBlob();
  return data.hotelClosedReports;
}

export async function applyHotelClosedReportDelta(
  hotelKey: string,
  wasReported: boolean,
  isReported: boolean,
): Promise<boolean> {
  const data = await readCommunityVotesFromBlob();
  const updated = applyClosedReportDeltaInMemory(
    data.hotelClosedReports,
    hotelKey,
    wasReported,
    isReported,
  );
  await writeCommunityVotesToBlob({ ...data, hotelClosedReports: updated });
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
