import { ImageOff, Image as ImageIcon } from "lucide-react";
import type { Vote } from "@/hooks/useStationVote";
import { useGlobalImageRatings } from "@/hooks/useGlobalStationRatings";
import { useStationImageVote } from "@/hooks/useStationImageVote";
import { useLocale } from "@/i18n/LocaleProvider";
import { StationPhoto } from "@/components/StationPhoto";

function ImageVoteButton({
  active,
  onClick,
  label,
  shortLabel,
  icon: Icon,
  activeClassName,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  shortLabel: string;
  icon: typeof ImageIcon;
  activeClassName: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex min-w-0 flex-1 items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors sm:flex-none sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm ${
        active
          ? activeClassName
          : "border-white/30 bg-black/40 text-white hover:bg-black/55"
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden="true" />
      <span className="truncate sm:hidden">{shortLabel}</span>
      <span className="hidden truncate sm:inline">{label}</span>
    </button>
  );
}

function formatImageTotals(
  up: number,
  down: number,
  t: ReturnType<typeof useLocale>["t"],
  plural: ReturnType<typeof useLocale>["plural"],
): string | null {
  if (up === 0 && down === 0) return null;
  const parts: string[] = [];
  if (up > 0) parts.push(plural("imageVote.goodPhotos", up, { count: up }));
  if (down > 0) parts.push(plural("imageVote.notRepresentative", down, { count: down }));
  return parts.join(" · ");
}

export function StationImageVote({
  stationName,
  imageUrl,
}: {
  stationName: string;
  imageUrl: string;
}) {
  const { t, plural } = useLocale();
  const { vote, cast } = useStationImageVote(stationName);
  const { data: global } = useGlobalImageRatings();
  const totals = global?.imageRatings[stationName];
  const communityLine = totals ? formatImageTotals(totals.up, totals.down, t, plural) : null;

  return (
    <div className="mb-5 overflow-hidden rounded-lg border border-border bg-muted md:mb-8">
      <div className="relative aspect-[2/1] sm:aspect-[21/9]">
        <StationPhoto
          src={imageUrl}
          alt={t("station.stationPhotoAlt", { name: stationName })}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 pb-2.5 pt-8 sm:px-4 sm:pb-4 sm:pt-12">
          <p className="mb-1.5 text-xs text-white/90 sm:mb-3 sm:text-sm">
            {t("imageVote.question", { name: stationName })}
          </p>
          <StationImageVoteControls vote={vote} onGood={() => cast("up")} onBad={() => cast("down")} />
          <p className="mt-2 text-xs text-white/70">{t("imageVote.browserNote")}</p>
          {communityLine && (
            <p className="mt-1 text-xs text-white/80">
              {t("imageVote.community", { summary: communityLine })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Labeled controls for reuse or testing */
export function StationImageVoteControls({
  vote,
  onGood,
  onBad,
}: {
  vote: Vote;
  onGood: () => void;
  onBad: () => void;
}) {
  const { t } = useLocale();

  return (
    <div
      className="flex gap-1.5 sm:flex-wrap sm:gap-2"
      role="group"
      aria-label={t("imageVote.rateLabel")}
    >
      <ImageVoteButton
        active={vote === "up"}
        onClick={onGood}
        label={t("imageVote.goodPhoto")}
        shortLabel={t("imageVote.goodShort")}
        icon={ImageIcon}
        activeClassName="border-emerald-500 bg-emerald-600 text-white"
      />
      <ImageVoteButton
        active={vote === "down"}
        onClick={onBad}
        label={t("imageVote.badPhoto")}
        shortLabel={t("imageVote.badShort")}
        icon={ImageOff}
        activeClassName="border-destructive bg-destructive text-destructive-foreground"
      />
    </div>
  );
}
