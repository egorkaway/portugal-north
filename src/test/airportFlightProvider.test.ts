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

describe("airportFlightProvider", () => {
  afterEach(() => {
    resetAirportFlightProvider();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("reports available providers from env keys", () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
    expect(hasAirportFlightProvider()).toBe(true);
    expect(availableAirportFlightProviders()).toEqual(["airlabs"]);
  });

  it("falls back to AirLabs when AviationStack hits monthly limit", async () => {
    vi.stubEnv("AVIATIONSTACK_API_KEY", "as_test");
    vi.stubEnv("AIRLABS_API_KEY", "al_test");
    vi.stubGlobal("AbortSignal", {
      ...AbortSignal,
      timeout: () => undefined,
    });

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("aviationstack.com")) {
        return {
          ok: true,
          json: async () => ({
            error: { message: "Your monthly usage limit has been reached." },
          }),
        };
      }
      if (url.includes("airlabs.co/api/v9/schedules")) {
        return {
          ok: true,
          json: async () => ({
            response: [
              {
                airline_iata: "TP",
                flight_iata: "TP456",
                flight_number: "456",
                dep_iata: "LIS",
                arr_iata: "MAD",
                dep_time: "2026-07-23 10:00",
                status: "scheduled",
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

    expect(result.provider).toBe("airlabs");
    expect(result.flights).toHaveLength(1);
    expect(result.flights[0]?.arrival?.iata).toBe("MAD");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
