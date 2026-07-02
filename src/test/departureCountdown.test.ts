import { describe, expect, it } from "vitest";
import { createTranslator } from "@/i18n";
import {
  formatDepartureCountdown,
  formatDepartureTimeAgo,
  getEffectiveDepartureClock,
  getMinutesSinceDeparture,
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

describe("getEffectiveDepartureClock", () => {
  it("adds delay minutes to the scheduled departure", () => {
    expect(getEffectiveDepartureClock("12:26", 10)).toBe("12:36");
    expect(getEffectiveDepartureClock("23:55", 10)).toBe("00:05");
  });
});

describe("getMinutesSinceDeparture", () => {
  it("returns minutes since effective departure once the train has left", () => {
    const now = new Date("2026-05-28T17:00:00.000Z");
    expect(getMinutesSinceDeparture("17:33", null, now)).toBe(27);
    expect(getMinutesSinceDeparture("18:30", null, now)).toBeNull();
  });
});

describe("formatDepartureTimeAgo", () => {
  it("formats elapsed time since departure", () => {
    const { t } = createTranslator("en");
    expect(formatDepartureTimeAgo(27, { t })).toBe("27 min ago");
    expect(formatDepartureTimeAgo(75, { t })).toBe("1h 15m ago");
  });
});
