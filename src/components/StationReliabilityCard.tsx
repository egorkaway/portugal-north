import { Gauge } from "lucide-react";
import { useReliabilityScore } from "@/hooks/useReliabilityScore";
import {
  reliabilityScoreBarTone,
  reliabilityScoreTone,
  formatReliabilityScore,
} from "@/lib/reliabilityScore";
import { useLocale } from "@/i18n/LocaleProvider";

export function StationReliabilityCard({ stationName }: { stationName: string }) {
  const { t } = useLocale();
  const { score, hasCpCode, isLoading, isError } = useReliabilityScore(stationName);

  if (!hasCpCode || isError) return null;
  if (isLoading) {
    return (
      <section
        className="mb-6 rounded-lg border border-border bg-card p-4 md:mb-10 md:p-5"
        aria-labelledby="reliability-heading"
        aria-busy="true"
      >
        <p className="text-sm text-muted-foreground">{t("station.reliabilityLoading")}</p>
      </section>
    );
  }
  if (score === undefined) return null;

  const barWidth = `${score * 10}%`;

  return (
    <section
      className="mb-6 rounded-lg border border-border bg-card p-4 md:mb-10 md:p-5"
      aria-labelledby="reliability-heading"
    >
      <div className="flex items-start gap-3">
        <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id="reliability-heading" className="font-display text-xl text-foreground md:text-2xl">
            {t("station.reliabilityTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("station.reliabilityBody")}
          </p>
          <div className="mt-4 flex items-end gap-3">
            <p className={`text-4xl font-semibold tabular-nums ${reliabilityScoreTone(score)}`}>
              {formatReliabilityScore(score)}
              <span className="ml-1 text-lg font-medium text-muted-foreground">/10</span>
            </p>
            <div className="mb-1 min-w-0 flex-1">
              <div
                className="h-2 overflow-hidden rounded-full bg-muted"
                role="presentation"
                aria-hidden="true"
              >
                <div
                  className={`h-full rounded-full transition-all ${reliabilityScoreBarTone(score)}`}
                  style={{ width: barWidth }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t("station.reliabilityScale")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
