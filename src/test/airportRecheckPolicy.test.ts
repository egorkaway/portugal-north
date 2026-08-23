import { describe, expect, it } from "vitest";
import {
  AIRPORT_RECHECK_MIN_INTERVAL_MS,
  shouldRecheckAirportDestinations,
} from "../../scripts/lib/airportRecheckPolicy.mjs";

describe("shouldRecheckAirportDestinations", () => {
  const now = new Date("2026-07-27T12:00:00.000Z");

  it("rechecks when there is no previous airport check", () => {
    expect(shouldRecheckAirportDestinations(null, now)).toBe(true);
    expect(shouldRecheckAirportDestinations(undefined, now)).toBe(true);
  });

  it("skips when last airport check was under 5 hours ago", () => {
    expect(shouldRecheckAirportDestinations("2026-07-27T08:00:01.000Z", now)).toBe(false);
    expect(shouldRecheckAirportDestinations("2026-07-27T07:00:01.000Z", now)).toBe(false);
  });

  it("rechecks at or after the 5 hour mark", () => {
    const exactlyThreeHoursAgo = new Date(now.getTime() - AIRPORT_RECHECK_MIN_INTERVAL_MS).toISOString();
    const justOver = new Date(now.getTime() - AIRPORT_RECHECK_MIN_INTERVAL_MS - 1).toISOString();
    expect(shouldRecheckAirportDestinations(exactlyThreeHoursAgo, now)).toBe(true);
    expect(shouldRecheckAirportDestinations(justOver, now)).toBe(true);
  });

  it("does not treat a recent train-only run as an airport check", () => {
    // Train stats ran 20 min ago, but airports last ran 6 hours ago → still recheck.
    const airportsSixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    expect(shouldRecheckAirportDestinations(airportsSixHoursAgo, now)).toBe(true);
  });
});
