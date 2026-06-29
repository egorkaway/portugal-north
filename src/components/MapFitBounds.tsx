import { useEffect } from "react";
import type { FitBoundsOptions, LatLngBoundsExpression } from "leaflet";
import { useMap } from "react-leaflet";

type MapFitBoundsProps = {
  bounds: LatLngBoundsExpression;
  options?: FitBoundsOptions;
};

export function MapFitBounds({ bounds, options }: MapFitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds, { padding: [24, 24], ...options });
  }, [bounds, map, options]);

  return null;
}
