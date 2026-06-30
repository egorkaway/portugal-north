import { beforeEach, describe, expect, it } from "vitest";
import {
  clearActiveTrip,
  setActiveTrip,
  toggleActiveTrip,
  type PlannedDeparture,
} from "@/lib/plannedDepartures";
import { readTripHistory, recordCompletedTrip } from "@/lib/trainTripHistory";

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

describe("planned departures", () => {
  beforeEach(() => {
    localStorage.clear();
    clearActiveTrip();
  });

  it("stores a single active trip globally", () => {
    setActiveTrip(sampleTrip);
    const cleared = toggleActiveTrip("Porto-Campanhã", {
      trainNumber: sampleTrip.trainNumber,
      departureTime: sampleTrip.departureTime,
      destination: sampleTrip.destination,
      serviceType: sampleTrip.serviceType,
      platform: sampleTrip.platform,
      delayMinutes: sampleTrip.delayMinutes,
      id: sampleTrip.id,
      timetableDate: sampleTrip.timetableDate,
      selectedAt: sampleTrip.selectedAt,
    });
    expect(cleared).toBeNull();
  });

  it("replaces an existing trip when selecting another train", () => {
    setActiveTrip(sampleTrip);
    const next = toggleActiveTrip("São Bento (Porto)", {
      trainNumber: "123",
      departureTime: "18:00",
      destination: "Braga",
      serviceType: "Regional",
      platform: null,
      delayMinutes: null,
    });
    expect(next?.stationName).toBe("São Bento (Porto)");
  });
});

describe("trip history", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores completed trips locally without exposing UI", () => {
    recordCompletedTrip(sampleTrip, "Lisboa");
    const history = readTripHistory();
    expect(history).toHaveLength(1);
    expect(history[0]?.finalStationName).toBe("Lisboa");
  });
});
