import { describe, expect, it } from "vitest";
import {
  mergeStationTypes,
  stationTypesFromDepartureStats,
} from "@/lib/cpTrainTypeMapping";

describe("stationTypesFromDepartureStats", () => {
  it("maps InterRegional to Intercidades for Minho-line stats", () => {
    expect(
      stationTypesFromDepartureStats({
        Regional: { departuresNextHour: 12, arrivalsNextHour: 12 },
        InterRegional: { departuresNextHour: 9, arrivalsNextHour: 10 },
      }),
    ).toEqual(["Intercidades", "Regional"]);
  });

  it("includes explicit Intercidades when CP reports both IR and IC", () => {
    expect(
      stationTypesFromDepartureStats({
        Regional: { departuresNextHour: 9, arrivalsNextHour: 7 },
        InterRegional: { departuresNextHour: 12, arrivalsNextHour: 12 },
        Intercidades: { departuresNextHour: 2, arrivalsNextHour: 2 },
      }),
    ).toEqual(["Intercidades", "Regional"]);
  });

  it("ignores service types with zero observed activity", () => {
    expect(
      stationTypesFromDepartureStats({
        Regional: { departuresNextHour: 0, arrivalsNextHour: 0 },
        Intercidades: { departuresNextHour: 3, arrivalsNextHour: 2 },
      }),
    ).toEqual(["Intercidades"]);
  });
});

describe("mergeStationTypes", () => {
  it("adds stats types without removing existing ones", () => {
    expect(mergeStationTypes(["Regional", "Inactive / Historic"], ["Intercidades", "Urban"])).toEqual([
      "Intercidades",
      "Regional",
      "Urban",
      "Inactive / Historic",
    ]);
  });
});
