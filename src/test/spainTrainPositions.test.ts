import { describe, expect, it } from "vitest";
import { mergeSpainTrainFeeds, parseGtfsRtVehicles } from "@/lib/spainTrainPositions";

const madridCercanias = {
  entity: [
    {
      id: "VP_C2-23071",
      vehicle: {
        position: { latitude: 40.4, longitude: -3.7 },
        currentStatus: "IN_TRANSIT_TO",
        vehicle: { id: "23071", label: "C2-23071" },
      },
    },
  ],
};

const outsideIberia = {
  entity: [
    {
      id: "VP_SKIP",
      vehicle: {
        position: { latitude: 48.86, longitude: 2.35 },
        vehicle: { label: "C1-1" },
      },
    },
  ],
};

describe("spainTrainPositions", () => {
  it("parses Cercanías vehicles inside Iberian bounds", () => {
    const trains = parseGtfsRtVehicles(madridCercanias, "cercanias");
    expect(trains).toEqual([
      {
        id: "cercanias:VP_C2-23071",
        lat: 40.4,
        lng: -3.7,
        label: "C2-23071",
        line: "C2",
        kind: "cercanias",
        status: "IN_TRANSIT_TO",
      },
    ]);
  });

  it("drops vehicles outside the Iberian map bounds", () => {
    expect(parseGtfsRtVehicles(outsideIberia, "cercanias")).toEqual([]);
  });

  it("merges Cercanías and long-distance feeds", () => {
    const trains = mergeSpainTrainFeeds({
      cercanias: madridCercanias,
      longDistance: {
        entity: [
          {
            id: "VP_04176",
            vehicle: {
              position: { latitude: 41.4, longitude: 2.17 },
              vehicle: { id: "04176", label: "04176" },
            },
          },
        ],
      },
    });

    expect(trains.map((train) => train.kind).sort()).toEqual(["cercanias", "longDistance"]);
  });
});
