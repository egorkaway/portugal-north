import { portugalAirports } from "@/data/portugalAirports";
import { spainMapAirports } from "@/data/spainMapAirports";

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
  /** Hide marker and label when map zoom is below this level. */
  minZoomToShow?: number;
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
  Record<string, Pick<MapLabelPoint, "direction" | "offset">>
> = {
  FAO: { direction: "top", offset: [0, -12] },
  OPO: { direction: "top", offset: [0, -12] },
  LIS: { direction: "right", offset: [12, 0] },
  MAD: { direction: "top", offset: [0, -12] },
  BCN: { direction: "left", offset: [-12, 0] },
  AGP: { direction: "top", offset: [0, -12] },
  ALC: { direction: "bottom", offset: [0, 10] },
  VLC: { direction: "bottom", offset: [0, 10] },
  SVQ: { direction: "top", offset: [0, -12] },
  BIO: { direction: "top", offset: [0, -12] },
  SCQ: { direction: "left", offset: [-12, 0] },
  VGO: { direction: "bottom", offset: [0, 10] },
  OVD: { direction: "top", offset: [0, -12] },
};

/** Southern/eastern airport labels clutter the map when zoomed out past Iberia overview. */
const AIRPORT_MIN_ZOOM_TO_SHOW: Partial<Record<string, number>> = {
  FAO: 7,
  LIS: 7,
  BCN: 7,
  ALC: 7,
  VLC: 7,
  AGP: 7,
};

const MAP_AIRPORTS = [...portugalAirports, ...spainMapAirports];

export function buildMapLabelPoints(
  stations: { name: string; lat: number; lng: number }[],
  airportLabels: Record<string, string>,
  options: { hiddenAirportIatas?: Iterable<string> } = {},
): MapLabelPoint[] {
  const stationByName = new Map(stations.map((station) => [station.name, station]));
  const hidden = new Set(
    [...(options.hiddenAirportIatas ?? [])].map((iata) => iata.trim().toUpperCase()),
  );

  const airportPoints: MapLabelPoint[] = MAP_AIRPORTS.flatMap((airport) => {
    if (hidden.has(airport.iata)) return [];
    const label = airportLabels[airport.iata];
    if (!label) return [];

    const layout = AIRPORT_LABEL_LAYOUT[airport.iata] ?? {
      direction: "top" as const,
      offset: [0, -12] as [number, number],
    };

    return [
      {
        id: `airport-${airport.iata}`,
        lat: airport.lat,
        lng: airport.lng,
        label: `${label} (${airport.iata})`,
        kind: "airport",
        showMarker: true,
        minZoomToShow: AIRPORT_MIN_ZOOM_TO_SHOW[airport.iata],
        ...layout,
      },
    ];
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
