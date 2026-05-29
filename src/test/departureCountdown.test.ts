import { describe, expect, it } from "vitest";
import { createTranslator } from "@/i18n";
import {
  formatDepartureCountdown,
  getMinutesUntilDeparture,
} from "@/lib/departureCountdown";

describe("getMinutesUntilDeparture", () => {
  it("computes minutes until departure in Lisbon time", () => {
    const now = new Date("2026-05-28T17:00:00.000Z");
    expect(getMinutesUntilDeparture("18:30", null, now)).toBe(30);
    expect(getMinutesUntilDeparture("18:05", 5, now)).toBe(10);
  });

  it("returns zero or negative when departure time has passed", () => {
    const now = new Date("2026-05-28T17:00:00.000Z");
    expect(getMinutesUntilDeparture("16:00", null, now)).toBeLessThanOrEqual(0);
  });
});

describe("formatDepartureCountdown", () => {
  it("formats minute and hour labels", () => {
    const { t } = createTranslator("en");
    expect(formatDepartureCountdown(12, { t })).toBe("in 12 min");
    expect(formatDepartureCountdown(65, { t })).toBe("in 1h 5m");
    expect(formatDepartureCountdown(0, { t })).toBe("departing now");
  });
});
