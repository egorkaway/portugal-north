import { AlertCircle, CircleGauge } from "lucide-react";
import { Link } from "react-router-dom";
import { useReliabilityScores } from "@/hooks/useReliabilityScore";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  getBottomReliabilityStations,
  getTopReliabilityStations,
  reliabilityScoreTone,
} from "@/lib/reliabilityScore";
import { stationToSlug } from "@/lib/stationSlug";

function ReliabilityRankingList({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: { name: string; score: number }[];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-5">
      <h3 className="mb-3 font-display text-lg text-foreground md:mb-4 md:text-xl">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ol className="space-y-2 md:space-y-3">
          {items.map((item, index) => (
            <li key={item.name} className="flex items-start justify-between gap-3">
              <p className="min-w-0 text-sm font-medium text-foreground">
                <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                <Link
                  to={`/stations/${stationToSlug(item.name)}`}
                  className="hover:text-primary hover:underline"
                >
                  {item.name}
                </Link>
              </p>
              <span
                className={`shrink-0 text-sm font-semibold tabular-nums ${reliabilityScoreTone(item.score)}`}
              >
                {item.score}/10
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function ReliabilityRankingsPanel() {
  const { t } = useLocale();
  const { data, isLoading, isError } = useReliabilityScores();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t("rankings.reliabilityLoading")}</p>;
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{t("rankings.reliabilityUnavailable")}</p>
        </div>
      </div>
    );
  }

  const top = getTopReliabilityStations(data.scores, data.movements, 10);
  const bottom = getBottomReliabilityStations(data.scores, data.movements, 10);

  if (top.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("rankings.noReliabilityData")}</p>;
  }

  return (
    <section aria-labelledby="reliability-rankings-heading" className="mb-6 md:mb-10">
      <div className="mb-4 flex items-center gap-2">
        <CircleGauge className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="reliability-rankings-heading" className="font-display text-2xl text-foreground">
          {t("rankings.reliabilityRankings")}
        </h2>
      </div>
      <p className="mb-3 text-sm text-muted-foreground md:mb-4">{t("rankings.reliabilityIntro")}</p>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <ReliabilityRankingList
          title={t("rankings.mostReliable")}
          emptyLabel={t("rankings.noReliabilityData")}
          items={top}
        />
        <ReliabilityRankingList
          title={t("rankings.leastReliable")}
          emptyLabel={t("rankings.noReliabilityData")}
          items={bottom}
        />
      </div>
    </section>
  );
}
