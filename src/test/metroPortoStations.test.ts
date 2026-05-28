import { describe, expect, it } from "vitest";
import { metroPortoStations } from "@/data/metroPortoStations";
import { stations } from "@/data/stations";
import { getStationBySlug } from "@/lib/stationSlug";
import { isMetroStation } from "@/lib/metroStation";

describe("metroPortoStations", () => {
  it("includes one terminus per Metro line A–F", () => {
    expect(metroPortoStations).toHaveLength(11);
    const lineTags = new Set(metroPortoStations.flatMap((s) => s.lines));
    expect(lineTags.size).toBe(6);
    expect(metroPortoStations.every((s) => s.types.includes("Metro"))).toBe(true);
  });

  it("is merged into the main station list with unique slugs", () => {
    expect(stations.some((s) => s.name === "Trindade (Metro)")).toBe(true);
    expect(getStationBySlug("trindade-metro")?.name).toBe("Trindade (Metro)");
    expect(isMetroStation(getStationBySlug("estadio-do-dragao")!)).toBe(true);
  });

  it("keeps CP Hospital São João separate from the Metro stop", () => {
    const cp = stations.find((s) => s.name === "Hospital São João");
    const metro = stations.find((s) => s.name === "Hospital São João (Metro)");
    expect(cp?.types).toContain("Urban");
    expect(metro?.types).toContain("Metro");
    expect(cp?.types).not.toContain("Metro");
  });
});
