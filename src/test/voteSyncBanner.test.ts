import { describe, expect, it } from "vitest";
import { shouldShowVoteSyncBanner } from "@/hooks/useVoteSyncBannerGiveUp";

describe("shouldShowVoteSyncBanner", () => {
  it("hides when the queue is empty", () => {
    expect(shouldShowVoteSyncBanner({ pending: 0, online: true, giveUp: false })).toBe(
      false,
    );
  });

  it("shows the offline pending message while offline", () => {
    expect(shouldShowVoteSyncBanner({ pending: 2, online: false, giveUp: false })).toBe(
      true,
    );
    expect(shouldShowVoteSyncBanner({ pending: 2, online: false, giveUp: true })).toBe(
      true,
    );
  });

  it("shows the online syncing banner until give-up", () => {
    expect(shouldShowVoteSyncBanner({ pending: 1, online: true, giveUp: false })).toBe(
      true,
    );
    expect(shouldShowVoteSyncBanner({ pending: 1, online: true, giveUp: true })).toBe(
      false,
    );
  });
});
