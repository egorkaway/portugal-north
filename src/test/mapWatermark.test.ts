import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CARTO_WATERMARK_SCORE_THRESHOLD,
  cartoWatermarkScore,
  pngHasCartoApiKeyWatermark,
} from "../../scripts/lib/mapWatermark.mjs";

const root = join(import.meta.dirname, "../..");
const ferrol = join(root, "public/maps/stations/ferrol.png");
const aveiro = join(root, "public/maps/stations/aveiro.png");

describe("carto watermark detection", () => {
  it("flags a Positron station map with the overlay", async () => {
    if (!existsSync(ferrol)) return;
    expect(await cartoWatermarkScore(ferrol)).toBeGreaterThan(CARTO_WATERMARK_SCORE_THRESHOLD);
    expect(await pngHasCartoApiKeyWatermark(ferrol)).toBe(true);
  });

  it("does not flag a clean OSM station map", async () => {
    if (!existsSync(aveiro)) return;
    expect(await cartoWatermarkScore(aveiro)).toBeLessThan(CARTO_WATERMARK_SCORE_THRESHOLD);
    expect(await pngHasCartoApiKeyWatermark(aveiro)).toBe(false);
  });
});
