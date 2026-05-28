import { describe, expect, it } from "vitest";
import { getTrainTypeAbbrev, sortTrainTypes } from "@/lib/trainTypes";

describe("getTrainTypeAbbrev", () => {
  it("maps known CP service types", () => {
    expect(getTrainTypeAbbrev("Alfa Pendular")).toBe("AP");
    expect(getTrainTypeAbbrev("Intercidades")).toBe("IC");
    expect(getTrainTypeAbbrev("Regional")).toBe("R");
    expect(getTrainTypeAbbrev("Urban")).toBe("U");
    expect(getTrainTypeAbbrev("Metro")).toBe("Metro");
    expect(getTrainTypeAbbrev("Inactive / Historic")).toBe("Historic");
  });

  it("falls back to the original string", () => {
    expect(getTrainTypeAbbrev("Unknown")).toBe("Unknown");
  });
});

describe("sortTrainTypes", () => {
  it("orders filters AP → IC → R → U → Historic", () => {
    expect(
      sortTrainTypes([
        "Inactive / Historic",
        "Metro",
        "Urban",
        "Regional",
        "Alfa Pendular",
        "Intercidades",
      ]),
    ).toEqual([
      "Alfa Pendular",
      "Intercidades",
      "Regional",
      "Urban",
      "Metro",
      "Inactive / Historic",
    ]);
  });
});
