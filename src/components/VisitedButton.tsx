import { Check, MapPin } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";

export function VisitedButton({
  visited,
  onToggle,
  subjectLabel,
  compact,
}: {
  visited: boolean;
  onToggle: () => void;
  subjectLabel: string;
  /** Smaller label on station cards; full label on detail page. */
  compact?: boolean;
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
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors shrink-0 ${
        visited
          ? "border-amber-600 bg-amber-500 text-white hover:bg-amber-500/90"
          : "border-border bg-card text-muted-foreground hover:border-amber-600/50 hover:text-amber-800 dark:hover:text-amber-200"
      }`}
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
