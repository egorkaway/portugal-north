import { ThumbsDown, ThumbsUp } from "lucide-react";
import type { Vote } from "@/hooks/useStationVote";

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
  return (
    <div className="flex items-center gap-1 shrink-0" aria-label={`Your vote on ${subjectLabel}`}>
      <button
        type="button"
        onClick={onUp}
        aria-label={`Upvote ${subjectLabel}`}
        aria-pressed={vote === "up"}
        title={vote === "up" ? "Remove your upvote" : "Upvote (only you can see this)"}
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
        aria-label={`Downvote ${subjectLabel}`}
        aria-pressed={vote === "down"}
        title={vote === "down" ? "Remove your downvote" : "Downvote (only you can see this)"}
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
