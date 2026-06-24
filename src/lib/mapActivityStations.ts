import { portugalStations } from "@/data/stations";
import { portugalAirports } from "@/data/portugal/airports";
import { spainStations } from "@/data/spain/stations";
import { spainAirports } from "@/data/spain/airports";
import { appendLowActivityHexCells, buildStationHexCells } from "@/lib/stationH3Map";

/** Non-CP locations shown on the activity map as quiet hexes without departure sampling. */
export function getMapLowActivityInternationalStations() {
  return [...spainStations, ...spainAirports, ...portugalAirports];
}

export function buildMapActivityHexData(movementsByStation: Record<string, number>) {
  const portugalHexData = buildStationHexCells(portugalStations, movementsByStation);
  return appendLowActivityHexCells(
    portugalHexData,
    getMapLowActivityInternationalStations(),
  );
}
