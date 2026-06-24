import { describe, expect, it } from "vitest";
import { stations } from "@/data/stations";
import { buildMapLabelPoints } from "@/lib/mapLabels";

describe("buildMapLabelPoints", () => {
  const airportLabels = {
    LIS: "Lisbon Humberto Delgado",
    OPO: "Porto Francisco Sá Carneiro",
    FAO: "Faro",
    MAD: "Madrid-Barajas",
    BCN: "Barcelona-El Prat",
    AGP: "Málaga-Costa del Sol",
    ALC: "Alicante-Elche",
    VLC: "Valencia",
    SVQ: "Seville",
    BIO: "Bilbao",
    SCQ: "Santiago",
    VGO: "Vigo",
    OVD: "Asturias",
  };

  it("includes Portuguese and major Spanish airports plus featured stations", () => {
    const points = buildMapLabelPoints(stations, airportLabels);

    expect(points.filter((point) => point.kind === "airport")).toHaveLength(13);
    expect(points.filter((point) => point.kind === "station")).toHaveLength(5);
    expect(points.map((point) => point.label)).toEqual(
      expect.arrayContaining([
        "Lisbon Humberto Delgado (LIS)",
        "Porto Francisco Sá Carneiro (OPO)",
        "Faro (FAO)",
        "Madrid-Barajas (MAD)",
        "Barcelona-El Prat (BCN)",
        "Málaga-Costa del Sol (AGP)",
        "Faro",
        "Porto-Campanhã",
      ]),
    );
  });

  it("uses permanent label offsets for Faro airport and station", () => {
    const points = buildMapLabelPoints(stations, airportLabels);
    const faroAirport = points.find((point) => point.id === "airport-FAO");
    const faroStation = points.find((point) => point.id === "station-Faro");

    expect(faroAirport?.direction).toBe("top");
    expect(faroAirport?.minZoomToShow).toBe(7);
    expect(faroStation?.direction).toBe("bottom");
    expect(faroStation?.minZoomToShow).toBeUndefined();
  });

  it("requires closer zoom for Lisbon and Barcelona airports than Porto", () => {
    const points = buildMapLabelPoints(stations, airportLabels);
    expect(points.find((point) => point.id === "airport-LIS")?.minZoomToShow).toBe(7);
    expect(points.find((point) => point.id === "airport-BCN")?.minZoomToShow).toBe(7);
    expect(points.find((point) => point.id === "airport-OPO")?.minZoomToShow).toBeUndefined();
  });
});
