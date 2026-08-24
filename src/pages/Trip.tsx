import { useState } from "react";
import { ArrowLeft, Clock, MapPin, TrainFront, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCpStationCode } from "@/data/cpStationCodes";
import { useNowMinute } from "@/hooks/useNowMinute";
import { useStationArrivals, useStationDepartures } from "@/hooks/useStationDepartures";
import { useTrainJourney } from "@/hooks/useTrainJourney";
import { useTripCompletion } from "@/hooks/useTripCompletion";
import { useLocale } from "@/i18n/LocaleProvider";
import { getStationNameByCpCode } from "@/lib/cpStationLookup";
import {
  formatArrivalCountdown,
  formatDepartureCountdown,
  formatDepartureTimeAgo,
  getEffectiveDepartureClock,
  getMinutesSinceDeparture,
  getMinutesUntilTime,
} from "@/lib/departureCountdown";
import { clearActiveTrip, useActiveTrip } from "@/lib/plannedDepartures";
import { getTripPageMeta } from "@/lib/pageMeta";
import { downstreamStopsFrom } from "@/lib/trainJourney";
import { defaultHomePath } from "@/lib/homeRoute";
import { getStationPath } from "@/lib/stationSlug";
import { deleteTripHistoryRecord, useTripHistory } from "@/lib/trainTripHistory";
import { getServiceTypeTextClass } from "@/lib/trainTypes";
import { allStations } from "@/data/stationRegistry";
import type { TrainJourneyStop } from "@/lib/trainJourney";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function stationPagePath(stationName: string): string | null {
  const station = allStations.find((entry) => entry.name === stationName);
  return station ? getStationPath(station) : null;
}

