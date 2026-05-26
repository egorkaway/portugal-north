export type VoteDirection = "up" | "down";

export type ItemRating = {
  up: number;
  down: number;
};

export type GlobalRatings = Record<string, ItemRating>;

export type RatingsSource = "network" | "cache" | "device";

export type GlobalRatingsResult = {
  ratings: GlobalRatings;
  hotelRatings: GlobalRatings;
  imageRatings: GlobalRatings;
  configured: boolean;
  source?: RatingsSource;
  savedAt?: number;
};

export type StationVoteSyncPayload = {
  station: string;
  previous: VoteDirection | null;
  next: VoteDirection | null;
};

export type HotelVoteSyncPayload = {
  hotelKey: string;
  previous: VoteDirection | null;
  next: VoteDirection | null;
};

export type StationImageVoteSyncPayload = {
  stationImage: string;
  previous: VoteDirection | null;
  next: VoteDirection | null;
};

export type HotelClosedReportSyncPayload = {
  hotelClosed: string;
  previous: boolean;
  next: boolean;
};
