import { CircleMarker, Tooltip } from "react-leaflet";
import type { MapLabelPoint } from "@/lib/mapLabels";

const AIRPORT_MARKER_STYLE = {
  color: "hsl(25 88% 28%)",
  fillColor: "hsl(25 92% 52%)",
  fillOpacity: 0.92,
  weight: 2,
} as const;

const HIDDEN_MARKER_STYLE = {
  opacity: 0,
  fillOpacity: 0,
  weight: 0,
} as const;

export function MapPointLabels({ points }: { points: MapLabelPoint[] }) {
  return (
    <>
      {points.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={point.showMarker ? 9 : 0}
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
      ))}
    </>
  );
}
