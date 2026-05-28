import { Check, MapPin } from "lucide-react";
import type { VoteControlSurface } from "@/lib/voteButtonStyles";
import { visitedButtonClassName } from "@/lib/voteButtonStyles";
import { useLocale } from "@/i18n/LocaleProvider";

export function VisitedButton({
  visited,
  onToggle,
  subjectLabel,
  compact,
  surface = "card",
}: {
  visited: boolean;
  onToggle: () => void;
  subjectLabel: string;
  /** Smaller label on station cards; full label on detail page. */
  compact?: boolean;
  surface?: VoteControlSurface;
}) {
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={visited}
      aria-label={
        visited
          ? t("visited.markNotVisited", { subject: subjectLabel })
          : t("visited.markVisited", { subject: subjectLabel })
      }
      title={
        visited
          ? t("visited.markNotVisited", { subject: subjectLabel })
          : t("visited.markVisited", { subject: subjectLabel })
      }
      className={visitedButtonClassName(visited, surface, compact)}
    >
      {visited ? (
        <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      )}
      <span className={compact ? "sr-only sm:not-sr-only" : undefined}>
        {visited ? t("visited.visited") : t("visited.notVisited")}
      </span>
    </button>
  );
}
