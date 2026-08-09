import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isAirLabsMonthlyLimitError,
  mapAirLabsScheduleToDeparture,
} from "../../server/lib/airLabsClient";
import {
  availableAirportFlightProviders,
  fetchDeparturesFromAirport,
  hasAirportFlightProvider,
  resetAirportFlightProvider,
} from "../../server/lib/airportFlightProvider";
import { iataToIcao, icaoToIata } from "../../server/lib/airportIcaoMap";
import {
  isOpenSkyQuotaError,
  mapOpenSkyFlightToDeparture,
} from "../../server/lib/openSkyClient";

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

describe("openSkyClient", () => {
  it("maps ICAO arrival airports into IATA departures", () => {
    expect(iataToIcao("LIS")).toBe("LPPT");
    expect(icaoToIata("LEMD")).toBe("MAD");
    expect(
      mapOpenSkyFlightToDeparture(
        {
          firstSeen: 1_700_000_000,
          estArrivalAirport: "LEMD",
          callsign: "TAP123  ",
        },
        "LIS",
      ),
    ).toMatchObject({
      departure: { iata: "LIS" },
      arrival: { iata: "MAD" },
      airline: { name: "TAP" },
      flight: { number: "TAP123" },
    });
    expect(
      mapOpenSkyFlightToDeparture({ estArrivalAirport: null, callsign: "TAP1" }, "LIS"),
    ).toBeNull();
  });

  it("detects OpenSky rate-limit errors", () => {
    expect(isOpenSkyQuotaError(new Error("opensky_http_429: rate limit"))).toBe(true);
    expect(isOpenSkyQuotaError(new Error("opensky_http_403: cannot access historical flights"))).toBe(
      true,
    );
  });
});

describe("airportFlightProvider", () => {
  afterEach(() => {
    resetAirportFlightProvider();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("always includes OpenSky even without paid keys", () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "");
    vi.stubEnv("AIRLABS_API_KEY", "");
    expect(hasAirportFlightProvider()).toBe(true);
    expect(availableAirportFlightProviders()).toEqual(["opensky"]);
  });

  it("reports available providers from env keys plus OpenSky", () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
    expect(hasAirportFlightProvider()).toBe(true);
    expect(availableAirportFlightProviders()).toEqual(["airlabs", "opensky"]);
  });

  it("falls back to AviationStack when AirLabs hits monthly limit", async () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "as_test");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
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

  it("falls back to OpenSky when both paid providers are exhausted", async () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "as_test");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
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
      if (url.includes("opensky-network.org/api/flights/departure")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify([
              {
                icao24: "abc",
                firstSeen: 1_700_000_000,
                estDepartureAirport: "LPPT",
                estArrivalAirport: "LEMD",
                callsign: "TAP456  ",
              },
            ]),
        };
      }
      throw new Error(`unexpected fetch: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const result = await fetchDeparturesFromAirport("LIS", 10);

    expect(result.provider).toBe("opensky");
    expect(result.flights).toHaveLength(1);
    expect(result.flights[0]?.arrival?.iata).toBe("MAD");
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
