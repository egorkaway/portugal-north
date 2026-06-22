import { useState } from "react";
import { CircleMarker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { MapLabelPoint } from "@/lib/mapLabels";

const AIRPORT_MARKER_RADIUS = 5;

const AIRPORT_MARKER_STYLE = {
  color: "hsl(25 88% 28%)",
  fillColor: "hsl(25 92% 52%)",
  fillOpacity: 0.92,
  weight: 1.5,
} as const;

const HIDDEN_MARKER_STYLE = {
  opacity: 0,
  fillOpacity: 0,
  weight: 0,
} as const;

function MapPointLabelsLayer({ points }: { points: MapLabelPoint[] }) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  return (
    <>
      {points.map((point) => {
        if (point.minZoomToShow != null && zoom < point.minZoomToShow) {
          return null;
        }

        return (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={point.showMarker ? AIRPORT_MARKER_RADIUS : 0}
            pathOptions={point.showMarker ? AIRPORT_MARKER_STYLE : HIDDEN_MARKER_STYLE}
          >
            <Tooltip
              permanent
              direction={point.direction}
              offset={point.offset}
              className={`map-point-label map-point-label--${point.kind}`}
            >
              {point.label}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

export function MapPointLabels({ points }: { points: MapLabelPoint[] }) {
  return <MapPointLabelsLayer points={points} />;
}
