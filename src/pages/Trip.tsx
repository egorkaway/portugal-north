import { ArrowLeft, Clock, MapPin, TrainFront } from "lucide-react";
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
  getMinutesUntilTime,
} from "@/lib/departureCountdown";
import { clearActiveTrip, useActiveTrip } from "@/lib/plannedDepartures";
import { downstreamStopsFrom } from "@/lib/trainJourney";
import { getStationPath } from "@/lib/stationSlug";
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
      <p className="font-medium text-foreground">{stationName}</p>
      <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">
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
  const { t } = useLocale();
  const trip = useActiveTrip();
  const now = useNowMinute();
  const { data: departures } = useStationDepartures(trip?.stationName ?? "", 10);
  const { data: journey, isLoading, isError } = useTrainJourney(
    trip?.trainNumber ?? null,
    trip?.timetableDate ?? null,
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

  const originCode = trip ? getCpStationCode(trip.stationName) : undefined;
  const downstreamStops =
    journey && originCode
      ? downstreamStopsFrom(journey, originCode)
      : [];

  useTripCompletion(trip, downstreamStops, delayMinutes, now);

  const departureMinutesUntil = trip
    ? getMinutesUntilTime(trip.departureTime, delayMinutes, now)
    : null;
  const departureCountdown =
    departureMinutesUntil !== null
      ? formatDepartureCountdown(departureMinutesUntil, { t })
      : null;

  return (
    <>
      <PageHead
        meta={{
          title: `${t("trip.title")} | ${t("site.name")}`,
          description: t("trip.emptyBody"),
        }}
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to="/pt"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.backToStations")}
              </Link>
            </div>
            <div className="flex items-start gap-3">
              <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
              <div>
                <h1 className="font-display text-2xl md:text-4xl">{t("trip.title")}</h1>
                <p className="mt-1 text-sm text-primary-foreground/85">{t("trip.subtitle")}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          {!trip ? (
            <div className="rounded-lg border border-border bg-muted/30 p-6 text-center">
              <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h2 className="font-display text-xl text-foreground">{t("trip.emptyTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("trip.emptyBody")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="rounded-lg border border-border bg-card p-5 md:p-6">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  {t("trip.departureCountdown")}
                </p>
                <p className="mt-2 font-display text-4xl text-primary tabular-nums md:text-5xl">
                  {departureCountdown ?? trip.departureTime}
                </p>
                <p className="mt-3 text-lg text-foreground">
                  {t("departures.train")} {trip.trainNumber} → {trip.destination}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {serviceType}
                  {platform ? ` · ${t("departures.platform")} ${platform}` : ""}
                  {delayMinutes !== null && delayMinutes > 0
                    ? ` · ${t("departures.delayMin", { minutes: delayMinutes })}`
                    : ""}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <Link to={stationPagePath(trip.stationName) ?? "/pt"} className="hover:text-primary hover:underline">
                    {trip.stationName}
                  </Link>
                </p>
                <button
                  type="button"
                  onClick={() => clearActiveTrip()}
                  className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  {t("trip.stopTracking")}
                </button>
              </section>

              <section aria-labelledby="trip-stops-heading">
                <h2 id="trip-stops-heading" className="mb-3 font-display text-2xl text-foreground">
                  {t("trip.upcomingStops")}
                </h2>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">{t("trip.loadingStops")}</p>
                ) : isError || downstreamStops.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t("trip.stopsUnavailable")}</p>
                ) : (
                  <ol className="space-y-2">
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
                )}
              </section>
            </div>
          )}
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default Trip;
