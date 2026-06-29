import { cellToBoundary, latLngToCell } from "h3-js";

export const H3_ACTIVITY_RESOLUTIONS = [5, 7, 9] as const;
export type H3ActivityResolution = (typeof H3_ACTIVITY_RESOLUTIONS)[number];

/** Default view for mainland Portugal and Spain on the activity map. */
export const IBERIAN_MAP_CENTER: [number, number] = [39.9, -3.1];
export const IBERIAN_MAP_ZOOM = 6;
export const IBERIAN_MAP_BOUNDS: [[number, number], [number, number]] = [
  [35.8, -10.0],
  [44.0, 4.0],
];

export type StationHexCell = {
  stationName: string;
  movements: number;
  resolution: H3ActivityResolution;
  cellId: string;
  /** Leaflet positions as [lat, lng]. */
  boundary: [number, number][];
};

/** Map movement totals to H3 resolutions 5 (busiest), 7, 9 (quietest) — never 6 or 8. */
export function movementsToH3Resolution(
  movements: number,
  minMovements: number,
  maxMovements: number,
): H3ActivityResolution {
  if (maxMovements <= minMovements) return 7;
  if (movements >= maxMovements) return 5;
  if (movements <= minMovements) return 9;

  const t = (movements - minMovements) / (maxMovements - minMovements);
  if (t >= 2 / 3) return 5;
  if (t >= 1 / 3) return 7;
  return 9;
}

export function buildStationHexCells(
  stations: { name: string; lat: number; lng: number }[],
  movementsByStation: Record<string, number>,
): { cells: StationHexCell[]; minMovements: number; maxMovements: number } {
  const entries = stations
    .map((station) => ({
      station,
      movements: movementsByStation[station.name] ?? 0,
    }))
    .filter((entry) => entry.movements > 0);

  if (entries.length === 0) {
    return { cells: [], minMovements: 0, maxMovements: 0 };
  }

  const minMovements = Math.min(...entries.map((entry) => entry.movements));
  const maxMovements = Math.max(...entries.map((entry) => entry.movements));

  const cells = entries.map(({ station, movements }) => {
    const resolution = movementsToH3Resolution(movements, minMovements, maxMovements);
    const cellId = latLngToCell(station.lat, station.lng, resolution);
    const boundary = cellToBoundary(cellId).map(
      ([lat, lng]) => [lat, lng] as [number, number],
    );

    return {
      stationName: station.name,
      movements,
      resolution,
      cellId,
      boundary,
    };
  });

  return { cells, minMovements, maxMovements };
}

/** Add fixed quiet (res. 9) hexes for stations without CP movement sampling. */
export function appendLowActivityHexCells(
  hexData: { cells: StationHexCell[]; minMovements: number; maxMovements: number },
  stations: { name: string; lat: number; lng: number }[],
): { cells: StationHexCell[]; minMovements: number; maxMovements: number } {
  if (stations.length === 0) return hexData;

  const movements = hexData.minMovements;
  const extraCells = stations.map((station) => {
    const resolution = 9 as const;
    const cellId = latLngToCell(station.lat, station.lng, resolution);
    const boundary = cellToBoundary(cellId).map(
      ([lat, lng]) => [lat, lng] as [number, number],
    );

    return {
      stationName: station.name,
      movements,
      resolution,
      cellId,
      boundary,
    };
  });

  return {
    ...hexData,
    cells: [...hexData.cells, ...extraCells],
  };
}

export function hexFillOpacity(movements: number, minMovements: number, maxMovements: number): number {
  if (maxMovements <= minMovements) return 0.45;
  const t = (movements - minMovements) / (maxMovements - minMovements);
  return 0.28 + t * 0.42;
}

export type HexPathStyle = {
  fillColor: string;
  fillOpacity: number;
  color: string;
  weight: number;
};

function movementRatio(
  movements: number,
  minMovements: number,
  maxMovements: number,
): number {
  if (maxMovements <= minMovements) return 1;
  return (movements - minMovements) / (maxMovements - minMovements);
}

export function hexPathStyle(
  resolution: H3ActivityResolution,
  movements: number,
  minMovements: number,
  maxMovements: number,
): HexPathStyle {
  const t = movementRatio(movements, minMovements, maxMovements);

  switch (resolution) {
    case 5:
      return {
        fillColor: "hsl(145 58% 50%)",
        fillOpacity: 0.48 - t * 0.14,
        color: "hsl(145 82% 26%)",
        weight: 3,
      };
    case 7:
      return {
        fillColor: "hsl(210 52% 46%)",
        fillOpacity: 0.42 + t * 0.22,
        color: "hsl(210 72% 18%)",
        weight: 2,
      };
    case 9:
      return {
        fillColor: "hsl(275 48% 34%)",
        fillOpacity: 0.78 + (1 - t) * 0.18,
        color: "hsl(275 68% 10%)",
        weight: 2,
      };
  }
}

/** All hex cells whose H3 index contains the given point (overlapping sizes). */
export function findHexCellsAtLatLng(
  lat: number,
  lng: number,
  cells: StationHexCell[],
): StationHexCell[] {
  return cells
    .filter((cell) => latLngToCell(lat, lng, cell.resolution) === cell.cellId)
    .sort((a, b) => {
      if (a.resolution !== b.resolution) return b.resolution - a.resolution;
      return a.stationName.localeCompare(b.stationName);
    });
}

export type StationHexFeatureProperties = {
  stationName: string;
  movements: number;
  resolution: H3ActivityResolution;
  cellId: string;
};

export type StationHexGeoJSON = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: StationHexFeatureProperties;
    geometry: {
      type: "Polygon";
      coordinates: [number, number][][];
    };
  }[];
};

function boundaryToGeoJsonRing(boundary: [number, number][]): [number, number][] {
  const ring = boundary.map(([lat, lng]) => [lng, lat] as [number, number]);
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
    ring.push(first ?? [0, 0]);
  }
  return ring;
}

export function stationHexCellsToGeoJSON(cells: StationHexCell[]): StationHexGeoJSON {
  return {
    type: "FeatureCollection",
    features: cells.map((cell) => ({
      type: "Feature",
      properties: {
        stationName: cell.stationName,
        movements: cell.movements,
        resolution: cell.resolution,
        cellId: cell.cellId,
      },
      geometry: {
        type: "Polygon",
        coordinates: [boundaryToGeoJsonRing(cell.boundary)],
      },
    })),
  };
}

export function downloadStationHexGeoJSON(
  cells: StationHexCell[],
  filename = "station-activity-hexes.geojson",
): void {
  const geojson = stationHexCellsToGeoJSON(cells);
  const blob = new Blob([JSON.stringify(geojson, null, 2)], {
    type: "application/geo+json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
