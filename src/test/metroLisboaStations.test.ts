import { describe, expect, it } from "vitest";
import { metroLisboaStations } from "@/data/metroLisboaStations";
import { stations } from "@/data/stations";
import { getStationBySlug } from "@/lib/stationSlug";
import {
  getMetroOperatorLink,
  isLisboaMetroStation,
  METRO_LISBOA_URL,
} from "@/lib/metroStation";

describe("metroLisboaStations", () => {
  it("includes one terminus per main line (Azul, Amarela, Verde, Vermelha)", () => {
    expect(metroLisboaStations).toHaveLength(8);
    const lineTags = new Set(metroLisboaStations.flatMap((s) => s.lines));
    expect(lineTags.size).toBe(4);
    expect(metroLisboaStations.every((s) => s.types.includes("Metro"))).toBe(true);
  });

  it("is merged with unique slugs and operator link", () => {
    const aeroporto = getStationBySlug("aeroporto-metro-lisboa");
    expect(aeroporto?.name).toBe("Aeroporto (Metro Lisboa)");
    expect(isLisboaMetroStation(aeroporto!)).toBe(true);
    expect(getMetroOperatorLink(aeroporto!)).toEqual({
      url: METRO_LISBOA_URL,
      labelKey: "station.metroLisboa",
    });
  });

  it("keeps CP names separate from Metro stops", () => {
    expect(stations.find((s) => s.name === "Lisboa Santa Apolónia")?.types).not.toContain("Metro");
    expect(stations.find((s) => s.name === "Santa Apolónia (Metro)")?.types).toContain("Metro");
    expect(stations.find((s) => s.name === "Cais do Sodré")?.types).not.toContain("Metro");
    expect(stations.find((s) => s.name === "Cais do Sodré (Metro)")?.types).toContain("Metro");
  });
});
