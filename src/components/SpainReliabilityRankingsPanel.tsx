import { AlertCircle, CircleGauge, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReliabilityRankingList } from "@/components/ReliabilityRankingsPanel";
import { spainStations } from "@/data/spain/stations";
import { useSpainReliabilityScores } from "@/hooks/useReliabilityScore";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  buildReliabilityRankingRows,
  buildSpainReliabilityRankings,
  downloadReliabilityRankingsCsv,
} from "@/lib/reliabilityScore";

export function SpainReliabilityRankingsPanel() {
  const { t } = useLocale();
  const { data, isLoading, isError } = useSpainReliabilityScores();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t("rankings.reliabilityLoading")}</p>;
  }

  if (isError || !data) {
    return (
      <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground md:mb-10">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{t("rankings.spainReliabilityUnavailable")}</p>
        </div>
      </div>
    );
  }

  const { top, bottom } = buildSpainReliabilityRankings(data.scores, data.movements);
  const allRows = buildReliabilityRankingRows(
    spainStations.map((station) => station.name),
    data.scores,
    data.movements,
  );

  if (top.length === 0) {
    return <p className="mb-6 text-sm text-muted-foreground md:mb-10">{t("rankings.noReliabilityData")}</p>;
  }

  return (
    <section aria-labelledby="spain-reliability-rankings-heading" className="mb-6 md:mb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CircleGauge className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="spain-reliability-rankings-heading" className="font-display text-2xl text-foreground">
            {t("rankings.spainReliabilityRankings")}
          </h2>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            downloadReliabilityRankingsCsv(allRows, "spain-station-reliability-rankings.csv")
          }
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {t("rankings.downloadReliabilityCsv")}
        </Button>
      </div>
      <p className="mb-3 text-sm text-muted-foreground md:mb-4">{t("rankings.spainReliabilityIntro")}</p>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <ReliabilityRankingList
          title={t("rankings.spainMostReliable")}
          emptyLabel={t("rankings.noReliabilityData")}
          items={top}
        />
        <ReliabilityRankingList
          title={t("rankings.spainLeastReliable")}
          emptyLabel={t("rankings.noReliabilityData")}
          items={bottom}
        />
      </div>
    </section>
  );
}
