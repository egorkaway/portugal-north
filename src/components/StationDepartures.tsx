import { Clock, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { getCpStationCode } from "@/data/cpStationCodes";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useStationDepartures } from "@/hooks/useStationDepartures";
import { useLocale } from "@/i18n/LocaleProvider";
import { getPlannedDepartureIds, togglePlannedDepartureId } from "@/lib/plannedDepartures";

function DepartureRow({
  id,
  trainNumber,
  time,
  destination,
  serviceType,
  platform,
  delayMinutes,
  planned,
  onTogglePlanned,
}: {
  id: string;
  trainNumber: string;
  time: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
  planned: boolean;
  onTogglePlanned: (id: string) => void;
}) {
  const { t } = useLocale();

  return (
    <li className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-3 py-2.5 md:px-4 md:py-3">
      <div className="min-w-0">
        <p className="font-medium text-foreground tabular-nums">{time}</p>
        <p className="mt-0.5 text-sm text-foreground truncate">→ {destination}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {serviceType} · {t("departures.train")} {trainNumber}
          {platform ? ` · ${t("departures.platform")} ${platform}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <button
          type="button"
          aria-pressed={planned}
          onClick={() => onTogglePlanned(id)}
          className={
            planned
              ? "rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"
              : "rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
          }
        >
          {planned ? t("departures.planned") : t("departures.plan")}
        </button>
        {delayMinutes !== null && (
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
            {t("departures.delayMin", { minutes: delayMinutes })}
          </span>
        )}
      </div>
    </li>
  );
}

export function StationDepartures({ stationName }: { stationName: string }) {
  const { t } = useLocale();
  const online = useOnlineStatus();
  const stationCode = getCpStationCode(stationName);
  const { data, isLoading, isError, isFetching, refetch, error } = useStationDepartures(stationName);
  const [plannedIds, setPlannedIds] = useState<Set<string>>(() =>
    getPlannedDepartureIds(stationName),
  );

  const departures = useMemo(() => {
    return (data ?? []).map((dep) => ({
      ...dep,
      id: `${stationName}|${dep.trainNumber}|${dep.time}|${dep.destination}`,
    }));
  }, [data, stationName]);

  if (!stationCode || !online) {
    return null;
  }

  return (
    <section className="mb-6 md:mb-10" aria-labelledby="departures-heading">
      <div className="mb-3 flex items-center justify-between gap-2 md:mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="departures-heading" className="font-display text-xl text-foreground md:text-2xl">
            {t("departures.title")}
          </h2>
        </div>
        {!isLoading && !isError && (
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
            {t("departures.refresh")}
          </button>
        )}
      </div>

      {isLoading && (
        <ul className="space-y-1.5 md:space-y-2" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="h-[3.75rem] animate-pulse rounded-md border border-border bg-muted/40 md:h-[4.25rem]"
            />
          ))}
        </ul>
      )}

      {isError && (
        <p className="text-sm text-muted-foreground" role="status">
          {t("departures.unavailable")}
          {error instanceof Error && import.meta.env.DEV ? ` (${error.message})` : ""}.
        </p>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <p className="text-sm text-muted-foreground" role="status">
          {t("departures.none")}
        </p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-1.5 md:space-y-2">
          {departures.map((dep) => (
            <DepartureRow
              key={dep.id}
              {...dep}
              planned={plannedIds.has(dep.id)}
              onTogglePlanned={(id) => {
                setPlannedIds(togglePlannedDepartureId(stationName, id));
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
