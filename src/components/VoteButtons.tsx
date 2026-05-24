import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { Vote } from "@/hooks/useStationVote";
import { useLocale } from "@/i18n/LocaleProvider";

export function VoteButtons({
  vote,
  onUp,
  onDown,
  subjectLabel,
}: {
  vote: Vote;
  onUp: () => void;
  onDown: () => void;
  subjectLabel: string;
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
        className={`p-1.5 rounded-md border transition-colors ${
          vote === "up"
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={onDown}
        aria-label={t("vote.downvote", { subject: subjectLabel })}
        aria-pressed={vote === "down"}
        title={vote === "down" ? t("vote.removeDownvote") : t("vote.downvoteOnlyYou")}
        className={`p-1.5 rounded-md border transition-colors ${
          vote === "down"
            ? "bg-destructive text-destructive-foreground border-destructive"
            : "bg-card text-muted-foreground border-border hover:border-destructive/40 hover:text-destructive"
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
