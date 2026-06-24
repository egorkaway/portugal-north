import { portugalStations } from "@/data/stations";
import { spainStations } from "@/data/spain/stations";
import { appendLowActivityHexCells, buildStationHexCells } from "@/lib/stationH3Map";

/** Spanish/international stations shown on the activity map as quiet hexes without CP sampling. */
const MAP_LOW_ACTIVITY_INTERNATIONAL_STATION_NAMES = ["Vigo-Guixar"] as const;

export function getMapLowActivityInternationalStations() {
  return spainStations.filter((station) =>
    MAP_LOW_ACTIVITY_INTERNATIONAL_STATION_NAMES.includes(
      station.name as (typeof MAP_LOW_ACTIVITY_INTERNATIONAL_STATION_NAMES)[number],
    ),
  );
}

export function buildMapActivityHexData(movementsByStation: Record<string, number>) {
  const portugalHexData = buildStationHexCells(portugalStations, movementsByStation);
  return appendLowActivityHexCells(
    portugalHexData,
    getMapLowActivityInternationalStations(),
  );
}
