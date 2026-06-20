import { describe, expect, it } from "vitest";
import { getRatingsFallbackMessageKey } from "@/components/OfflineRatingsBanner";

describe("getRatingsFallbackMessageKey", () => {
  it("uses API-unavailable copy when online with cached ratings", () => {
    expect(getRatingsFallbackMessageKey("cache", true)).toBe("rankings.cachedFallback");
    expect(getRatingsFallbackMessageKey("device", true)).toBe("rankings.deviceFallback");
  });

  it("uses offline copy when the browser is offline", () => {
    expect(getRatingsFallbackMessageKey("cache", false)).toBe(
      "rankings.cachedFallbackOffline",
    );
    expect(getRatingsFallbackMessageKey("device", false)).toBe(
      "rankings.deviceFallbackOffline",
    );
  });

  it("returns null for live network ratings", () => {
    expect(getRatingsFallbackMessageKey("network", true)).toBeNull();
  });
});
