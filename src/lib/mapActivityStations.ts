import { portugalStations } from "@/data/stations";
import { spainStations } from "@/data/spain/stations";
import { appendLowActivityHexCells, buildStationHexCells } from "@/lib/stationH3Map";

/** Spanish stations shown on the activity map as quiet hexes without CP sampling. */
export function getMapLowActivityInternationalStations() {
  return spainStations;
}

export function buildMapActivityHexData(movementsByStation: Record<string, number>) {
  const portugalHexData = buildStationHexCells(portugalStations, movementsByStation);
  return appendLowActivityHexCells(
    portugalHexData,
    getMapLowActivityInternationalStations(),
  );
}
