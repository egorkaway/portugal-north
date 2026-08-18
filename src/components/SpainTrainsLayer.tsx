import { divIcon } from "leaflet";
import { Marker, Tooltip } from "react-leaflet";
import type { SpainTrainPosition } from "@/lib/spainTrainPositions";
import { useLocale } from "@/i18n/LocaleProvider";

const CERCANIAS_EMOJI = "🚂";
const LONG_DISTANCE_EMOJI = "🚆";

const cercaniasIcon = divIcon({
  className: "spain-train-emoji",
  html: CERCANIAS_EMOJI,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const longDistanceIcon = divIcon({
  className: "spain-train-emoji spain-train-emoji--long",
  html: LONG_DISTANCE_EMOJI,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export function SpainTrainsLayer({ trains }: { trains: SpainTrainPosition[] }) {
  const { t } = useLocale();

  return (
    <>
      {trains.map((train) => (
        <Marker
          key={train.id}
          position={[train.lat, train.lng]}
          icon={train.kind === "longDistance" ? longDistanceIcon : cercaniasIcon}
        >
          <Tooltip direction="top" offset={[0, -10]}>
            {t("map.spainTrainTooltip", {
              label: train.line ? `${train.line} · ${train.label}` : train.label,
              kind:
                train.kind === "longDistance"
                  ? t("map.spainTrainLongDistance")
                  : t("map.spainTrainCercanias"),
            })}
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
