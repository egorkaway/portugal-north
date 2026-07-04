import { beforeEach, describe, expect, it } from "vitest";
import {
  clearActiveTrip,
  setActiveTrip,
  toggleActiveTrip,
  type PlannedDeparture,
} from "@/lib/plannedDepartures";
import { deleteTripHistoryRecord, readTripHistory, recordTakenTrip } from "@/lib/trainTripHistory";

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
    expect(readTripHistory()).toHaveLength(1);
    expect(readTripHistory()[0]?.trainNumber).toBe("542");
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
    expect(readTripHistory()).toHaveLength(1);
  });

  it("records taken trains when selecting a departure", () => {
    toggleActiveTrip("Porto-Campanhã", {
      trainNumber: sampleTrip.trainNumber,
      departureTime: sampleTrip.departureTime,
      destination: sampleTrip.destination,
      serviceType: sampleTrip.serviceType,
      platform: sampleTrip.platform,
      delayMinutes: sampleTrip.delayMinutes,
    });
    const history = readTripHistory();
    expect(history).toHaveLength(1);
    expect(history[0]?.stationName).toBe("Porto-Campanhã");
    expect(history[0]?.finalStationName).toBe("Lisboa");
  });

  it("keeps a taken train in history after stop tracking", () => {
    toggleActiveTrip("Porto-Campanhã", {
      trainNumber: sampleTrip.trainNumber,
      departureTime: sampleTrip.departureTime,
      destination: sampleTrip.destination,
      serviceType: sampleTrip.serviceType,
      platform: sampleTrip.platform,
      delayMinutes: sampleTrip.delayMinutes,
    });
    clearActiveTrip();
    expect(readTripHistory()).toHaveLength(1);
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

  it("stores taken trips locally", () => {
    recordTakenTrip(sampleTrip, "Lisboa");
    const history = readTripHistory();
    expect(history).toHaveLength(1);
    expect(history[0]?.finalStationName).toBe("Lisboa");
  });

  it("deletes a taken trip record by id", () => {
    recordTakenTrip(sampleTrip, "Lisboa");
    expect(readTripHistory()).toHaveLength(1);
    deleteTripHistoryRecord(sampleTrip.id);
    expect(readTripHistory()).toHaveLength(0);
  });
});
