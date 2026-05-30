import { describe, expect, it } from "vitest";
import {
  getStationImageUrl,
  getStationImageReloadUrl,
  hasRepresentativeStationImage,
  isPlaceholderImageUrl,
  STATION_IMAGE_PLACEHOLDER,
} from "@/lib/stationImage";

describe("stationImage", () => {
  it("treats CP logo URLs as placeholders", () => {
    expect(
      isPlaceholderImageUrl(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Comboios_de_Portugal_logo.svg/320px-Comboios_de_Portugal_logo.svg.png",
      ),
    ).toBe(true);
  });

  it("returns bundled placeholder when no image is mapped", () => {
    expect(getStationImageUrl("Nonexistent Station XYZ")).toBe(STATION_IMAGE_PLACEHOLDER);
    expect(hasRepresentativeStationImage("Nonexistent Station XYZ")).toBe(false);
  });

  it("treats Pexels photos as representative", () => {
    expect(getStationImageUrl("São Pedro da Torre")).toContain("pexels.com");
    expect(hasRepresentativeStationImage("São Pedro da Torre")).toBe(true);
  });

  it("returns real photo URL when available", () => {
    expect(getStationImageUrl("Porto-Campanhã")).toContain("Campanh");
    expect(hasRepresentativeStationImage("Porto-Campanhã")).toBe(true);
  });

  it("adds a cache-bust query param for reload", () => {
    expect(getStationImageReloadUrl("https://example.com/a.jpg")).toBe(
      "https://example.com/a.jpg?_r=1",
    );
    expect(getStationImageReloadUrl("https://example.com/a.jpg?w=940")).toBe(
      "https://example.com/a.jpg?w=940&_r=1",
    );
  });
});
