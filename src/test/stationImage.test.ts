import { describe, expect, it } from "vitest";
import {
  getStationImageUrl,
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

  it("returns bundled placeholder for stations without a real photo", () => {
    expect(getStationImageUrl("São Pedro da Torre")).toBe(STATION_IMAGE_PLACEHOLDER);
    expect(hasRepresentativeStationImage("São Pedro da Torre")).toBe(false);
  });

  it("returns real photo URL when available", () => {
    expect(getStationImageUrl("Porto-Campanhã")).toContain("Campanh");
    expect(hasRepresentativeStationImage("Porto-Campanhã")).toBe(true);
  });
});
