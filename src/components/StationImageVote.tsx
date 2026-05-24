import { ImageOff, Image as ImageIcon } from "lucide-react";
import type { Vote } from "@/hooks/useStationVote";
import { useStationImageVote } from "@/hooks/useStationImageVote";

function ImageVoteButton({
  active,
  onClick,
  label,
  icon: Icon,
  activeClassName,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
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
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? activeClassName
          : "border-white/30 bg-black/40 text-white hover:bg-black/55"
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </button>
  );
}

export function StationImageVote({
  stationName,
  imageUrl,
}: {
  stationName: string;
  imageUrl: string;
}) {
  const { vote, cast } = useStationImageVote(stationName);

  return (
    <div className="mb-8 overflow-hidden rounded-lg border border-border bg-muted">
      <div className="relative aspect-[21/9]">
        <img
          src={imageUrl}
          alt={`${stationName} train station`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-4 pt-12">
          <p className="mb-3 text-sm text-white/90">
            Does this photo represent {stationName}?
          </p>
          <StationImageVoteControls vote={vote} onGood={() => cast("up")} onBad={() => cast("down")} />
          <p className="mt-2 text-xs text-white/70">
            Your feedback is saved in this browser and helps us pick better images.
          </p>
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
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Rate whether the station photo is representative"
    >
      <ImageVoteButton
        active={vote === "up"}
        onClick={onGood}
        label="Good photo"
        icon={ImageIcon}
        activeClassName="border-primary bg-primary text-primary-foreground"
      />
      <ImageVoteButton
        active={vote === "down"}
        onClick={onBad}
        label="Doesn't represent station"
        icon={ImageOff}
        activeClassName="border-destructive bg-destructive text-destructive-foreground"
      />
    </div>
  );
}
