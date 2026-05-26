import { afterEach, describe, expect, it, vi } from "vitest";

const capturePostHog = vi.fn();

vi.mock("@/lib/posthog", () => ({
  isPostHogEnabled: true,
  capturePostHog,
}));

describe("posthogEvents", () => {
  afterEach(() => {
    capturePostHog.mockClear();
    sessionStorage.clear();
  });

  it("tracks station views", async () => {
    const { trackStationViewed } = await import("@/lib/posthogEvents");
    trackStationViewed({
      stationName: "Aveiro",
      slug: "aveiro",
      hotelCount: 2,
      lineCount: 1,
    });
    expect(capturePostHog).toHaveBeenCalledWith("station_viewed", {
      station_name: "Aveiro",
      station_slug: "aveiro",
      hotel_count: 2,
      line_count: 1,
    });
  });

  it("tracks vote casts", async () => {
    const { trackVoteCast } = await import("@/lib/posthogEvents");
    trackVoteCast({
      voteType: "hotel",
      stationName: "Aveiro",
      hotelName: "Hotel das Salinas",
      previous: null,
      next: "up",
    });
    expect(capturePostHog).toHaveBeenCalledWith(
      "vote_cast",
      expect.objectContaining({
        vote_type: "hotel",
        station_name: "Aveiro",
        hotel_name: "Hotel das Salinas",
        new_vote: "up",
        vote_action: "set",
      }),
    );
  });

  it("dedupes pwa_installed per session", async () => {
    const { trackPwaInstalled } = await import("@/lib/posthogEvents");
    trackPwaInstalled();
    trackPwaInstalled();
    expect(capturePostHog).toHaveBeenCalledTimes(1);
    expect(capturePostHog.mock.calls[0]?.[0]).toBe("pwa_installed");
  });
});
