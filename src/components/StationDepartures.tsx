import { Clock, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCpStationCode } from "@/data/cpStationCodes";
import { useNowMinute } from "@/hooks/useNowMinute";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useStationDepartures } from "@/hooks/useStationDepartures";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  canLoadMoreDepartures,
  INITIAL_DEPARTURES_LIMIT,
  nextDeparturesLimit,
} from "@/lib/departureLimits";
import {
  formatDepartureCountdown,
  getMinutesUntilDeparture,
} from "@/lib/departureCountdown";
import { lisbonDateAndTime } from "@/lib/cpDeparturesParse";
import {
  buildPlannedDepartureId,
  toggleActiveTrip,
  useActiveTrip,
} from "@/lib/plannedDepartures";

function DepartureRow({
  id,
  trainNumber,
  time,
  destination,
  serviceType,
  platform,
  delayMinutes,
  taking,
  timetableDate,
  onToggleTaking,
  now,
}: {
  id: string;
  trainNumber: string;
  time: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
  taking: boolean;
  timetableDate: string;
  onToggleTaking: (id: string) => void;
  now: Date;
}) {
  const { t } = useLocale();

  const minutesUntil = taking
    ? getMinutesUntilDeparture(time, delayMinutes, now, timetableDate)
    : null;
  const countdownLabel =
    minutesUntil !== null ? formatDepartureCountdown(minutesUntil, { t }) : null;

  return (
    <li className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-3 py-2.5 md:px-4 md:py-3">
      <div className="min-w-0">
        <p className="font-medium text-foreground tabular-nums">
          {time}
          {countdownLabel ? (
            <span className="ml-2 text-sm font-semibold text-primary">{countdownLabel}</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-sm text-foreground truncate">→ {destination}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {serviceType} · {t("departures.train")} {trainNumber}
          {platform ? ` · ${t("departures.platform")} ${platform}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <button
          type="button"
          aria-pressed={taking}
          onClick={() => onToggleTaking(id)}
          className={
            taking
              ? "rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"
              : "rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
          }
        >
          {taking ? t("departures.taking") : t("departures.take")}
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
  const [limit, setLimit] = useState(INITIAL_DEPARTURES_LIMIT);
  const { data, isLoading, isError, isFetching, refetch, error } = useStationDepartures(
    stationName,
    limit,
  );
  const now = useNowMinute();
  const activeTrip = useActiveTrip();

  useEffect(() => {
    setLimit(INITIAL_DEPARTURES_LIMIT);
  }, [stationName]);

  const { date: today } = lisbonDateAndTime(now);
  const departures = useMemo(() => {
    return (data ?? []).map((dep) => ({
      ...dep,
      id: buildPlannedDepartureId(
        stationName,
        dep.trainNumber,
        dep.time,
        dep.destination,
        today,
      ),
      timetableDate: today,
    }));
  }, [data, stationName, today]);

  const showLoadMore = !isLoading && !isError && canLoadMoreDepartures(limit, departures.length);
  const loadingMore = isFetching && !isLoading;

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
        <>
          <ul className="space-y-1.5 md:space-y-2">
            {departures.map((dep) => (
              <DepartureRow
                key={dep.id}
                {...dep}
                taking={activeTrip?.stationName === stationName && activeTrip.id === dep.id}
                onToggleTaking={() => {
                  toggleActiveTrip(stationName, {
                    id: dep.id,
                    trainNumber: dep.trainNumber,
                    departureTime: dep.time,
                    destination: dep.destination,
                    serviceType: dep.serviceType,
                    platform: dep.platform,
                    delayMinutes: dep.delayMinutes,
                    timetableDate: dep.timetableDate,
                  });
                }}
                now={now}
              />
            ))}
          </ul>
          {showLoadMore && (
            <button
              type="button"
              onClick={() => setLimit(nextDeparturesLimit(limit))}
              disabled={loadingMore}
              className="mt-3 w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted disabled:opacity-60 md:mt-4"
            >
              {loadingMore ? t("departures.loadingMore") : t("departures.loadMore")}
            </button>
          )}
        </>
      )}
    </section>
  );
}
