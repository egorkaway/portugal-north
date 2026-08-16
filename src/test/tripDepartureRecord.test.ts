import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTripDepartureRecord } from "@/hooks/useTripDepartureRecord";
import type { PlannedDeparture } from "@/lib/plannedDepartures";
import { readTripHistory } from "@/lib/trainTripHistory";

const sampleTrip: PlannedDeparture = {
  id: "Porto-Campanhã|542|17:10|Lisboa|2026-06-30",
  stationName: "Porto-Campanhã",
  trainNumber: "542",
  departureTime: "17:10",
  destination: "Lisboa",
  serviceType: "Urbano",
  platform: "3",
  delayMinutes: null,
  timetableDate: "2026-06-30",
  selectedAt: "2026-06-30T10:00:00.000Z",
};

describe("useTripDepartureRecord", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("does not record a future departure", () => {
    const now = new Date("2026-06-30T15:00:00.000Z"); // 16:00 Lisbon summer

    renderHook(() => useTripDepartureRecord(sampleTrip, null, now));

    expect(readTripHistory()).toHaveLength(0);
  });

  it("records once the effective departure time has passed", () => {
    const now = new Date("2026-06-30T16:15:00.000Z"); // 17:15 Lisbon summer

    renderHook(() => useTripDepartureRecord(sampleTrip, null, now));

    expect(readTripHistory()).toHaveLength(1);
    expect(readTripHistory()[0]?.trainNumber).toBe("542");
  });

  it("does not record Meet trips in history", () => {
    const now = new Date("2026-06-30T16:15:00.000Z"); // 17:15 Lisbon summer
    const meetTrip: PlannedDeparture = {
      ...sampleTrip,
      purpose: "meet",
      destination: "Lisboa Oriente",
    };

    renderHook(() => useTripDepartureRecord(meetTrip, null, now));

    expect(readTripHistory()).toHaveLength(0);
  });

  it("stores actual leave time and live platform when delayed", () => {
    const now = new Date("2026-06-30T16:25:00.000Z"); // 17:25 Lisbon summer

    renderHook(() => useTripDepartureRecord(sampleTrip, 10, now, "7"));

    const record = readTripHistory()[0];
    expect(record?.departureTime).toBe("17:10");
    expect(record?.actualDepartureTime).toBe("17:20");
    expect(record?.platform).toBe("7");
    expect(record?.delayMinutes).toBe(10);
  });
});
