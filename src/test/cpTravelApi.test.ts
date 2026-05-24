import { describe, expect, it } from "vitest";
import { lisbonDateAndTime, parseUpcomingDepartures } from "@/lib/cpDeparturesParse";

describe("parseUpcomingDepartures", () => {
  it("returns up to three upcoming departures sorted by time", () => {
    const result = parseUpcomingDepartures(
      {
        stationStops: [
          {
            trainNumber: 100,
            departureTime: "18:00",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "b", designation: "B" },
            trainService: { code: "R", designation: "Regional" },
          },
          {
            trainNumber: 200,
            departureTime: "17:30",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "c", designation: "C" },
            trainService: { code: "IC", designation: "Intercidades" },
            delay: 5,
          },
          {
            trainNumber: 300,
            departureTime: "17:10",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "d", designation: "D" },
            trainService: { code: "U", designation: "Urbano" },
          },
          {
            trainNumber: 400,
            arrivalTime: "16:00",
            trainOrigin: { code: "a", designation: "A" },
            trainDestination: { code: "e", designation: "E" },
            trainService: { code: "R", designation: "Regional" },
          },
        ],
      },
      3,
    );

    expect(result).toHaveLength(3);
    expect(result[0].trainNumber).toBe("300");
    expect(result[1].trainNumber).toBe("200");
    expect(result[2].trainNumber).toBe("100");
    expect(result[1].delayMinutes).toBe(5);
  });

  it("ignores arrival-only stops", () => {
    const result = parseUpcomingDepartures({
      stationStops: [
        {
          trainNumber: 1,
          arrivalTime: "12:00",
          trainOrigin: { code: "a", designation: "A" },
          trainDestination: { code: "b", designation: "B" },
          trainService: { code: "U", designation: "Urbano" },
        },
      ],
    });
    expect(result).toHaveLength(0);
  });
});

describe("lisbonDateAndTime", () => {
  it("formats date and time in Europe/Lisbon", () => {
    const { date, time } = lisbonDateAndTime(new Date("2026-05-24T12:34:00Z"));
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });
});
