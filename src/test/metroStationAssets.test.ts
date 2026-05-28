import { describe, expect, it } from "vitest";
import { metroPortoStations } from "@/data/metroPortoStations";
import { metroLisboaStations } from "@/data/metroLisboaStations";
import { metroStationHotels } from "@/data/metroStationAssets";
import {
  getStationImageUrl,
  hasRepresentativeStationImage,
} from "@/lib/stationImage";
import { getHotelsForStation } from "@/lib/stationHotels";

const metroNames = [...metroPortoStations, ...metroLisboaStations].map((s) => s.name);

describe("metro station assets", () => {
  it("has a representative image for every metro terminus", () => {
    const missing = metroNames.filter((name) => !hasRepresentativeStationImage(name));
    expect(missing, `missing images: ${missing.join(", ")}`).toEqual([]);
    for (const name of metroNames) {
      expect(getStationImageUrl(name)).not.toContain("station-placeholder");
    }
  });

  it("has at least three curated hotels per metro terminus", () => {
    for (const name of metroNames) {
      expect(metroStationHotels[name]?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(getHotelsForStation(name).length).toBeGreaterThanOrEqual(3);
    }
  });
});
