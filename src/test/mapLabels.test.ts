import { describe, expect, it } from "vitest";
import { stations } from "@/data/stations";
import { buildMapLabelPoints } from "@/lib/mapLabels";

describe("buildMapLabelPoints", () => {
  const airportLabels = {
    LIS: "Lisbon Humberto Delgado",
    OPO: "Porto Francisco Sá Carneiro",
    FAO: "Faro",
  } as const;

  it("includes all airports and the featured stations", () => {
    const points = buildMapLabelPoints(stations, airportLabels);

    expect(points.filter((point) => point.kind === "airport")).toHaveLength(3);
    expect(points.filter((point) => point.kind === "station")).toHaveLength(5);
    expect(points.map((point) => point.label)).toEqual(
      expect.arrayContaining([
        "Lisbon Humberto Delgado (LIS)",
        "Porto Francisco Sá Carneiro (OPO)",
        "Faro (FAO)",
        "Faro",
        "Porto-Campanhã",
        "Viana do Castelo",
        "Coimbra-B",
        "Lisboa Santa Apolónia",
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

  it("requires closer zoom for Lisbon airport than Porto", () => {
    const points = buildMapLabelPoints(stations, airportLabels);
    expect(points.find((point) => point.id === "airport-LIS")?.minZoomToShow).toBe(7);
    expect(points.find((point) => point.id === "airport-OPO")?.minZoomToShow).toBeUndefined();
  });
});
