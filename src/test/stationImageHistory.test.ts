import { describe, expect, it } from "vitest";
import {
  addRejectedUrl,
  allRejectedUrls,
  normalizeHistory,
  rejectedUrlsForStation,
} from "../../scripts/lib/stationImageHistory.mjs";
import {
  imageOccupationKeys,
  isImageUsed,
  markImageUsed,
  seedUsedImages,
} from "../../scripts/lib/stationImageFetch.mjs";

describe("stationImageHistory", () => {
  it("collects rejected urls from every station", () => {
    const history = normalizeHistory({
      "Leça do Balio": {
        rejectedUrls: [
          "https://images.pexels.com/photos/17252889/pexels-photo-17252889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        ],
        refreshes: [],
      },
      "Vila d'Este": {
        rejectedUrls: ["https://images.pexels.com/photos/1/pexels-photo-1.jpeg"],
        refreshes: [],
      },
    });

    const all = allRejectedUrls(history);
    expect(all.size).toBe(2);
    expect(rejectedUrlsForStation(history, "Leça do Balio").size).toBe(1);
    expect(all.has("https://images.pexels.com/photos/1/pexels-photo-1.jpeg")).toBe(true);
  });

  it("keeps rejected urls when adding another for the same station", () => {
    const history = {};
    addRejectedUrl(history, "Oiã", "https://example.com/a.jpg");
    addRejectedUrl(history, "Oiã", "https://example.com/b.jpg");
    addRejectedUrl(history, "Oiã", "https://example.com/a.jpg");
    expect(history["Oiã"].rejectedUrls).toEqual([
      "https://example.com/a.jpg",
      "https://example.com/b.jpg",
    ]);
  });
});

describe("image occupation keys", () => {
  it("treats pexels photo ids as occupied even with different query params", () => {
    const used = seedUsedImages([
      "https://images.pexels.com/photos/17252889/pexels-photo-17252889.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    ]);
    expect(imageOccupationKeys("https://images.pexels.com/photos/17252889/pexels-photo-17252889.jpeg")).toEqual([
      "https://images.pexels.com/photos/17252889/pexels-photo-17252889.jpeg",
      "pexels:17252889",
    ]);
    expect(
      isImageUsed(
        used,
        "https://images.pexels.com/photos/17252889/pexels-photo-17252889.jpeg?auto=compress&cs=tinysrgb&h=350&w=500",
      ),
    ).toBe(true);

    markImageUsed(used, "https://upload.wikimedia.org/wiki/foo.jpg");
    expect(isImageUsed(used, "https://upload.wikimedia.org/wiki/foo.jpg")).toBe(true);
  });

  it("treats Wikimedia query-param variants as the same photo", () => {
    const used = seedUsedImages([
      "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Linha_do_Norte_-_Bencanta.JPG/960px-Linha_do_Norte_-_Bencanta.JPG?utm_source=pt.wikipedia.org",
    ]);
    expect(
      isImageUsed(
        used,
        "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Linha_do_Norte_-_Bencanta.JPG/960px-Linha_do_Norte_-_Bencanta.JPG",
      ),
    ).toBe(true);
  });
});
