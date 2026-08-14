import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isAirLabsMonthlyLimitError,
  mapAirLabsScheduleToDeparture,
} from "../../server/lib/airLabsClient";
import {
  isAeroDataBoxMonthlyLimitError,
  mapAeroDataBoxFlightToDeparture,
} from "../../server/lib/aeroDataBoxClient";
import {
  availableAirportFlightProviders,
  fetchDeparturesFromAirport,
  hasAirportFlightProvider,
  resetAirportFlightProvider,
} from "../../server/lib/airportFlightProvider";

describe("airLabsClient", () => {
  it("maps schedules into the shared departure shape", () => {
    expect(
      mapAirLabsScheduleToDeparture({
        airline_iata: "TP",
        flight_iata: "TP123",
        flight_number: "123",
        dep_iata: "LIS",
        arr_iata: "OPO",
        dep_time: "2026-07-23 18:40",
        status: "scheduled",
      }),
    ).toEqual({
      flight_date: "2026-07-23",
      flight_status: "scheduled",
      departure: { iata: "LIS" },
      arrival: { iata: "OPO" },
      airline: { name: "TP", iata: "TP" },
      flight: { number: "123", iata: "TP123" },
    });
  });

  it("detects AirLabs monthly quota errors", () => {
    expect(isAirLabsMonthlyLimitError(new Error("month_limit_exceeded: too many"))).toBe(true);
    expect(isAirLabsMonthlyLimitError(new Error("minute_limit_exceeded"))).toBe(false);
  });
});

describe("aeroDataBoxClient", () => {
  it("maps FIDS departures into the shared departure shape", () => {
    expect(
      mapAeroDataBoxFlightToDeparture(
        {
          number: "FR 7936",
          status: "Departed",
          departure: { scheduledTime: { utc: "2026-08-13 18:10Z" } },
          arrival: {
            airport: { icao: "EDDN", iata: "NUE", name: "Nuremberg" },
          },
          airline: { name: "Ryanair", iata: "FR", icao: "RYR" },
        },
        "OPO",
      ),
    ).toEqual({
      flight_date: "2026-08-13",
      flight_status: "Departed",
      departure: { iata: "OPO" },
      arrival: { iata: "NUE", airport: "Nuremberg" },
      airline: { name: "Ryanair", iata: "FR" },
      flight: { number: "7936", iata: "FR7936" },
    });
  });

  it("skips cargo and missing arrival IATA", () => {
    expect(
      mapAeroDataBoxFlightToDeparture(
        { isCargo: true, arrival: { airport: { iata: "MAD" } } },
        "OPO",
      ),
    ).toBeNull();
    expect(mapAeroDataBoxFlightToDeparture({ arrival: { airport: {} } }, "OPO")).toBeNull();
  });

  it("detects AeroDataBox monthly quota errors", () => {
    expect(
      isAeroDataBoxMonthlyLimitError(new Error("You have exceeded your MONTHLY quota")),
    ).toBe(true);
    expect(
      isAeroDataBoxMonthlyLimitError(
        new Error("You have exceeded the rate limit per second for your plan"),
      ),
    ).toBe(false);
  });
});

describe("airportFlightProvider", () => {
  afterEach(() => {
    resetAirportFlightProvider();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("requires at least one configured flight API key", () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "");
    vi.stubEnv("AIRLABS_API_KEY", "");
    vi.stubEnv("AERODATABOX_RAPIDAPI_KEY", "");
    expect(hasAirportFlightProvider()).toBe(false);
    expect(availableAirportFlightProviders()).toEqual([]);
  });

  it("reports available providers from env keys", () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
    vi.stubEnv("AERODATABOX_RAPIDAPI_KEY", "adb_test");
    expect(hasAirportFlightProvider()).toBe(true);
    expect(availableAirportFlightProviders()).toEqual(["airlabs", "aerodatabox"]);
  });

  it("falls back to AviationStack when AirLabs hits monthly limit", async () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "as_test");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
    vi.stubEnv("AERODATABOX_RAPIDAPI_KEY", "");
    vi.stubGlobal("AbortSignal", {
      ...AbortSignal,
      timeout: () => undefined,
    });

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("airlabs.co")) {
        return {
          ok: true,
          json: async () => ({
            error: {
              code: "month_limit_exceeded",
              message: "The monthly request limit has been exceeded.",
            },
          }),
        };
      }
      if (url.includes("aviationstack.com")) {
        return {
          ok: true,
          json: async () => ({
            data: [
              {
                flight_date: "2026-07-23",
                departure: { iata: "LIS" },
                arrival: { iata: "MAD" },
                airline: { name: "TAP", iata: "TP" },
                flight: { number: "456", iata: "TP456" },
              },
            ],
          }),
        };
      }
      throw new Error(`unexpected fetch: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await fetchDeparturesFromAirport("LIS", 10);
    warn.mockRestore();

    expect(result.provider).toBe("aviationstack");
    expect(result.flights).toHaveLength(1);
    expect(result.flights[0]?.arrival?.iata).toBe("MAD");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back to AeroDataBox when both paid providers are exhausted", async () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "as_test");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
    vi.stubEnv("AERODATABOX_RAPIDAPI_KEY", "adb_test");
    vi.stubGlobal("AbortSignal", {
      ...AbortSignal,
      timeout: () => undefined,
    });

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("airlabs.co")) {
        return {
          ok: true,
          json: async () => ({
            error: {
              code: "month_limit_exceeded",
              message: "The monthly request limit has been exceeded.",
            },
          }),
        };
      }
      if (url.includes("aviationstack.com")) {
        return {
          ok: true,
          json: async () => ({
            error: { message: "Your monthly usage limit has been reached." },
          }),
        };
      }
      if (url.includes("aerodatabox.p.rapidapi.com/flights/airports")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({
              departures: [
                {
                  number: "TP 456",
                  status: "Scheduled",
                  departure: { scheduledTime: { utc: "2026-07-23 10:00Z" } },
                  arrival: { airport: { iata: "MAD", name: "Madrid" } },
                  airline: { name: "TAP", iata: "TP" },
                },
              ],
            }),
        };
      }
      throw new Error(`unexpected fetch: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await fetchDeparturesFromAirport("LIS", 10);

    expect(result.provider).toBe("aerodatabox");
    expect(result.flights).toHaveLength(1);
    expect(result.flights[0]?.arrival?.iata).toBe("MAD");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
