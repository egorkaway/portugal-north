import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapFitBounds } from "@/components/MapFitBounds";
import { MapHexLayer } from "@/components/MapHexLayer";
import { MapLocateControl } from "@/components/MapLocateControl";
import { MapPointLabels } from "@/components/MapPointLabels";
import { MapStationDotsLayer } from "@/components/MapStationDotsLayer";
import { SpainTrainsLayer } from "@/components/SpainTrainsLayer";
import { stations } from "@/data/stations";
import {
  useReliabilityScores,
  useSpainReliabilityScores,
} from "@/hooks/useReliabilityScore";
import { useSpainTrains } from "@/hooks/useSpainTrains";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  buildMapActivityHexData,
} from "@/lib/mapActivityStations";
import { buildMapLabelPoints } from "@/lib/mapLabels";
import {
  fetchAirportMapVisibility,
  getHiddenAirportIatasSync,
} from "@/lib/airportMapVisibility";
import {
  IBERIAN_MAP_BOUNDS,
  IBERIAN_MAP_CENTER,
  IBERIAN_MAP_ZOOM,
  downloadStationHexGeoJSON,
} from "@/lib/stationH3Map";
import "leaflet/dist/leaflet.css";

const LEGEND_TIERS = {
  busy: {
    fill: "hsl(215 16% 65%)",
    fillOpacity: 0.42,
    border: "hsl(215 18% 36%)",
    size: "h-2.5 w-2.5",
  },
  mid: {
    fill: "hsl(215 16% 65%)",
    fillOpacity: 0.55,
    border: "hsl(215 18% 36%)",
    size: "h-2.5 w-2.5",
  },
  quiet: {
    fill: "hsl(215 16% 65%)",
    fillOpacity: 0.92,
    border: "hsl(215 18% 36%)",
    size: "h-2 w-2",
  },
} as const;

const RELIABILITY_DOT_SWATCHES = {
  high: {
    fill: "#059669",
    border: "#065F46",
  },
  mid: {
    fill: "#D97706",
    border: "#92400E",
  },
  low: {
    fill: "#DC2626",
    border: "#991B1B",
  },
} as const;

const AIRPORT_LEGEND_SWATCH = {
  fill: "#0284C7",
  fillOpacity: 0.92,
  border: "#075985",
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
  const { data, isError } = useReliabilityScores();
  const { data: spainData, isError: isSpainError } = useSpainReliabilityScores();
  const { data: spainTrains } = useSpainTrains();
  const [hiddenAirportIatas, setHiddenAirportIatas] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    fetchAirportMapVisibility().then((manifest) => {
      if (cancelled) return;
      setHiddenAirportIatas(getHiddenAirportIatasSync(manifest));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const hexData = useMemo(
    () =>
      buildMapActivityHexData(data?.movements ?? {}, {
        portugalScores: data?.scores,
        portugalMovements: data?.movements,
        spainScores: spainData?.scores,
        spainMovements: spainData?.movements,
      }),
    [data?.movements, data?.scores, spainData?.movements, spainData?.scores],
  );

  const labelPoints = useMemo(() => {
    const airportLabels = Object.fromEntries(
      Object.entries(AIRPORT_LABEL_KEYS).map(([iata, key]) => [iata, t(key)]),
    ) as Record<string, string>;
    return buildMapLabelPoints(stations, airportLabels, { hiddenAirportIatas });
  }, [t, hiddenAirportIatas]);

  if (hexData.cells.length === 0 && hexData.dots.length === 0 && isError && isSpainError) {
    return <p className="text-sm text-muted-foreground">{t("map.unavailable")}</p>;
  }

  const { cells, dots, minMovements, maxMovements } = hexData;

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
          center={IBERIAN_MAP_CENTER}
          zoom={IBERIAN_MAP_ZOOM}
          maxBounds={IBERIAN_MAP_BOUNDS}
          minZoom={6}
          scrollWheelZoom
          className="z-0 h-[min(70vh,520px)] w-full"
        >
          <MapFitBounds bounds={IBERIAN_MAP_BOUNDS} />
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
          <MapStationDotsLayer dots={dots} />
          <MapPointLabels points={labelPoints} />
          {spainTrains?.trains.length ? (
            <SpainTrainsLayer trains={spainTrains.trains} />
          ) : null}
        </MapContainer>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{t("map.legendTitle")}</span>
        {(["busy", "mid"] as const).map((tier) => {
          const swatch = LEGEND_TIERS[tier];
          const label =
            tier === "busy"
              ? t("map.legendBusy")
              : t("map.legendMid");
          return (
            <span key={tier} className="inline-flex items-center gap-2">
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
        {(["high", "mid", "low"] as const).map((tier) => {
          const swatch = RELIABILITY_DOT_SWATCHES[tier];
          const label =
            tier === "high"
              ? t("map.legendReliableHigh")
              : tier === "mid"
                ? t("map.legendReliableMid")
                : t("map.legendReliableLow");
          return (
            <span key={tier} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full border-2"
                style={{
                  backgroundColor: swatch.fill,
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
            className={`inline-block rounded-sm border-2 ${LEGEND_TIERS.quiet.size}`}
            style={{
              backgroundColor: LEGEND_TIERS.quiet.fill,
              opacity: LEGEND_TIERS.quiet.fillOpacity,
              borderColor: LEGEND_TIERS.quiet.border,
            }}
            aria-hidden="true"
          />
          {t("map.legendQuiet")}
        </span>
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
        {spainTrains?.trains.length ? (
          <>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true">🚂</span>
              {t("map.legendSpainCercanias")}
            </span>
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true">🚆</span>
              {t("map.legendSpainLongDistance")}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}
