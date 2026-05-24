export type VoteDirection = "up" | "down";

export type StationRating = {
  up: number;
  down: number;
};

export type GlobalRatings = Record<string, StationRating>;

export type VoteSyncPayload = {
  station: string;
  previous: VoteDirection | null;
  next: VoteDirection | null;
};
