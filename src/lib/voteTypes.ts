export type VoteDirection = "up" | "down";

export type ItemRating = {
  up: number;
  down: number;
};

export type GlobalRatings = Record<string, ItemRating>;

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
