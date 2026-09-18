import { describe, expect, it } from "vitest";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  IBERIAN_CATALOG_CAP,
  IBERIAN_CATALOG_CAP_PREVIOUS,
  countIberianCatalog,
  iberianCatalogSlotsRemaining,
} from "../../scripts/lib/iberianCatalogCap.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("iberian catalog cap", () => {
  it("targets 1411 with headroom above the previous freeze", () => {
    expect(IBERIAN_CATALOG_CAP).toBe(1411);
    expect(IBERIAN_CATALOG_CAP_PREVIOUS).toBe(1404);
    expect(IBERIAN_CATALOG_CAP).toBeGreaterThan(IBERIAN_CATALOG_CAP_PREVIOUS);
  });

  it("counts PT/ES catalog entries and reports remaining slots", () => {
    const count = countIberianCatalog(root);
    expect(count).toBe(IBERIAN_CATALOG_CAP_PREVIOUS);
    expect(iberianCatalogSlotsRemaining(root)).toBe(
      IBERIAN_CATALOG_CAP - IBERIAN_CATALOG_CAP_PREVIOUS,
    );
    expect(iberianCatalogSlotsRemaining(root, count)).toBe(0);
  });
});
