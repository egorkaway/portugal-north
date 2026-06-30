import { describe, expect, it } from "vitest";
import {
  getStaleStationImageVote,
  getStationImageVoteForUrl,
  normalizeStationImageUrl,
  setStationImageVoteForUrl,
} from "@/lib/stationImageVoteStorage";

const IMAGE_A = "https://images.pexels.com/photos/1/pexels-photo-1.jpeg?w=940";
const IMAGE_B = "https://images.pexels.com/photos/2/pexels-photo-2.jpeg?w=940";

describe("stationImageVoteStorage", () => {
  it("normalizes image URLs without query params", () => {
    expect(normalizeStationImageUrl(IMAGE_A)).toBe(
      "https://images.pexels.com/photos/1/pexels-photo-1.jpeg",
    );
  });

  it("returns a vote only when it matches the current image URL", () => {
    const votes = {
      Oiã: { vote: "down" as const, imageUrl: normalizeStationImageUrl(IMAGE_A) },
    };

    expect(getStationImageVoteForUrl(votes, "Oiã", IMAGE_A)).toBe("down");
    expect(getStationImageVoteForUrl(votes, "Oiã", IMAGE_B)).toBeNull();
  });

  it("treats legacy cookie votes as stale for the current image", () => {
    const votes = { Oiã: "down" as const };
    expect(getStationImageVoteForUrl(votes, "Oiã", IMAGE_A)).toBeNull();
    expect(getStaleStationImageVote(votes, "Oiã", IMAGE_A)).toBe("down");
  });

  it("stores votes with the normalized image URL", () => {
    setStationImageVoteForUrl("Oiã", IMAGE_A, "up");
    const votes = { Oiã: { vote: "up" as const, imageUrl: normalizeStationImageUrl(IMAGE_A) } };
    expect(getStationImageVoteForUrl(votes, "Oiã", IMAGE_A)).toBe("up");
  });
});
