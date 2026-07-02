import { ArrowLeft, Clock, MapPin, TrainFront, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { getCpStationCode } from "@/data/cpStationCodes";
import { useNowMinute } from "@/hooks/useNowMinute";
import { useStationDepartures } from "@/hooks/useStationDepartures";
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
import { allStations } from "@/data/stationRegistry";
import type { TrainJourneyStop } from "@/lib/trainJourney";

function stationPagePath(stationName: string): string | null {
  const station = allStations.find((entry) => entry.name === stationName);
  return station ? getStationPath(station) : null;
}

function TripStopRow({
  stop,
  isOrigin,
  delayMinutes,
  now,
}: {
  stop: TrainJourneyStop;
  isOrigin: boolean;
  delayMinutes: number | null;
  now: Date;
}) {
  const { t } = useLocale();
  const stationName = getStationNameByCpCode(stop.stationCode) ?? stop.stationName;
  const clockTime = isOrigin
    ? (stop.departureTime ?? stop.arrivalTime)
    : (stop.arrivalTime ?? stop.departureTime);
  const minutesUntil =
    clockTime !== null ? getMinutesUntilTime(clockTime, delayMinutes, now) : null;
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
  const { data: departures } = useStationDepartures(trip?.stationName ?? "", 10);
  const originCode = trip ? getCpStationCode(trip.stationName) : undefined;
  const { data: journey, isLoading, isError } = useTrainJourney(
    trip?.trainNumber ?? null,
    trip?.timetableDate ?? null,
    trip && originCode
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
  const delayMinutes = liveDeparture?.delayMinutes ?? trip?.delayMinutes ?? null;
  const platform = liveDeparture?.platform ?? trip?.platform ?? null;
  const serviceType = liveDeparture?.serviceType ?? trip?.serviceType ?? "—";

  const downstreamStops =
    journey && originCode && trip
      ? downstreamStopsFrom(journey, originCode, {
          stationName: trip.stationName,
          departureTime: trip.departureTime,
          platform: platform ?? trip.platform ?? null,
        })
      : [];

  const hasConfirmedUpcomingStops =
    !isLoading && !isError && Boolean(journey) && downstreamStops.length > 1;

  useTripCompletion(trip, downstreamStops, delayMinutes, now);

  const departureMinutesUntil = trip
    ? getMinutesUntilTime(trip.departureTime, delayMinutes, now)
    : null;
  const departureCountdown =
    departureMinutesUntil !== null && departureMinutesUntil > 0
      ? formatDepartureCountdown(departureMinutesUntil, { t })
      : null;
  const effectiveDepartureTime = trip
    ? getEffectiveDepartureClock(trip.departureTime, delayMinutes)
    : null;
  const minutesSinceDeparture = trip
    ? getMinutesSinceDeparture(trip.departureTime, delayMinutes, now)
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
            <div className="flex flex-1 items-center justify-center py-8 sm:py-12">
              <div className="w-full max-w-md rounded-lg border border-border bg-muted/30 p-6 text-center">
                <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
                <h2 className="font-display text-xl text-foreground">{t("trip.emptyTitle")}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{t("trip.emptyBody")}</p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <section className="shrink-0 rounded-lg border border-border bg-card p-5 md:p-6">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    {showDepartedWithoutStops ? t("trip.departed") : t("trip.departureCountdown")}
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
                        ? t("trip.departedAt", { time: effectiveDepartureTime })
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
                            ? t("trip.departedAt", { time: effectiveDepartureTime })
                            : t("trip.departureAt", { time: trip.departureTime })
                          : trip.departureTime)}
                    </p>
                    <p className="mt-1 break-words text-sm text-muted-foreground tabular-nums">
                      {t("trip.departureAt", { time: trip.departureTime })}
                      {delayMinutes !== null && delayMinutes > 0
                        ? ` · ${t("departures.delayMin", { minutes: delayMinutes })}`
                        : null}
                    </p>
                    {effectiveDepartureTime &&
                    delayMinutes !== null &&
                    delayMinutes > 0 &&
                    effectiveDepartureTime !== trip.departureTime ? (
                      <p className="mt-0.5 break-words text-sm text-muted-foreground tabular-nums">
                        {t("trip.expectedDeparture", { time: effectiveDepartureTime })}
                      </p>
                    ) : null}
                  </>
                )}
                <p className="mt-3 break-words text-base text-foreground sm:text-lg">
                  {t("departures.train")} {trip.trainNumber} → {trip.destination}
                </p>
                <p className="mt-1 break-words text-sm text-muted-foreground">
                  {serviceType}
                  {platform ? ` · ${t("departures.platform")} ${platform}` : ""}
                </p>
              </section>

              {hasConfirmedUpcomingStops ? (
                <section
                  aria-labelledby="trip-stops-heading"
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <h2 id="trip-stops-heading" className="mb-3 shrink-0 font-display text-2xl text-foreground">
                    {t("trip.upcomingStops")}
                  </h2>
                  <ol className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1 sm:max-h-none">
                    {downstreamStops.map((stop, index) => (
                      <TripStopRow
                        key={`${stop.stationCode}-${index}`}
                        stop={stop}
                        isOrigin={index === 0}
                        delayMinutes={delayMinutes}
                        now={now}
                      />
                    ))}
                  </ol>
                </section>
              ) : null}
            </div>
          )}

          <section className="mt-10">
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
                      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-start sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">
                          {record.trainNumber} · {record.stationName} → {record.finalStationName}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                          {record.timetableDate} · {record.departureTime}
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
                        onClick={() => deleteTripHistoryRecord(record.id)}
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

        <div className="hidden sm:block">
          <SiteFooter showIntro={false} />
        </div>
      </div>
    </>
  );
};

export default Trip;
