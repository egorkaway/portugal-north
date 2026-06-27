import { describe, expect, it } from "vitest";
import { stations } from "@/data/stations";
import { allStations } from "@/data/stationRegistry";
import { getBerrymetCityLink } from "@/lib/berrymetCity";

describe("getBerrymetCityLink", () => {
  it("links Vigo-area stations to published Vigo page", () => {
    const link = getBerrymetCityLink(allStations.find((s) => s.name === "Vigo-Guixar")!);
    expect(link?.cityName).toBe("Vigo");
    expect(link?.href).toBe("https://berrymet.com/g/30");
  });

  it("links Lisbon-area stations to published Lisboa page", () => {
    const link = getBerrymetCityLink(stations.find((s) => s.name === "Lisboa Oriente")!);
    expect(link?.cityName).toBe("Lisboa");
    expect(link?.href).toBe("https://berrymet.com/g/43");
  });

  it("does not link Senhora da Agonia to unpublished Viana do Castelo", () => {
    const link = getBerrymetCityLink(stations.find((s) => s.name === "Senhora da Agonia")!);
    expect(link?.href).not.toBe("https://berrymet.com/l/viana-do-castelo");
    expect(link?.cityName).not.toBe("Viana do Castelo");
  });

  it("returns null for Valença when no published city is within range", () => {
    const link = getBerrymetCityLink(stations.find((s) => s.name === "Valença")!);
    expect(link).toBeNull();
  });

  it("returns null when no published berrymet city is close enough", () => {
    const link = getBerrymetCityLink({
      name: "Remote Stop",
      country: "pt",
      lat: 39.2,
      lng: -7.8,
    });
    expect(link).toBeNull();
  });
});
