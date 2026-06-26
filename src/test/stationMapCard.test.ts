import { describe, expect, it } from "vitest";
import { pickZoom } from "../../scripts/lib/stationMapCard.mjs";

describe("stationMapCard pickZoom", () => {
  it("zooms out 3 steps for the busiest train stations", () => {
    expect(pickZoom({ name: "Agualva - Cacém", lines: ["Sintra Line"], lat: 0, lng: 0 })).toBe(13);
    expect(pickZoom({ name: "Lisboa Oriente", lines: ["Norte Line"], lat: 0, lng: 0 })).toBe(13);
    expect(pickZoom({ name: "Portela de Sintra", lines: ["Sintra Line"], lat: 0, lng: 0 })).toBe(13);
  });

  it("zooms out 2 steps for airport stations", () => {
    expect(
      pickZoom({ name: "Lisbon Airport (LIS)", lines: ["Airport"], lat: 0, lng: 0 }),
    ).toBe(14);
    expect(
      pickZoom({ name: "Aeroporto (Metro Lisboa)", lines: ["Metro Lisboa"], lat: 0, lng: 0 }),
    ).toBe(15);
  });

  it("keeps the default close zoom for regular stations", () => {
    expect(pickZoom({ name: "Pombal", lines: ["Norte Line"], lat: 0, lng: 0 })).toBe(16);
    expect(
      pickZoom({ name: "Campanhã (Metro Porto)", lines: ["Metro do Porto"], lat: 0, lng: 0 }),
    ).toBe(17);
  });
});
