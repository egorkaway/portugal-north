import { AlertCircle, Gauge, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { useTrainReliabilitySpotlight } from "@/hooks/useTrainReliabilitySpotlight";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  formatTrainSpotlightDelay,
  type TrainSpotlightEntry,
} from "@/lib/trainReliabilitySpotlight";
import { stationToSlug } from "@/lib/stationSlug";

function MajorStationsList({ stations }: { stations: string[] }) {
  const { t } = useLocale();
  if (stations.length === 0) return null;

  return (
    <p className="mt-3 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{t("rankings.trainSpotlightMajorStations")}</span>
      {" "}
      {stations.map((name, index) => (
        <span key={name}>
          {index > 0 ? ", " : null}
          <Link to={`/stations/${stationToSlug(name)}`} className="hover:text-primary hover:underline">
            {name}
          </Link>
        </span>
      ))}
    </p>
  );
}

function TrainSpotlightCard({
  rank,
  entry,
  tone,
}: {
  rank: number;
  entry: TrainSpotlightEntry;
  tone: "good" | "bad";
}) {
  const { t } = useLocale();
  const toneClass =
    tone === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive";

  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-5">
      <div className="flex items-start gap-3">
        <TrainFront className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            <span className="mr-1.5 tabular-nums text-muted-foreground">{rank}.</span>
            {t("rankings.trainSpotlightTrainLabel", {
              number: entry.trainNumber,
              serviceType: entry.serviceType,
            })}
          </p>
          <p className={`mt-1 text-2xl font-semibold tabular-nums ${toneClass}`}>
            {t("rankings.trainSpotlightAvgDelay", {
              avg: formatTrainSpotlightDelay(entry.avgDelayMinutes),
            })}
          </p>
          <MajorStationsList stations={entry.majorStations} />
        </div>
      </div>
    </div>
  );
}

function SpotlightColumn({
  title,
  entries,
  tone,
  note,
}: {
  title: string;
  entries: TrainSpotlightEntry[];
  tone: "good" | "bad";
  note?: string;
}) {
  const { t } = useLocale();

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-foreground md:text-xl">{title}</h3>
      {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      {entries.length > 0 ? (
        entries.map((entry, index) => (
          <TrainSpotlightCard
            key={`${entry.trainNumber}|${entry.serviceType}`}
            rank={index + 1}
            entry={entry}
            tone={tone}
          />
        ))
      ) : (
        <div className="rounded-lg border border-border bg-card p-4 md:p-5">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{t("rankings.trainSpotlightNoData")}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function TrainReliabilitySpotlightPanel() {
  const { t } = useLocale();
  const { data, isLoading, isError } = useTrainReliabilitySpotlight();

  if (isLoading) {
    return <p className="mb-4 text-sm text-muted-foreground">{t("rankings.trainSpotlightLoading")}</p>;
  }

  if (isError || !data) return null;

  const { mostDelayed, mostReliable } = data;
  if (mostDelayed.length === 0 && mostReliable.length === 0) return null;

  const reliableNote =
    mostReliable[0]?.selectionMode === "rotating"
      ? t("rankings.trainSpotlightRotating", { runCount: data.runCount })
      : undefined;

  return (
    <section aria-labelledby="train-spotlight-heading" className="mb-6 md:mb-8">
      <div className="mb-4 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="train-spotlight-heading" className="font-display text-2xl text-foreground">
          {t("rankings.trainSpotlightTitle")}
        </h2>
      </div>
      <p className="mb-3 text-sm text-muted-foreground md:mb-4">{t("rankings.trainSpotlightIntro")}</p>
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
        <SpotlightColumn
          title={t("rankings.mostReliableTrain")}
          entries={mostReliable}
          tone="good"
          note={reliableNote}
        />
        <SpotlightColumn
          title={t("rankings.mostDelayedTrain")}
          entries={mostDelayed}
          tone="bad"
        />
      </div>
    </section>
  );
}
