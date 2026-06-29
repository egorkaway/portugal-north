import { useCallback, useEffect, useRef } from "react";
import L from "leaflet";
import { Polygon, useMap, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
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
        <a href="/stations/${slug}" data-station-link class="text-xs font-medium text-primary hover:underline">${viewStation}</a>
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
  const navigate = useNavigate();
  const { t } = useLocale();
  const tooltipRef = useRef<L.Tooltip | null>(null);
  const lastMatchesKeyRef = useRef("");
  const pinnedLatLngRef = useRef<L.LatLng | null>(null);
  const isPointerOnTooltipRef = useRef(false);

  const bindTooltipHover = useCallback((tooltip: L.Tooltip) => {
    const el = tooltip.getElement();
    if (!el || el.dataset.hoverBound) return;
    el.dataset.hoverBound = "1";
    el.addEventListener("mouseenter", () => {
      isPointerOnTooltipRef.current = true;
    });
    el.addEventListener("mouseleave", () => {
      isPointerOnTooltipRef.current = false;
    });
  }, []);

  useEffect(() => {
    tooltipRef.current = L.tooltip({
      sticky: false,
      interactive: true,
      direction: "top",
      offset: [0, -10],
      className: "map-hex-tooltip",
      opacity: 1,
    });

    return () => {
      tooltipRef.current?.remove();
      tooltipRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const container = map.getContainer();
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[data-station-link]",
      );
      if (!link || !container.contains(link)) return;
      event.preventDefault();
      navigate(link.getAttribute("href") ?? "");
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [map, navigate]);

  const hideTooltip = useCallback(() => {
    const tooltip = tooltipRef.current;
    if (tooltip?.isOpen()) {
      map.closeTooltip(tooltip);
    }
    lastMatchesKeyRef.current = "";
    pinnedLatLngRef.current = null;
    isPointerOnTooltipRef.current = false;
  }, [map]);

  const showTooltip = useCallback(
    (latlng: L.LatLng) => {
      if (isPointerOnTooltipRef.current) return;

      const matches = findHexCellsAtLatLng(latlng.lat, latlng.lng, cells);
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      if (matches.length === 0) {
        hideTooltip();
        return;
      }

      const matchesKey = matches
        .map((cell) => `${cell.stationName}:${cell.cellId}`)
        .join("|");

      if (matchesKey !== lastMatchesKeyRef.current) {
        tooltip.setContent(buildTooltipHtml(matches, t));
        lastMatchesKeyRef.current = matchesKey;
        pinnedLatLngRef.current = latlng;
        tooltip.setLatLng(latlng).openOn(map);
        bindTooltipHover(tooltip);
        return;
      }

      if (!tooltip.isOpen()) {
        tooltip
          .setLatLng(pinnedLatLngRef.current ?? latlng)
          .openOn(map);
        bindTooltipHover(tooltip);
      }
    },
    [bindTooltipHover, cells, hideTooltip, map, t],
  );

  const hoverHandlers = {
    mousemove(e: L.LeafletMouseEvent) {
      showTooltip(e.latlng);
    },
  };

  useMapEvents({
    mousemove(e) {
      showTooltip(e.latlng);
    },
  });

  useEffect(() => {
    const container = map.getContainer();
    const onLeave = () => hideTooltip();
    container.addEventListener("mouseleave", onLeave);
    return () => container.removeEventListener("mouseleave", onLeave);
  }, [hideTooltip, map]);

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
