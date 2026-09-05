import { describe, expect, it } from "vitest";
import {
  coverageFromExternalMapRows,
  externalSpotlightLimit,
  formatExternalAirportMapsLog,
  isOutsideIberianPeninsula,
  pickExternalAirportForRun,
  rankExternalAirportsFromManifest,
} from "@/lib/externalAirportSpotlight";

const hubs = new Set(["LIS", "MAD", "BCN", "OPO"]);

const coordinates = {
  LIS: { name: "Lisbon", country: "PT", lat: 38.78, lng: -9.13 },
  MAD: { name: "Madrid", country: "ES", lat: 40.47, lng: -3.56 },
  FRA: { name: "Frankfurt", country: "DE", lat: 50.03, lng: 8.54 },
  LHR: { name: "Heathrow", country: "GB", lat: 51.47, lng: -0.46 },
  PMI: { name: "Palma", country: "ES", lat: 39.55, lng: 2.74 },
  JFK: { name: "JFK", country: "US", lat: 40.64, lng: -73.78 },
};

describe("isOutsideIberianPeninsula", () => {
  it("excludes Iberian hubs and mainland PT/ES", () => {
    expect(isOutsideIberianPeninsula("LIS", coordinates.LIS, hubs)).toBe(false);
    expect(isOutsideIberianPeninsula("MAD", coordinates.MAD, hubs)).toBe(false);
  });

  it("includes European and other airports plus non-mainland Spain", () => {
    expect(isOutsideIberianPeninsula("FRA", coordinates.FRA, hubs)).toBe(true);
    expect(isOutsideIberianPeninsula("JFK", coordinates.JFK, hubs)).toBe(true);
    expect(isOutsideIberianPeninsula("PMI", coordinates.PMI, hubs)).toBe(true);
  });
});

describe("rankExternalAirportsFromManifest", () => {
  it("sums Iberian-hub flights and ignores peninsula hubs", () => {
    const ranked = rankExternalAirportsFromManifest(
      {
        fallbackAirports: {
          OPO: {
            iata: "OPO",
            connections: [{ iata: "FRA", flightCount: 2 }],
          },
        },
        airports: {
          LIS: {
            iata: "LIS",
            connections: [
              { iata: "FRA", flightCount: 10 },
              { iata: "MAD", flightCount: 40 },
              { iata: "LHR", flightCount: 4 },
            ],
          },
          MAD: {
            iata: "MAD",
            connections: [
              { iata: "FRA", flightCount: 5 },
              { iata: "LHR", flightCount: 3 },
            ],
          },
        },
      },
      hubs,
      coordinates,
    );

    expect(ranked.map((row) => row.iata)).toEqual(["FRA", "LHR"]);
    expect(ranked[0]).toMatchObject({ iata: "FRA", iberianFlightCount: 17, hubCount: 3 });
    expect(ranked[1]).toMatchObject({ iata: "LHR", iberianFlightCount: 7, hubCount: 2 });
  });
});

