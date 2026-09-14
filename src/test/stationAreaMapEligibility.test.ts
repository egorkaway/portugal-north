import { describe, expect, it } from "vitest";
import {
  shouldGenerateSpainExpandAreaMaps,
  SPAIN_EXPAND_AREA_MAP_RUN_PROBABILITY,
} from "../../scripts/lib/stationAreaMapEligibility.mjs";

describe("Spain expand area map run probability", () => {
  it("defaults to 10% of expand runs", () => {
    expect(SPAIN_EXPAND_AREA_MAP_RUN_PROBABILITY).toBe(0.1);
  });

  it("accepts an injected RNG so expand can skip most runs", () => {
    expect(shouldGenerateSpainExpandAreaMaps(0.1, () => 0.05)).toBe(true);
    expect(shouldGenerateSpainExpandAreaMaps(0.1, () => 0.5)).toBe(false);
  });
});
