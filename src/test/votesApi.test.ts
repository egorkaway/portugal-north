import { describe, expect, it, vi, afterEach } from "vitest";
import { fetchGlobalRatings, RatingsFetchError } from "@/lib/votesApi";

describe("fetchGlobalRatings", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("returns station and hotel ratings when storage is configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          configured: true,
          ratings: { "Porto Campanhã": { up: 3, down: 1 } },
          hotelRatings: {
            "Aveiro::Hotel das Salinas": { up: 2, down: 0 },
          },
          imageRatings: { Aveiro: { up: 5, down: 1 } },
        }),
      }),
    );

    const result = await fetchGlobalRatings();
    expect(result.ratings["Porto Campanhã"]).toEqual({ up: 3, down: 1 });
    expect(result.hotelRatings["Aveiro::Hotel das Salinas"]).toEqual({ up: 2, down: 0 });
    expect(result.imageRatings.Aveiro).toEqual({ up: 5, down: 1 });
  });

  it("throws when storage is not configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ configured: false, ratings: {}, hotelRatings: {} }),
      }),
    );

    await expect(fetchGlobalRatings()).rejects.toMatchObject({
      code: "storage_not_configured",
    });
  });

  it("throws on non-retryable HTTP errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(fetchGlobalRatings()).rejects.toBeInstanceOf(RatingsFetchError);
  });

  it("falls back to cache on server errors when cache exists", async () => {
    const { saveOfflineRatingsCache } = await import("@/lib/offlineRatingsCache");
    saveOfflineRatingsCache({
      ratings: { Aveiro: { up: 1, down: 0 } },
      hotelRatings: {},
      imageRatings: {},
      configured: true,
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    const result = await fetchGlobalRatings();
    expect(result.source).toBe("cache");
    expect(result.ratings.Aveiro).toEqual({ up: 1, down: 0 });
  });
});
