import { describe, expect, it } from "vitest";
import { getCpStationCode } from "@/data/cpStationCodes";

describe("getCpStationCode", () => {
  it("maps Coimbra-B but not closed Coimbra (Ramal)", () => {
    expect(getCpStationCode("Coimbra-B")).toBe("94-36004");
    expect(getCpStationCode("Coimbra")).toBeUndefined();
  });

  it("skips inactive-only historic stations", () => {
    expect(getCpStationCode("Mirandela")).toBeUndefined();
    expect(getCpStationCode("Viseu")).toBeUndefined();
  });
});
