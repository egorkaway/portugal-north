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

function trainTooltipLabel(train: SpainTrainPosition, t: (key: string) => string): string {
  const type =
    train.serviceType ??
    (train.kind === "longDistance" ? t("map.spainTrainLongDistance") : t("map.spainTrainCercanias"));
  const id = train.line ? `${train.line} · ${train.label}` : train.label;
  let text = `${type} · ${id}`;
  if (train.nextStation) text += ` ${t("map.spainTrainTo")} ${train.nextStation}`;
  if (train.delayMinutes != null && train.delayMinutes > 0) text += ` (+${train.delayMinutes} min)`;
  return text;
}

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
            {trainTooltipLabel(train, t)}
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
