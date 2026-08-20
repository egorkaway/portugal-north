import { CircleMarker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useLocale } from "@/i18n/LocaleProvider";
import { formatReliabilityScore } from "@/lib/reliabilityScore";
import { stationToSlug } from "@/lib/stationSlug";
import type { StationActivityDot } from "@/lib/stationH3Map";

function reliabilityScoreColor(score: number): string {
  if (score >= 8) return "#059669";
  if (score >= 5) return "#D97706";
  return "#DC2626";
}

function dotBorderColor(score: number): string {
  if (score >= 8) return "#065F46";
  if (score >= 5) return "#92400E";
  return "#991B1B";
}

export function MapStationDotsLayer({ dots }: { dots: StationActivityDot[] }) {
  const navigate = useNavigate();
  const { t } = useLocale();

  return (
    <>
      {dots.map((dot) => (
        <CircleMarker
          key={dot.stationName}
          center={[dot.lat, dot.lng]}
          radius={5}
          pathOptions={{
            color: dotBorderColor(dot.score),
            fillColor: reliabilityScoreColor(dot.score),
            fillOpacity: 0.95,
            weight: 2,
          }}
          eventHandlers={{
            click: () => navigate(`/stations/${stationToSlug(dot.stationName)}`),
          }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            <div className="map-hex-tooltip__station">
              <p className="font-semibold text-foreground">{dot.stationName}</p>
              <p className="text-xs text-muted-foreground">
                {formatReliabilityScore(dot.score)}/10
              </p>
              <p className="text-xs text-muted-foreground">
                {t("map.tooltipMovements", { count: dot.movements })}
              </p>
              <p className="text-xs font-medium text-primary">{t("map.viewStation")}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}