function TripStopRow({
  stop,
  isOrigin,
  delayMinutes,
  timetableDate,
  now,
}: {
  stop: TrainJourneyStop;
  isOrigin: boolean;
  delayMinutes: number | null;
  timetableDate: string;
  now: Date;
}) {
  const { t } = useLocale();
  const stationName = getStationNameByCpCode(stop.stationCode) ?? stop.stationName;
  const clockTime = isOrigin
    ? (stop.departureTime ?? stop.arrivalTime)
    : (stop.arrivalTime ?? stop.departureTime);
  const minutesUntil =
    clockTime !== null
      ? getMinutesUntilTime(clockTime, delayMinutes, now, timetableDate)
      : null;
  const countdownLabel =
    minutesUntil !== null
      ? isOrigin
        ? formatDepartureCountdown(minutesUntil, { t })
        : formatArrivalCountdown(minutesUntil, { t })
      : null;

  const content = (
    <>
      <p className="break-words font-medium text-foreground">{stationName}</p>
      <p className="mt-0.5 break-words text-sm text-muted-foreground tabular-nums">
        {isOrigin ? t("trip.departureAt", { time: clockTime ?? "—" }) : t("trip.arrivalAt", { time: clockTime ?? "—" })}
        {stop.platform ? ` · ${t("departures.platform")} ${stop.platform}` : ""}
      </p>
      {countdownLabel ? (
        <p className="mt-1 text-sm font-semibold text-primary">{countdownLabel}</p>
      ) : null}
    </>
  );

  const path = stationPagePath(stationName);
  return (
    <li className="rounded-lg border border-border bg-card px-4 py-3">
      {path ? (
        <Link to={path} className="block hover:text-primary">
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}

const Trip = () => {
  const { t, locale } = useLocale();
  const trip = useActiveTrip();
  const history = useTripHistory();
  const now = useNowMinute();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDelete = pendingDeleteId
    ? history.find((record) => record.id === pendingDeleteId) ?? null
    : null;

  const isMeet = trip?.purpose === "meet";
  const { data: departures } = useStationDepartures(trip?.stationName ?? "", 10);
  const { data: arrivals } = useStationArrivals(trip?.stationName ?? "", 10);
  const originCode = trip ? getCpStationCode(trip.stationName) : undefined;
  const { data: journey, isLoading, isError } = useTrainJourney(
    isMeet ? null : (trip?.trainNumber ?? null),
    isMeet ? null : (trip?.timetableDate ?? null),
    !isMeet && trip && originCode
      ? {
          originStationCode: originCode,
          departureTime: trip.departureTime,
          destinationName: trip.destination,
        }
      : undefined,
  );

  const liveDeparture = departures?.find(
    (dep) =>
      dep.trainNumber === trip?.trainNumber &&
      dep.time === trip?.departureTime &&
      dep.destination === trip?.destination,
  );
  const liveArrival = arrivals?.find(
    (arr) =>
      arr.trainNumber === trip?.trainNumber &&
      (arr.time === trip?.departureTime || arr.departureTime === trip?.departureTime),
  );
  const delayMinutes =
    liveDeparture?.delayMinutes ?? liveArrival?.delayMinutes ?? trip?.delayMinutes ?? null;
  const platform =
    liveDeparture?.platform ?? liveArrival?.platform ?? trip?.platform ?? null;
  const serviceType =
    liveDeparture?.serviceType ?? liveArrival?.serviceType ?? trip?.serviceType ?? "—";

  const downstreamStops =
    !isMeet && journey && originCode && trip
      ? downstreamStopsFrom(journey, originCode, {
          stationName: trip.stationName,
          departureTime: trip.departureTime,
          platform: platform ?? trip.platform ?? null,
        })
      : [];

  const hasConfirmedUpcomingStops =
    !isMeet && !isLoading && !isError && Boolean(journey) && downstreamStops.length > 1;

  useTripCompletion(isMeet ? null : trip, downstreamStops, delayMinutes, now, platform);

  const departureMinutesUntil = trip
    ? getMinutesUntilTime(trip.departureTime, delayMinutes, now, trip.timetableDate)
    : null;
  const departureCountdown =
    departureMinutesUntil !== null && departureMinutesUntil > 0
      ? isMeet
        ? formatArrivalCountdown(departureMinutesUntil, { t })
        : formatDepartureCountdown(departureMinutesUntil, { t })
      : null;
  const effectiveDepartureTime = trip
    ? getEffectiveDepartureClock(trip.departureTime, delayMinutes)
    : null;
  const minutesSinceDeparture = trip
    ? getMinutesSinceDeparture(trip.departureTime, delayMinutes, now, trip.timetableDate)
    : null;
  const hasDeparted = minutesSinceDeparture !== null;
  const showDepartedWithoutStops = hasDeparted && !hasConfirmedUpcomingStops;
  const departureTimeAgoLabel =
    minutesSinceDeparture !== null
      ? formatDepartureTimeAgo(minutesSinceDeparture, { t })
      : null;

  return (
    <>
      <PageHead meta={getTripPageMeta(locale)} />
      <div className="flex min-h-dvh flex-col bg-background">
        <header className="shrink-0 border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-4 md:px-6 md:py-8">
            <div className="mb-2 hidden sm:mb-4 sm:block">
              <Link
                to={defaultHomePath()}
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.backToStations")}
              </Link>
            </div>
            <div className="flex min-w-0 items-start gap-3">
              <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <h1 className="font-display text-2xl md:text-4xl">{t("trip.title")}</h1>
                <p className="mt-1 text-sm text-primary-foreground/85 sm:text-base">
                  {t("trip.subtitle")}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-4 sm:py-6 md:px-6 md:py-10">
          {!trip ? (
            <div className="w-full max-w-md rounded-lg border border-border bg-muted/30 p-6 text-center">
              <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-display text-xl text-foreground">{t("trip.emptyTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("trip.emptyBody")}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <section className="rounded-lg border border-border bg-card shadow-sm p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {showDepartedWithoutStops
                      ? isMeet
                        ? t("trip.arrived")
                        : t("trip.departed")
                      : isMeet
                        ? t("trip.arrivalCountdown")
                        : t("trip.departureCountdown")}
                  </p>
                  <button
                    type="button"
                    onClick={() => clearActiveTrip()}
                    className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {t("trip.stopTracking")}
                  </button>
                </div>
                <p className="mt-2 flex items-start gap-1.5 text-base font-medium text-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <Link
                    to={stationPagePath(trip.stationName) ?? defaultHomePath()}
                    className="min-w-0 break-words hover:text-primary hover:underline"
                  >
                    {trip.stationName}
                  </Link>
                </p>
                {showDepartedWithoutStops ? (
                  <>
                    <p className="mt-2 break-words font-display text-3xl text-primary tabular-nums sm:text-4xl md:text-5xl">
                      {effectiveDepartureTime
                        ? isMeet
                          ? t("trip.arrivedAt", { time: effectiveDepartureTime })
                          : t("trip.departedAt", { time: effectiveDepartureTime })
                        : isMeet
                          ? t("trip.arrivalAt", { time: trip.departureTime })
                          : t("trip.departureAt", { time: trip.departureTime })}
                    </p>
                    {departureTimeAgoLabel ? (
                      <p className="mt-1 text-lg font-semibold text-foreground tabular-nums">
                        {departureTimeAgoLabel}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="mt-2 break-words font-display text-3xl text-primary tabular-nums sm:text-4xl md:text-5xl">
                      {departureCountdown ??
                        (hasDeparted
                          ? effectiveDepartureTime
                            ? isMeet
                              ? t("trip.arrivedAt", { time: effectiveDepartureTime })
                              : t("trip.departedAt", { time: effectiveDepartureTime })
                            : isMeet
                              ? t("trip.arrivalAt", { time: trip.departureTime })
                              : t("trip.departureAt", { time: trip.departureTime })
                          : trip.departureTime)}
                    </p>
                    <p className="mt-1 break-words text-sm text-muted-foreground tabular-nums">
                      {isMeet
                        ? t("trip.arrivalAt", { time: trip.departureTime })
                        : t("trip.departureAt", { time: trip.departureTime })}
                      {delayMinutes !== null && delayMinutes > 0
                        ? ` · ${t("departures.delayMin", { minutes: delayMinutes })}`
                        : null}
                    </p>
                    {effectiveDepartureTime &&
                    delayMinutes !== null &&
                    delayMinutes > 0 &&
                    effectiveDepartureTime !== trip.departureTime ? (
                      <p className="mt-0.5 break-words text-sm text-muted-foreground tabular-nums">
                        {isMeet
                          ? t("trip.expectedArrival", { time: effectiveDepartureTime })
                          : t("trip.expectedDeparture", { time: effectiveDepartureTime })}
                      </p>
                    ) : null}
                  </>
                )}
                <p className="mt-3 break-words text-base text-foreground sm:text-lg">
                  {isMeet
                    ? `${t("departures.train")} ${trip.trainNumber} · ${t("arrivals.fromOrigin", { origin: trip.destination })}`
                    : `${t("departures.train")} ${trip.trainNumber} → ${trip.destination}`}
                </p>
                <p className="mt-1 break-words text-sm text-muted-foreground">
                  {serviceType}
                  {platform ? ` · ${t("departures.platform")} ${platform}` : ""}
                </p>
              </section>

              {hasConfirmedUpcomingStops ? (
                <section aria-labelledby="trip-stops-heading" className="flex flex-col">
                  <h2 id="trip-stops-heading" className="mb-3 font-display text-2xl text-foreground">
                    {t("trip.upcomingStops")}
                  </h2>
                  <ol className="space-y-2">
                    {downstreamStops.map((stop, index) => (
                      <TripStopRow
                        key={`${stop.stationCode}-${index}`}
                        stop={stop}
                        isOrigin={index === 0}
                        delayMinutes={delayMinutes}
                        timetableDate={trip.timetableDate}
                        now={now}
                      />
                    ))}
                  </ol>
                </section>
              ) : null}
            </div>
          )}

          <section className={trip ? "mt-6" : "mt-4"}>
            <h2 className="font-display text-xl text-foreground">{t("trip.historyTitle")}</h2>
            {history.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">{t("trip.historyEmpty")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {history.map((record) => {
                  const originPath = stationPagePath(record.stationName);
                  const finalPath = stationPagePath(record.finalStationName);
                  return (
                    <li
                      key={record.id}
                      className="flex flex-col gap-3 rounded-lg border border-border bg-card even:bg-muted p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {record.trainNumber} · {record.stationName} → {record.finalStationName}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                          <span className={cn(getServiceTypeTextClass(record.serviceType))}>
                            {record.serviceType ?? "—"}
                          </span> · {record.timetableDate} ·{" "}
                          {record.actualDepartureTime ?? record.departureTime}
                          {record.platform
                            ? ` · ${t("departures.platform")} ${record.platform}`
                            : ""}
                        </p>
                        {(originPath || finalPath) ? (
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            {originPath ? (
                              <Link to={originPath} className="text-primary hover:underline">
                                {t("trip.historyOriginLink")}
                              </Link>
                            ) : null}
                            {finalPath ? (
                              <Link to={finalPath} className="text-primary hover:underline">
                                {t("trip.historyFinalLink")}
                              </Link>
                            ) : null}
                          </div>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(record.id)}
                        className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        {t("trip.historyDelete")}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </main>

        <AlertDialog
          open={pendingDeleteId !== null}
          onOpenChange={(open) => {
            if (!open) setPendingDeleteId(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("trip.historyDeleteConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingDelete
                  ? t("trip.historyDeleteConfirmBody", {
                      train: pendingDelete.trainNumber,
                      origin: pendingDelete.stationName,
                      destination: pendingDelete.finalStationName,
                    })
                  : t("trip.historyDeleteConfirmBodyGeneric")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("trip.historyDeleteConfirmCancel")}</AlertDialogCancel>
              <AlertDialogAction
                className={cn(buttonVariants({ variant: "destructive" }))}
                onClick={() => {
                  if (pendingDeleteId) deleteTripHistoryRecord(pendingDeleteId);
                  setPendingDeleteId(null);
                }}
              >
                {t("trip.historyDelete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="hidden sm:block">
          <SiteFooter showIntro={false} />
        </div>
      </div>
    </>
  );
};

export default Trip;
