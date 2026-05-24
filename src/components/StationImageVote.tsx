import { ImageOff, Image as ImageIcon } from "lucide-react";
import type { Vote } from "@/hooks/useStationVote";
import { useGlobalImageRatings } from "@/hooks/useGlobalStationRatings";
import { useStationImageVote } from "@/hooks/useStationImageVote";

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

function formatImageTotals(up: number, down: number): string | null {
  if (up === 0 && down === 0) return null;
  const parts: string[] = [];
  if (up > 0) parts.push(`${up} good photo${up === 1 ? "" : "s"}`);
  if (down > 0) parts.push(`${down} not representative`);
  return parts.join(" · ");
}

export function StationImageVote({
  stationName,
  imageUrl,
}: {
  stationName: string;
  imageUrl: string;
}) {
  const { vote, cast } = useStationImageVote(stationName);
  const { data: global } = useGlobalImageRatings();
  const totals = global?.imageRatings[stationName];
  const communityLine = totals ? formatImageTotals(totals.up, totals.down) : null;

  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-border bg-muted">
      <div className="relative aspect-[21/9]">
        <img
          src={imageUrl}
          alt={`${stationName} train station`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4 sm:pt-12">
          <p className="mb-2 text-xs text-white/90 sm:mb-3 sm:text-sm">
            Does this photo represent {stationName}?
          </p>
          <StationImageVoteControls vote={vote} onGood={() => cast("up")} onBad={() => cast("down")} />
          <p className="mt-2 text-xs text-white/70">
            Your choice is remembered in this browser. Community totals are stored on our server to
            help pick better images.
          </p>
          {communityLine && (
            <p className="mt-1 text-xs text-white/80">Community: {communityLine}</p>
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
  return (
    <div
      className="flex gap-1.5 sm:flex-wrap sm:gap-2"
      role="group"
      aria-label="Rate whether the station photo is representative"
    >
      <ImageVoteButton
        active={vote === "up"}
        onClick={onGood}
        label="Good photo"
        shortLabel="Good"
        icon={ImageIcon}
        activeClassName="border-primary bg-primary text-primary-foreground"
      />
      <ImageVoteButton
        active={vote === "down"}
        onClick={onBad}
        label="Doesn't represent station"
        shortLabel="Not representative"
        icon={ImageOff}
        activeClassName="border-destructive bg-destructive text-destructive-foreground"
      />
    </div>
  );
}
