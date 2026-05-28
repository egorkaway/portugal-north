import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { Vote } from "@/hooks/useStationVote";
import type { VoteControlSurface } from "@/lib/voteButtonStyles";
import {
  voteDownButtonClassName,
  voteUpButtonClassName,
} from "@/lib/voteButtonStyles";
import { useLocale } from "@/i18n/LocaleProvider";

export function VoteButtons({
  vote,
  onUp,
  onDown,
  subjectLabel,
  surface = "card",
}: {
  vote: Vote;
  onUp: () => void;
  onDown: () => void;
  subjectLabel: string;
  /** `primary` for green station headers; default for cards and hotel rows. */
  surface?: VoteControlSurface;
}) {
  const { t } = useLocale();

  return (
    <div
      className="flex items-center gap-1 shrink-0"
      aria-label={t("vote.yourVoteOn", { subject: subjectLabel })}
    >
      <button
        type="button"
        onClick={onUp}
        aria-label={t("vote.upvote", { subject: subjectLabel })}
        aria-pressed={vote === "up"}
        title={vote === "up" ? t("vote.removeUpvote") : t("vote.upvoteOnlyYou")}
        className={voteUpButtonClassName(vote, surface)}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onDown}
        aria-label={t("vote.downvote", { subject: subjectLabel })}
        aria-pressed={vote === "down"}
        title={vote === "down" ? t("vote.removeDownvote") : t("vote.downvoteOnlyYou")}
        className={voteDownButtonClassName(vote, surface)}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
