import { useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Polygon, TileLayer, Tooltip } from "react-leaflet";
import { stations } from "@/data/stations";
import { useReliabilityScores } from "@/hooks/useReliabilityScore";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  PORTUGAL_MAP_BOUNDS,
  PORTUGAL_MAP_CENTER,
  PORTUGAL_MAP_ZOOM,
  buildStationHexCells,
  hexPathStyle,
} from "@/lib/stationH3Map";
import { stationToSlug } from "@/lib/stationSlug";
import "leaflet/dist/leaflet.css";

const LEGEND_SWATCHES = {
  5: {
    fill: "hsl(145 58% 50%)",
    fillOpacity: 0.42,
    border: "hsl(145 82% 26%)",
    size: "h-3 w-3",
  },
  7: {
    fill: "hsl(210 52% 46%)",
    fillOpacity: 0.55,
    border: "hsl(210 72% 18%)",
    size: "h-2.5 w-2.5",
  },
  9: {
    fill: "hsl(275 48% 34%)",
    fillOpacity: 0.92,
    border: "hsl(275 68% 10%)",
    size: "h-2 w-2",
  },
} as const;

export default function StationActivityMap() {
  const { t } = useLocale();
  const { data, isLoading, isError } = useReliabilityScores();

  const hexData = useMemo(() => {
    if (!data?.movements) return null;
    return buildStationHexCells(stations, data.movements);
  }, [data?.movements]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t("map.loading")}</p>;
  }

  if (isError || !hexData || hexData.cells.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("map.unavailable")}</p>;
  }

  const { cells, minMovements, maxMovements } = hexData;

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border shadow-sm">
        <MapContainer
          center={PORTUGAL_MAP_CENTER}
          zoom={PORTUGAL_MAP_ZOOM}
          maxBounds={PORTUGAL_MAP_BOUNDS}
          minZoom={6}
          scrollWheelZoom
          className="z-0 h-[min(70vh,520px)] w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
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
              >
                <Tooltip sticky>
                  <span className="font-medium">{cell.stationName}</span>
                  <br />
                  {t("map.tooltipMovements", { count: cell.movements })}
                  <br />
                  {t("map.tooltipResolution", { resolution: cell.resolution })}
                  <br />
                  <Link
                    to={`/stations/${stationToSlug(cell.stationName)}`}
                    className="text-primary underline"
                  >
                    {t("map.viewStation")}
                  </Link>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{t("map.legendTitle")}</span>
        {([5, 7, 9] as const).map((resolution) => {
          const swatch = LEGEND_SWATCHES[resolution];
          const label =
            resolution === 5
              ? t("map.legendBusy")
              : resolution === 7
                ? t("map.legendMid")
                : t("map.legendQuiet");
          return (
            <span key={resolution} className="inline-flex items-center gap-2">
              <span
                className={`inline-block rounded-sm border-2 ${swatch.size}`}
                style={{
                  backgroundColor: swatch.fill,
                  opacity: swatch.fillOpacity,
                  borderColor: swatch.border,
                }}
                aria-hidden="true"
              />
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
