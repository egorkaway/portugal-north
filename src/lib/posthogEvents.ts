import { capturePostHog, isPostHogEnabled } from "@/lib/posthog";

export type VoteType = "station" | "hotel" | "station_image";
export type VoteDirection = "up" | "down";

function capture(event: string, properties?: Record<string, unknown>): void {
  capturePostHog(event, properties);
}

export function trackStationViewed(options: {
  stationName: string;
  slug: string;
  hotelCount: number;
  lineCount: number;
}): void {
  capture("station_viewed", {
    station_name: options.stationName,
    station_slug: options.slug,
    hotel_count: options.hotelCount,
    line_count: options.lineCount,
  });
}

export function trackVoteCast(options: {
  voteType: VoteType;
  stationName: string;
  hotelName?: string;
  previous: VoteDirection | null;
  next: VoteDirection | null;
}): void {
  const action =
    options.next === null ? "cleared" : options.previous === null ? "set" : "changed";

  capture("vote_cast", {
    vote_type: options.voteType,
    station_name: options.stationName,
    hotel_name: options.hotelName,
    previous_vote: options.previous,
    new_vote: options.next,
    vote_action: action,
  });
}

const PWA_INSTALL_TRACKED_KEY = "pn_posthog_pwa_installed";

/** Fires once per browser profile when the PWA install prompt completes. */
export function trackPwaInstalled(): void {
  if (typeof sessionStorage !== "undefined") {
    if (sessionStorage.getItem(PWA_INSTALL_TRACKED_KEY) === "1") return;
    sessionStorage.setItem(PWA_INSTALL_TRACKED_KEY, "1");
  }
  capture("pwa_installed");
}
