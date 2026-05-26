import { afterEach, describe, expect, it, vi } from "vitest";

const capture = vi.fn();

vi.mock("@/lib/posthog", () => ({
  isPostHogEnabled: true,
  posthog: { capture },
}));

describe("posthogEvents", () => {
  afterEach(() => {
    capture.mockClear();
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
    expect(capture).toHaveBeenCalledWith("station_viewed", {
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
    expect(capture).toHaveBeenCalledWith(
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
    expect(capture).toHaveBeenCalledTimes(1);
    expect(capture.mock.calls[0]?.[0]).toBe("pwa_installed");
  });
});
