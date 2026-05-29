import type { GlobalRatingsResult } from "./voteTypes";
import { APP_UPDATE_CHECK_INTERVAL_MS } from "@/lib/appUpdate";

const CACHE_KEY = "pn_global_ratings_v1";

type CachedPayload = Omit<GlobalRatingsResult, "source"> & { savedAt: number };

export function saveOfflineRatingsCache(
  data: Omit<GlobalRatingsResult, "source" | "savedAt">,
): void {
  if (typeof localStorage === "undefined") return;
  const payload: CachedPayload = { ...data, savedAt: Date.now() };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded — rankings cache is best-effort.
  }
}

export function loadOfflineRatingsCache(): GlobalRatingsResult | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (!parsed.ratings || !parsed.hotelRatings) return null;
    if (Date.now() - parsed.savedAt > APP_UPDATE_CHECK_INTERVAL_MS) return null;
    return {
      ratings: parsed.ratings,
      hotelRatings: parsed.hotelRatings,
      imageRatings: parsed.imageRatings ?? {},
      configured: parsed.configured ?? true,
      source: "cache",
      savedAt: parsed.savedAt,
    };
  } catch {
    return null;
  }
}
