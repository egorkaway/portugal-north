import { beforeEach, describe, expect, it } from "vitest";
import { lisbonDateAndTime } from "@/lib/cpDeparturesParse";
import {
  clearActiveTrip,
  setActiveTrip,
  toggleActiveTrip,
  type PlannedDeparture,
} from "@/lib/plannedDepartures";
import { deleteTripHistoryRecord, readTripHistory, recordTakenTrip } from "@/lib/trainTripHistory";

function makeSampleTrip(overrides: Partial<PlannedDeparture> = {}): PlannedDeparture {
  const { date } = lisbonDateAndTime();
  const base: PlannedDeparture = {
    id: `Porto-Campanhã|542|17:10|Lisboa|${date}`,
    stationName: "Porto-Campanhã",
    trainNumber: "542",
    departureTime: "17:10",
    destination: "Lisboa",
    serviceType: "Urbano",
    platform: "3",
    delayMinutes: null,
    timetableDate: date,
    selectedAt: new Date().toISOString(),
  };
  return { ...base, ...overrides };
}

describe("planned departures", () => {
  beforeEach(() => {
    localStorage.clear();
    clearActiveTrip();
  });

  it("stores a single active trip globally without adding history yet", () => {
    const sampleTrip = makeSampleTrip();
    setActiveTrip(sampleTrip);
    expect(readTripHistory()).toHaveLength(0);
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
    expect(readTripHistory()).toHaveLength(0);
  });

  it("does not record taken trains until departure", () => {
    const sampleTrip = makeSampleTrip();
    toggleActiveTrip("Porto-Campanhã", {
      trainNumber: sampleTrip.trainNumber,
      departureTime: sampleTrip.departureTime,
      destination: sampleTrip.destination,
      serviceType: sampleTrip.serviceType,
      platform: sampleTrip.platform,
      delayMinutes: sampleTrip.delayMinutes,
      timetableDate: sampleTrip.timetableDate,
    });
    const history = readTripHistory();
    expect(history).toHaveLength(0);
  });

  it("does not add history when stop tracking before departure", () => {
    const sampleTrip = makeSampleTrip();
    toggleActiveTrip("Porto-Campanhã", {
      trainNumber: sampleTrip.trainNumber,
      departureTime: sampleTrip.departureTime,
      destination: sampleTrip.destination,
      serviceType: sampleTrip.serviceType,
      platform: sampleTrip.platform,
      delayMinutes: sampleTrip.delayMinutes,
      timetableDate: sampleTrip.timetableDate,
    });
    clearActiveTrip();
    expect(readTripHistory()).toHaveLength(0);
  });

  it("replaces an existing trip when selecting another train", () => {
    const sampleTrip = makeSampleTrip();
    setActiveTrip(sampleTrip);
    const next = toggleActiveTrip("São Bento (Porto)", {
      trainNumber: "123",
      departureTime: "18:00",
      destination: "Braga",
      serviceType: "Regional",
      platform: null,
      delayMinutes: null,
      timetableDate: sampleTrip.timetableDate,
    });
    expect(next?.stationName).toBe("São Bento (Porto)");
    expect(next?.id).toContain(`|${sampleTrip.timetableDate}`);
  });

  it("includes timetableDate in the planned departure id", () => {
    const { date } = lisbonDateAndTime();
    const next = toggleActiveTrip("Porto-Campanhã", {
      trainNumber: "542",
      departureTime: "17:10",
      destination: "Lisboa",
      serviceType: "Urbano",
      platform: "3",
      delayMinutes: null,
      timetableDate: date,
    });
    expect(next?.id).toBe(`Porto-Campanhã|542|17:10|Lisboa|${date}`);
  });
});

describe("trip history", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores taken trips locally", () => {
    const sampleTrip = makeSampleTrip();
    recordTakenTrip(sampleTrip, "Lisboa");
    const history = readTripHistory();
    expect(history).toHaveLength(1);
    expect(history[0]?.finalStationName).toBe("Lisboa");
  });

  it("deletes a taken trip record by id", () => {
    const sampleTrip = makeSampleTrip();
    recordTakenTrip(sampleTrip, "Lisboa");
    expect(readTripHistory()).toHaveLength(1);
    deleteTripHistoryRecord(sampleTrip.id);
    expect(readTripHistory()).toHaveLength(0);
  });
});
