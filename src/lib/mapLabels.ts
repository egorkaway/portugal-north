import { portugalAirports } from "@/data/portugalAirports";

export const MAP_LABELLED_STATION_NAMES = [
  "Faro",
  "Porto-Campanhã",
  "Viana do Castelo",
  "Coimbra-B",
  "Lisboa Santa Apolónia",
] as const;

export type MapLabelKind = "airport" | "station";

export type MapLabelPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: MapLabelKind;
  showMarker: boolean;
  direction: "top" | "bottom" | "left" | "right";
  offset: [number, number];
};

const STATION_LABEL_LAYOUT: Partial<
  Record<(typeof MAP_LABELLED_STATION_NAMES)[number], Pick<MapLabelPoint, "direction" | "offset">>
> = {
  Faro: { direction: "bottom", offset: [0, 10] },
  "Porto-Campanhã": { direction: "bottom", offset: [0, 10] },
  "Lisboa Santa Apolónia": { direction: "bottom", offset: [0, 10] },
  "Viana do Castelo": { direction: "top", offset: [0, -6] },
  "Coimbra-B": { direction: "top", offset: [0, -6] },
};

const AIRPORT_LABEL_LAYOUT: Partial<
  Record<(typeof portugalAirports)[number]["iata"], Pick<MapLabelPoint, "direction" | "offset">>
> = {
  FAO: { direction: "top", offset: [0, -12] },
  OPO: { direction: "top", offset: [0, -12] },
  LIS: { direction: "right", offset: [12, 0] },
};

export function buildMapLabelPoints(
  stations: { name: string; lat: number; lng: number }[],
  airportLabels: Record<(typeof portugalAirports)[number]["iata"], string>,
): MapLabelPoint[] {
  const stationByName = new Map(stations.map((station) => [station.name, station]));

  const airportPoints: MapLabelPoint[] = portugalAirports.map((airport) => {
    const layout = AIRPORT_LABEL_LAYOUT[airport.iata] ?? {
      direction: "top" as const,
      offset: [0, -12] as [number, number],
    };

    return {
      id: `airport-${airport.iata}`,
      lat: airport.lat,
      lng: airport.lng,
      label: `${airportLabels[airport.iata]} (${airport.iata})`,
      kind: "airport",
      showMarker: true,
      ...layout,
    };
  });

  const stationPoints: MapLabelPoint[] = MAP_LABELLED_STATION_NAMES.flatMap((name) => {
    const station = stationByName.get(name);
    if (!station) return [];

    const layout = STATION_LABEL_LAYOUT[name] ?? {
      direction: "top" as const,
      offset: [0, -6] as [number, number],
    };

    return [
      {
        id: `station-${name}`,
        lat: station.lat,
        lng: station.lng,
        label: name,
        kind: "station",
        showMarker: false,
        ...layout,
      },
    ];
  });

  return [...airportPoints, ...stationPoints];
}
