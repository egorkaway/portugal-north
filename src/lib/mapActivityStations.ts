import { portugalStations } from "@/data/stations";
import { portugalAirports } from "@/data/portugal/airports";
import { spainStations } from "@/data/spain/stations";
import { spainAirports } from "@/data/spain/airports";
import { SPAIN_RELIABILITY_MIN_MOVEMENTS } from "@/lib/reliabilityScore";
import {
  appendLowActivityHexCells,
  buildStationHexCells,
  type StationActivityDot,
} from "@/lib/stationH3Map";

/** Non-CP locations shown on the activity map as quiet hexes without departure sampling. */
export function getMapLowActivityInternationalStations() {
  return [...spainStations, ...spainAirports, ...portugalAirports];
}

type ReliabilityMaps = {
  portugalScores?: Record<string, number>;
  portugalMovements?: Record<string, number>;
  spainScores?: Record<string, number>;
  spainMovements?: Record<string, number>;
};

function canRenderAsReliabilityDot(
  stationName: string,
  country: "pt" | "es",
  reliability: ReliabilityMaps,
): number | null {
  if (country === "es") {
    const score = reliability.spainScores?.[stationName];
    const samples = reliability.spainMovements?.[stationName] ?? 0;
    return typeof score === "number" && samples >= SPAIN_RELIABILITY_MIN_MOVEMENTS
      ? score
      : null;
  }

  const score = reliability.portugalScores?.[stationName];
  const samples = reliability.portugalMovements?.[stationName] ?? 0;
  return typeof score === "number" && samples >= SPAIN_RELIABILITY_MIN_MOVEMENTS
    ? score
    : null;
}

export function buildMapActivityHexData(
  movementsByStation: Record<string, number>,
  reliability: ReliabilityMaps = {},
) {
  const portugalHexData = buildStationHexCells(portugalStations, movementsByStation);
  const dots: StationActivityDot[] = [];

  const portugalCells = portugalHexData.cells
    .map((cell) => ({
      ...cell,
      score: canRenderAsReliabilityDot(cell.stationName, "pt", reliability) ?? undefined,
    }))
    .filter((cell) => {
      if (cell.tier !== "quiet") return true;
      const station = portugalStations.find((entry) => entry.name === cell.stationName);
      if (!station) return true;
      const score = cell.score;
      if (score == null) return true;
      dots.push({
        stationName: cell.stationName,
        lat: station.lat,
        lng: station.lng,
        movements: cell.movements,
        score,
      });
      return false;
    });

  const inactiveOrLowSampleInternational = getMapLowActivityInternationalStations().filter(
    (station) => canRenderAsReliabilityDot(station.name, station.country === "es" ? "es" : "pt", reliability) == null,
  );

  const activeQuietInternationalDots = getMapLowActivityInternationalStations()
    .map((station) => {
      const score = canRenderAsReliabilityDot(
        station.name,
        station.country === "es" ? "es" : "pt",
        reliability,
      );
      if (score == null) return null;
      const movements =
        station.country === "es"
          ? (reliability.spainMovements?.[station.name] ?? 0)
          : (reliability.portugalMovements?.[station.name] ?? 0);
      return {
        stationName: station.name,
        lat: station.lat,
        lng: station.lng,
        movements,
        score,
      } satisfies StationActivityDot;
    })
    .filter((station): station is StationActivityDot => station != null);

  return {
    ...appendLowActivityHexCells(
      {
        ...portugalHexData,
        cells: portugalCells,
      },
      inactiveOrLowSampleInternational,
    ),
    dots: [...dots, ...activeQuietInternationalDots],
  };
}
