import { Clock, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getCpStationCode } from "@/data/cpStationCodes";
import { useNowMinute } from "@/hooks/useNowMinute";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useStationArrivals } from "@/hooks/useStationDepartures";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  canLoadMoreDepartures,
  INITIAL_DEPARTURES_LIMIT,
  nextDeparturesLimit,
} from "@/lib/departureLimits";
import {
  formatArrivalCountdown,
  formatDepartureCountdown,
  getMinutesUntilDeparture,
} from "@/lib/departureCountdown";
import { lisbonDateAndTime } from "@/lib/cpDeparturesParse";
import {
  buildPlannedDepartureId,
  toggleActiveTrip,
  useActiveTrip,
} from "@/lib/plannedDepartures";
import { getServiceTypeTextClass } from "@/lib/trainTypes";
import { cn } from "@/lib/utils";

function ArrivalRow({
  id,
  trainNumber,
  time,
  origin,
  destination,
  serviceType,
  platform,
  delayMinutes,
  terminatesHere,
  departureTime,
  active,
  timetableDate,
  onToggle,
  now,
}: {
  id: string;
  trainNumber: string;
  time: string;
  origin: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
  terminatesHere: boolean;
  departureTime: string | null;
  active: boolean;
  timetableDate: string;
  onToggle: () => void;
  now: Date;
}) {
  const { t } = useLocale();
  const trackTime = terminatesHere ? time : (departureTime ?? time);
  const minutesUntil = active
    ? getMinutesUntilDeparture(trackTime, delayMinutes, now, timetableDate)
    : null;
  const countdownLabel =
    minutesUntil !== null
      ? terminatesHere
        ? formatArrivalCountdown(minutesUntil, { t })
        : formatDepartureCountdown(minutesUntil, { t })
      : null;

  return (
    <li className="flex items-start justify-between gap-3 rounded-md border border-border bg-card even:bg-muted px-3 py-2.5 md:px-4 md:py-3">
      <div className="min-w-0">
        <p className="font-medium text-foreground tabular-nums">
          {departureTime && departureTime !== time ? (
            <>
              <span>{time}</span>
              <span className="mx-1.5 text-muted-foreground font-normal">→</span>
              <span>{departureTime}</span>
            </>
          ) : (
            time
          )}
          {countdownLabel ? (
            <span className="ml-2 text-sm font-semibold text-primary">{countdownLabel}</span>
          ) : null}
        </p>
        <p className="mt-0.5 text-sm text-foreground truncate">
          {terminatesHere
            ? t("arrivals.fromOrigin", { origin })
            : t("arrivals.continuesTo", { origin, destination })}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className={cn(getServiceTypeTextClass(serviceType))}>{serviceType}</span> · {t("departures.train")} {trainNumber}
          {platform ? ` · ${t("departures.platform")} ${platform}` : ""}
          {terminatesHere ? ` · ${t("arrivals.terminates")}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <button
          type="button"
          aria-pressed={active}
          onClick={onToggle}
          className={
            active
              ? "rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"
              : "rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted"
          }
        >
          {terminatesHere
            ? active
              ? t("arrivals.meeting")
              : t("arrivals.meet")
            : active
              ? t("departures.taking")
              : t("departures.take")}
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

export function StationArrivals({ stationName }: { stationName: string }) {
  const { t } = useLocale();
  const online = useOnlineStatus();
  const stationCode = getCpStationCode(stationName);
  const [limit, setLimit] = useState(INITIAL_DEPARTURES_LIMIT);
  const { data, isLoading, isError, isFetching, refetch } = useStationArrivals(
    stationName,
    limit,
  );
  const now = useNowMinute();
  const activeTrip = useActiveTrip();

  useEffect(() => {
    setLimit(INITIAL_DEPARTURES_LIMIT);
  }, [stationName]);

  const { date: today } = lisbonDateAndTime(now);
  const arrivals = useMemo(() => {
    return (data ?? []).map((arr) => {
      const trackTime = arr.terminatesHere ? arr.time : (arr.departureTime ?? arr.time);
      const purpose = arr.terminatesHere ? ("meet" as const) : ("take" as const);
      return {
        ...arr,
        trackTime,
        purpose,
        id: buildPlannedDepartureId(
          stationName,
          arr.trainNumber,
          trackTime,
          arr.terminatesHere ? arr.origin : arr.destination,
          today,
        ),
        timetableDate: today,
      };
    });
  }, [data, stationName, today]);

  const showLoadMore = !isLoading && !isError && canLoadMoreDepartures(limit, arrivals.length);
  const loadingMore = isFetching && !isLoading;

  if (!stationCode || !online) {
    return null;
  }

  // Hide the whole section until we have at least one arrival (no empty/error shell).
  if (isLoading || isError || !data?.length) {
    return null;
  }

  return (
    <section className="mb-6 md:mb-10" aria-labelledby="arrivals-heading">
      <div className="mb-3 flex items-center justify-between gap-2 md:mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="arrivals-heading" className="font-display text-xl text-foreground md:text-2xl">
            {t("arrivals.title")}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
          {t("departures.refresh")}
        </button>
      </div>

      <ul className="space-y-1.5 md:space-y-2">
        {arrivals.map((arr) => (
          <ArrivalRow
            key={arr.id}
            {...arr}
            active={activeTrip?.stationName === stationName && activeTrip.id === arr.id}
            onToggle={() => {
              toggleActiveTrip(stationName, {
                id: arr.id,
                trainNumber: arr.trainNumber,
                departureTime: arr.trackTime,
                destination: arr.terminatesHere ? arr.origin : arr.destination,
                serviceType: arr.serviceType,
                platform: arr.platform,
                delayMinutes: arr.delayMinutes,
                timetableDate: arr.timetableDate,
                purpose: arr.purpose,
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
    </section>
  );
}
