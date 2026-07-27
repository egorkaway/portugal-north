import { describe, expect, it } from "vitest";
import {
  AIRPORT_RECHECK_MIN_INTERVAL_MS,
  shouldRecheckAirportDestinations,
} from "../../scripts/lib/airportRecheckPolicy.mjs";

describe("shouldRecheckAirportDestinations", () => {
  const now = new Date("2026-07-27T12:00:00.000Z");

  it("rechecks when there is no previous run", () => {
    expect(shouldRecheckAirportDestinations(null, now)).toBe(true);
    expect(shouldRecheckAirportDestinations(undefined, now)).toBe(true);
  });

  it("skips when last run was under 3 hours ago", () => {
    expect(shouldRecheckAirportDestinations("2026-07-27T10:00:01.000Z", now)).toBe(false);
    expect(shouldRecheckAirportDestinations("2026-07-27T11:59:00.000Z", now)).toBe(false);
  });

  it("rechecks at or after the 3 hour mark", () => {
    const exactlyThreeHoursAgo = new Date(now.getTime() - AIRPORT_RECHECK_MIN_INTERVAL_MS).toISOString();
    const justOver = new Date(now.getTime() - AIRPORT_RECHECK_MIN_INTERVAL_MS - 1).toISOString();
    expect(shouldRecheckAirportDestinations(exactlyThreeHoursAgo, now)).toBe(true);
    expect(shouldRecheckAirportDestinations(justOver, now)).toBe(true);
  });
});
