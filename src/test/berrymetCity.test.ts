import { describe, expect, it } from "vitest";
import { stations } from "@/data/stations";
import { allStations } from "@/data/stationRegistry";
import {
  berrymetCitySlug,
  getBerrymetCityLink,
} from "@/lib/berrymetCity";

describe("berrymetCitySlug", () => {
  it("normalizes accents and spaces", () => {
    expect(berrymetCitySlug("Viana do Castelo")).toBe("viana-do-castelo");
    expect(berrymetCitySlug("São Sebastián")).toBe("sao-sebastian");
    expect(berrymetCitySlug("A Coruña")).toBe("a-coruna");
  });
});

describe("getBerrymetCityLink", () => {
  it("links Vigo-area stations to Vigo", () => {
    const link = getBerrymetCityLink(allStations.find((s) => s.name === "Vigo-Guixar")!);
    expect(link?.cityName).toBe("Vigo");
    expect(link?.href).toBe("https://berrymet.com/l/vigo");
  });

  it("links Lisbon-area stations to Lisboa", () => {
    const link = getBerrymetCityLink(stations.find((s) => s.name === "Lisboa Oriente")!);
    expect(link?.cityName).toBe("Lisboa");
    expect(link?.href).toBe("https://berrymet.com/l/lisboa");
  });

  it("links Valença via override to Viana do Castelo", () => {
    const link = getBerrymetCityLink(stations.find((s) => s.name === "Valença")!);
    expect(link?.cityName).toBe("Viana do Castelo");
    expect(link?.href).toBe("https://berrymet.com/l/viana-do-castelo");
  });

  it("returns null when no berrymet city is close enough", () => {
    const link = getBerrymetCityLink({
      name: "Remote Stop",
      country: "pt",
      lat: 39.2,
      lng: -7.8,
    });
    expect(link).toBeNull();
  });
});
