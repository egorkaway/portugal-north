import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchGlobalRatings, RatingsFetchError } from "@/lib/votesApi";

describe("fetchGlobalRatings", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns ratings when storage is configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          configured: true,
          ratings: { "Porto Campanhã": { up: 3, down: 1 } },
        }),
      }),
    );

    const result = await fetchGlobalRatings();
    expect(result.ratings["Porto Campanhã"]).toEqual({ up: 3, down: 1 });
  });

  it("throws when storage is not configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ configured: false, ratings: {} }),
      }),
    );

    await expect(fetchGlobalRatings()).rejects.toMatchObject({
      code: "storage_not_configured",
    });
  });

  it("throws on HTTP errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchGlobalRatings()).rejects.toBeInstanceOf(RatingsFetchError);
  });
});
