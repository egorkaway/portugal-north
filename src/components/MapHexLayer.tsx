import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import { Polygon, useMap, useMapEvents } from "react-leaflet";
import { useLocale } from "@/i18n/LocaleProvider";
import { stationToSlug } from "@/lib/stationSlug";
import {
  findHexCellsAtLatLng,
  hexPathStyle,
  type StationHexCell,
} from "@/lib/stationH3Map";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTooltipHtml(
  matches: StationHexCell[],
  t: (key: string, vars?: Record<string, string | number>) => string,
): string {
  return matches
    .map((cell) => {
      const slug = stationToSlug(cell.stationName);
      const name = escapeHtml(cell.stationName);
      const movements = t("map.tooltipMovements", { count: cell.movements });
      const resolution = t("map.tooltipResolution", {
        resolution: cell.resolution,
      });
      const viewStation = t("map.viewStation");
      return `<div class="map-hex-tooltip__station">
        <p class="font-semibold text-foreground">${name}</p>
        <p class="text-xs text-muted-foreground">${movements}</p>
        <p class="text-xs text-muted-foreground">${resolution}</p>
        <a href="/stations/${slug}" class="text-xs font-medium text-primary hover:underline">${viewStation}</a>
      </div>`;
    })
    .join('<hr class="map-hex-tooltip__divider" />');
}

type MapHexLayerProps = {
  cells: StationHexCell[];
  minMovements: number;
  maxMovements: number;
};

export function MapHexLayer({
  cells,
  minMovements,
  maxMovements,
}: MapHexLayerProps) {
  const map = useMap();
  const { t } = useLocale();
  const tooltipRef = useRef<L.Tooltip | null>(null);

  useEffect(() => {
    tooltipRef.current = L.tooltip({
      sticky: true,
      direction: "top",
      className: "map-hex-tooltip",
      opacity: 1,
    });
    return () => {
      tooltipRef.current?.remove();
      tooltipRef.current = null;
    };
  }, [map]);

  const hideTooltip = useCallback(() => {
    const tooltip = tooltipRef.current;
    if (tooltip?.isOpen()) {
      map.closeTooltip(tooltip);
    }
  }, [map]);

  const showTooltip = useCallback(
    (latlng: L.LatLng) => {
      const matches = findHexCellsAtLatLng(latlng.lat, latlng.lng, cells);
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      if (matches.length === 0) {
        hideTooltip();
        return;
      }

      tooltip
        .setContent(buildTooltipHtml(matches, t))
        .setLatLng(latlng)
        .openOn(map);
    },
    [cells, hideTooltip, map, t],
  );

  const hoverHandlers = {
    mousemove(e: L.LeafletMouseEvent) {
      showTooltip(e.latlng);
    },
    mouseout() {
      hideTooltip();
    },
  };

  useMapEvents({
    mousemove(e) {
      showTooltip(e.latlng);
    },
    mouseout() {
      hideTooltip();
    },
  });

  return (
    <>
      {cells.map((cell) => {
        const style = hexPathStyle(
          cell.resolution,
          cell.movements,
          minMovements,
          maxMovements,
        );
        return (
          <Polygon
            key={`${cell.stationName}-${cell.cellId}`}
            positions={cell.boundary}
            pathOptions={{
              color: style.color,
              weight: style.weight,
              fillColor: style.fillColor,
              fillOpacity: style.fillOpacity,
            }}
            eventHandlers={hoverHandlers}
          />
        );
      })}
    </>
  );
}