describe("externalSpotlightLimit", () => {
  it("treats all/Infinity as unbounded and defaults invalid counts to 1", () => {
    expect(externalSpotlightLimit(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
    expect(externalSpotlightLimit(3)).toBe(3);
    expect(externalSpotlightLimit(1.8)).toBe(1);
    expect(externalSpotlightLimit(0)).toBe(1);
    expect(externalSpotlightLimit(-2)).toBe(1);
    expect(externalSpotlightLimit(undefined)).toBe(1);
    expect(externalSpotlightLimit(null)).toBe(1);
  });
});

describe("coverageFromExternalMapRows", () => {
  it("allows an airport to keep both an Iberian map and an all-flights map", () => {
    expect(
      coverageFromExternalMapRows([
        {
          iata: "PMI",
          provider: "iberian-inbound",
          iberianMapImage: "/maps/airports/external/pmi-iberian-connections.png",
        },
        { iata: "FRA", provider: "aviationstack", mapImage: "/maps/airports/external/fra-connections.png" },
        {
          iata: "AMS",
          provider: "aviationstack",
          mapImage: "/maps/airports/external/ams-connections.png",
          iberianMapImage: "/maps/airports/external/ams-iberian-connections.png",
        },
      ]),
    ).toEqual({
      completeIatas: new Set(["FRA", "AMS"]),
      inboundIatas: new Set(["PMI", "AMS"]),
    });
  });
});

describe("formatExternalAirportMapsLog", () => {
  it("lists IATA codes in three disjoint groups with counts", () => {
    expect(
      formatExternalAirportMapsLog({
        airports: [
          {
            iata: "PMI",
            provider: "iberian-inbound",
            iberianMapImage: "/pmi-iberian.png",
          },
          {
            iata: "AMS",
            provider: "iberian-inbound",
            iberianMapImage: "/ams-iberian.png",
          },
          { iata: "FRA", provider: "aviationstack", mapImage: "/x.png" },
          {
            iata: "CDG",
            provider: "aviationstack",
            mapImage: "/cdg.png",
            iberianMapImage: "/cdg-iberian.png",
          },
        ],
      }),
    ).toBe(
      [
        "External destination maps (outside Iberian peninsula):",
        "  Iberian flights only: PMI AMS (2)",
        "  All flights only: FRA (1)",
        "  Both maps: CDG (1)",
      ].join("\n"),
    );
  });

  it("says none yet when the store is empty", () => {
    expect(formatExternalAirportMapsLog({ airports: [] })).toBe(
      "External destination maps (outside Iberian peninsula): none yet",
    );
  });
});

describe("pickExternalAirportForRun", () => {
  const ranked = [
    { iata: "FRA", iberianFlightCount: 17, hubCount: 3 },
    { iata: "LHR", iberianFlightCount: 7, hubCount: 2 },
  ];

  it("picks the busiest airport not yet mapped", () => {
    expect(pickExternalAirportForRun(ranked, new Set())?.iata).toBe("FRA");
    expect(pickExternalAirportForRun(ranked, new Set(["FRA"]))?.iata).toBe("LHR");
  });

  it("adds an all-flights map for an airport that already has an Iberian map when APIs are up", () => {
    expect(
      pickExternalAirportForRun(ranked, {
        completeIatas: new Set(),
        inboundIatas: new Set(["FRA"]),
      })?.iata,
    ).toBe("FRA");
    expect(
      pickExternalAirportForRun(ranked, {
        completeIatas: new Set(),
        inboundIatas: new Set(["LHR"]),
      })?.iata,
    ).toBe("LHR");
  });

  it("maps the next airport missing an Iberian map when APIs are down", () => {
    expect(
      pickExternalAirportForRun(
        ranked,
        {
          completeIatas: new Set(),
          inboundIatas: new Set(["FRA"]),
        },
        { flightApisAvailable: false },
      )?.iata,
    ).toBe("LHR");
    expect(
      pickExternalAirportForRun(
        ranked,
        {
          completeIatas: new Set(["FRA"]),
          inboundIatas: new Set(["LHR"]),
        },
        { flightApisAvailable: false },
      )?.iata,
    ).toBe("FRA");
    expect(
      pickExternalAirportForRun(
        ranked,
        {
          completeIatas: new Set(["FRA"]),
          inboundIatas: new Set(["FRA", "LHR"]),
        },
        { flightApisAvailable: false },
      ),
    ).toBeNull();
  });

  it("refreshes the current top once every candidate has a full map", () => {
    expect(pickExternalAirportForRun(ranked, new Set(["FRA", "LHR"]))?.iata).toBe("FRA");
    expect(
      pickExternalAirportForRun(ranked, {
        completeIatas: new Set(["FRA", "LHR"]),
        inboundIatas: new Set(),
      })?.iata,
    ).toBe("FRA");
  });
});
