import { describe, expect, it } from "vitest";
import { parseSivTrainJourney } from "../../server/lib/cpTrainJourney";
import { downstreamStopsFrom } from "@/lib/trainJourney";

describe("parseSivTrainJourney", () => {
  it("maps SIV train stops into journey stops", () => {
    const journey = parseSivTrainJourney(
      {
        serviceCode: { designation: "Urbano" },
        trainStops: [
          {
            station: { code: "94-2006", designation: "Porto - Campanha" },
            departure: "17:10",
            platform: 3,
          },
          {
            station: { code: "94-39172", designation: "General Torres" },
            arrival: "17:14",
            departure: "17:15",
          },
        ],
      },
      "542",
      "2026-06-30",
    );

    expect(journey.trainNumber).toBe("542");
    expect(journey.serviceType).toBe("Urbano");
    expect(journey.stops).toHaveLength(2);
    expect(journey.stops[1]?.arrivalTime).toBe("17:14");
  });
});

describe("downstreamStopsFrom", () => {
  it("returns stops from the boarding station onward", () => {
    const journey = {
      trainNumber: "1",
      timetableDate: "2026-06-30",
      serviceType: "Regional",
      stops: [
        {
          stationCode: "94-a",
          stationName: "A",
          arrivalTime: null,
          departureTime: "10:00",
          platform: null,
        },
        {
          stationCode: "94-b",
          stationName: "B",
          arrivalTime: "10:20",
          departureTime: "10:21",
          platform: null,
        },
      ],
    };

    expect(downstreamStopsFrom(journey, "94-b")).toEqual([journey.stops[1]]);
  });

  it("prepends the boarding station when it is missing from the journey", () => {
    const journey = {
      trainNumber: "15761",
      timetableDate: "2026-06-30",
      serviceType: "Urbano",
      stops: [
        {
          stationCode: "94-2006",
          stationName: "Porto-Campanhã",
          arrivalTime: "10:04",
          departureTime: "10:05",
          platform: null,
        },
      ],
    };

    expect(
      downstreamStopsFrom(journey, "94-39149", {
        stationName: "Coimbrões",
        departureTime: "10:12",
        platform: "2",
      }),
    ).toEqual([
      {
        stationCode: "94-39149",
        stationName: "Coimbrões",
        departureTime: "10:12",
        arrivalTime: "10:12",
        platform: "2",
      },
      journey.stops[0],
    ]);
  });
});
