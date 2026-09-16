import { describe, expect, it } from "vitest";
import {
  CAMINO_APP_STORE_URL,
  CAMINO_PLAY_STORE_URL,
  caminoStoreUrl,
  isAndroidUserAgent,
} from "@/lib/caminoStore";

describe("caminoStore", () => {
  it("detects Android user agents", () => {
    expect(
      isAndroidUserAgent(
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36",
      ),
    ).toBe(true);
    expect(
      isAndroidUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      ),
    ).toBe(false);
  });

  it("returns Play Store URL for Android", () => {
    expect(caminoStoreUrl("Mozilla/5.0 (Linux; Android 14)")).toBe(
      CAMINO_PLAY_STORE_URL,
    );
  });

  it("returns App Store URL for iOS and desktop", () => {
    expect(caminoStoreUrl("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)")).toBe(
      CAMINO_APP_STORE_URL,
    );
    expect(caminoStoreUrl("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe(
      CAMINO_APP_STORE_URL,
    );
  });
});
