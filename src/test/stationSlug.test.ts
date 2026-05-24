import { describe, expect, it } from "vitest";
import { getStationBySlug, stationToSlug } from "@/lib/stationSlug";

describe("stationSlug", () => {
  it("maps slug to station", () => {
    expect(getStationBySlug("porto-campanha")?.name).toBe("Porto-Campanhã");
    expect(getStationBySlug("sao-bento-porto")?.name).toBe("São Bento (Porto)");
  });

  it("slugifies names consistently", () => {
    expect(stationToSlug("São Bento (Porto)")).toBe("sao-bento-porto");
    expect(stationToSlug("Vila Nova de Gaia-Devesas")).toBe("vila-nova-de-gaia-devesas");
  });
});
