import { describe, expect, it } from "vitest";
import { listPageStationsMissingImages } from "../../scripts/lib/ensureStationImages.mjs";
import { join } from "node:path";

const root = join(import.meta.dirname, "../..");

describe("ensure station images", () => {
  it("reports no missing photos for public pages in a healthy catalog", () => {
    const missing = listPageStationsMissingImages(root);
    expect(
      missing.map((station) => station.name),
      `public pages missing photos: ${missing.map((s) => s.name).join(", ")}`,
    ).toEqual([]);
  });
});
