import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useTripDepartureRecord } from "@/hooks/useTripDepartureRecord";
import type { PlannedDeparture } from "@/lib/plannedDepartures";
import { readTripHistory } from "@/lib/trainTripHistory";

const sampleTrip: PlannedDeparture = {
  id: "Porto-Campanhã|542|17:10|Lisboa",
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
});
