import { describe, expect, it } from "vitest";
import {
  isPlaceholderImageUrl,
  pickTagline,
  stationToSlug,
  TAGLINES,
} from "../../scripts/lib/socialCard.mjs";

describe("socialCard helpers", () => {
  it("slugifies station names", () => {
    expect(stationToSlug("Coimbra-B")).toBe("coimbra-b");
    expect(stationToSlug("Aeroporto (Metro Lisboa)")).toBe("aeroporto-metro-lisboa");
  });

  it("detects placeholder images", () => {
    expect(isPlaceholderImageUrl("/station-placeholder.svg")).toBe(true);
    expect(
      isPlaceholderImageUrl(
        "https://upload.wikimedia.org/wikipedia/commons/Comboios_de_Portugal_logo.svg",
      ),
    ).toBe(true);
    expect(isPlaceholderImageUrl("https://images.pexels.com/photos/1.jpeg")).toBe(false);
  });

  it("picks a stable tagline", () => {
    const first = pickTagline("Aveiro");
    expect(TAGLINES).toContain(first);
    expect(pickTagline("Aveiro")).toBe(first);
  });
});
