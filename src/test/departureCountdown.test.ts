import { describe, expect, it } from "vitest";
import { createTranslator } from "@/i18n";
import {
  formatDepartureCountdown,
  formatDepartureTimeAgo,
  getEffectiveDepartureClock,
  getMinutesSinceDeparture,
  getMinutesUntilDeparture,
  hasEffectiveDeparturePassed,
  isPlannedTripExpired,
  MAX_TRIP_TRACKING_MINUTES,
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

  it("does not wrap to a positive countdown when timetableDate is yesterday", () => {
    // 2026-05-29 18:00 Lisbon summer = 17:00 UTC
    const now = new Date("2026-05-29T17:00:00.000Z");
    const minutes = getMinutesUntilDeparture("18:30", null, now, "2026-05-28");
    expect(minutes).toBeLessThan(0);
    expect(minutes).toBe(-24 * 60 + 30);
  });

  it("computes countdown for today's timetableDate", () => {
    const now = new Date("2026-05-28T17:00:00.000Z");
    expect(getMinutesUntilDeparture("18:30", null, now, "2026-05-28")).toBe(30);
  });
});

describe("isPlannedTripExpired", () => {
  it("expires after MAX_TRIP_TRACKING_MINUTES past departure", () => {
    const now = new Date("2026-05-29T12:00:00.000Z"); // 13:00 Lisbon
    expect(
      isPlannedTripExpired(
        { departureTime: "18:30", delayMinutes: null, timetableDate: "2026-05-28" },
        now,
      ),
    ).toBe(true);
    expect(
      isPlannedTripExpired(
        {
          departureTime: "18:30",
          delayMinutes: null,
          timetableDate: "2026-05-28",
        },
        new Date("2026-05-28T17:00:00.000Z"),
      ),
    ).toBe(false);
  });

  it("treats more than 18h past departure as expired on the same calendar day", () => {
    const departureMinutes = 10 * 60;
    const nowMinutes = departureMinutes + MAX_TRIP_TRACKING_MINUTES + 1;
    const hours = Math.floor(nowMinutes / 60);
    const mins = nowMinutes % 60;
    // Build a Lisbon-local instant via UTC offset for summer (UTC+1)
    const now = new Date(
      Date.UTC(2026, 4, 28, hours - 1, mins, 0),
    );
    expect(
      isPlannedTripExpired(
        { departureTime: "10:00", delayMinutes: null, timetableDate: "2026-05-28" },
        now,
      ),
    ).toBe(true);
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

  it("keeps yesterday's departure in the past when timetableDate is set", () => {
    const now = new Date("2026-05-29T17:00:00.000Z");
    expect(getMinutesSinceDeparture("17:33", null, now, "2026-05-28")).toBe(
      24 * 60 + 27,
    );
  });
});

describe("hasEffectiveDeparturePassed", () => {
  it("treats the departure minute as departed", () => {
    const now = new Date("2026-05-28T17:30:00.000Z");
    expect(hasEffectiveDeparturePassed("18:30", null, now, "2026-05-28")).toBe(
      true,
    );
    expect(hasEffectiveDeparturePassed("18:31", null, now, "2026-05-28")).toBe(
      false,
    );
  });

  it("waits for delay before treating the trip as departed", () => {
    const now = new Date("2026-05-28T17:35:00.000Z"); // 18:35 Lisbon
    expect(hasEffectiveDeparturePassed("18:30", 10, now, "2026-05-28")).toBe(
      false,
    );
    expect(hasEffectiveDeparturePassed("18:30", 5, now, "2026-05-28")).toBe(
      true,
    );
  });

  it("keeps yesterday’s timetableDate in the past across midnight", () => {
    const now = new Date("2026-05-29T17:00:00.000Z");
    expect(hasEffectiveDeparturePassed("18:30", null, now, "2026-05-28")).toBe(
      true,
    );
  });
});

describe("formatDepartureTimeAgo", () => {
  it("formats elapsed time since departure", () => {
    const { t } = createTranslator("en");
    expect(formatDepartureTimeAgo(27, { t })).toBe("27 min ago");
    expect(formatDepartureTimeAgo(75, { t })).toBe("1h 15m ago");
  });
});
