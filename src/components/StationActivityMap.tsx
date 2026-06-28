import { useMemo } from "react";
import { Download } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapHexLayer } from "@/components/MapHexLayer";
import { MapLocateControl } from "@/components/MapLocateControl";
import { MapPointLabels } from "@/components/MapPointLabels";
import { stations } from "@/data/stations";
import { useReliabilityScores } from "@/hooks/useReliabilityScore";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  buildMapActivityHexData,
} from "@/lib/mapActivityStations";
import { buildMapLabelPoints } from "@/lib/mapLabels";
import {
  PORTUGAL_MAP_BOUNDS,
  PORTUGAL_MAP_CENTER,
  PORTUGAL_MAP_ZOOM,
  downloadStationHexGeoJSON,
} from "@/lib/stationH3Map";
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

const AIRPORT_LEGEND_SWATCH = {
  fill: "hsl(25 92% 52%)",
  fillOpacity: 0.92,
  border: "hsl(25 88% 28%)",
} as const;

const AIRPORT_LABEL_KEYS = {
  LIS: "map.airportLis",
  OPO: "map.airportPorto",
  FAO: "map.airportFaro",
  MAD: "map.airportMad",
  BCN: "map.airportBarcelona",
  AGP: "map.airportMalaga",
  ALC: "map.airportAlicante",
  VLC: "map.airportValencia",
  SVQ: "map.airportSeville",
  BIO: "map.airportBilbao",
  SCQ: "map.airportSantiago",
  VGO: "map.airportVigo",
  OVD: "map.airportAsturias",
} as const;

export default function StationActivityMap() {
  const { t } = useLocale();
  const { data, isLoading, isError } = useReliabilityScores();

  const hexData = useMemo(() => {
    if (!data?.movements) return null;
    return buildMapActivityHexData(data.movements);
  }, [data?.movements]);

  const labelPoints = useMemo(() => {
    const airportLabels = Object.fromEntries(
      Object.entries(AIRPORT_LABEL_KEYS).map(([iata, key]) => [iata, t(key)]),
    ) as Record<string, string>;
    return buildMapLabelPoints(stations, airportLabels);
  }, [t]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t("map.loading")}</p>;
  }

  if (isError || !hexData || hexData.cells.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("map.unavailable")}</p>;
  }

  const { cells, minMovements, maxMovements } = hexData;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => downloadStationHexGeoJSON(cells)}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {t("map.downloadGeoJson")}
        </Button>
      </div>
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
          <MapLocateControl />
          <MapHexLayer
            cells={cells}
            minMovements={minMovements}
            maxMovements={maxMovements}
          />
          <MapPointLabels points={labelPoints} />
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
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full border-2"
            style={{
              backgroundColor: AIRPORT_LEGEND_SWATCH.fill,
              opacity: AIRPORT_LEGEND_SWATCH.fillOpacity,
              borderColor: AIRPORT_LEGEND_SWATCH.border,
            }}
            aria-hidden="true"
          />
          {t("map.legendAirports")}
        </span>
      </div>
    </div>
  );
}
