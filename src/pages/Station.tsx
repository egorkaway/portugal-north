import { ArrowLeft, BedDouble, CloudSun, MapPin, Train, Plane, ExternalLink, Navigation, History, Download } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getAppleMapsUrl,
  getBookingSearchUrl,
  getOSMUrl,
} from "@/data/stations";
import { getHotelsForStation } from "@/lib/stationHotels";
import {
  getStationImageUrl,
  getStationShareImageUrl,
  hasRepresentativeStationImage,
} from "@/lib/stationImage";
import { HotelList } from "@/components/HotelList";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { StationDepartures } from "@/components/StationDepartures";
import { StationReliabilityCard } from "@/components/StationReliabilityCard";
import { StationViewTracker } from "@/components/StationViewTracker";
import { StationImageVote } from "@/components/StationImageVote";
import { StationPhoto } from "@/components/StationPhoto";
import { VoteButtons } from "@/components/VoteButtons";
import { VisitedButton } from "@/components/VisitedButton";
import { useStationVote } from "@/hooks/useStationVote";
import { useStationVisited } from "@/hooks/useStationVisited";
import { PageHead } from "@/components/PageHead";
import { buildStationPageMeta } from "@/lib/pageMeta";
import { useLocale } from "@/i18n/LocaleProvider";
import { JsonLd } from "@/components/JsonLd";
import { buildStationStructuredData } from "@/lib/structuredData";
import { getStationBySlug } from "@/lib/stationSlug";
import { getTripHistorianStationUrl } from "@/lib/tripHistorian";
import { isAirportStation, showsTravelEsimPromo } from "@/lib/airportStation";
import { getMetroOperatorLink, isMetroStation } from "@/lib/metroStation";
import { StationYesimPromo } from "@/components/StationYesimPromo";
import { AirportConnectionsPanel } from "@/components/AirportConnectionsPanel";
import { NearestLongDistanceStations } from "@/components/NearestLongDistanceStations";
import { NearestStations } from "@/components/NearestStations";
import { getBerrymetCityLink } from "@/lib/berrymetCity";
import { buildHomePath } from "@/lib/homeRoute";
import { homeScopeForStationCountry, isCountryCode } from "@/lib/countries";
import { getStationSummary } from "@/lib/stationSummary";
import { getStationMapImagePath } from "@/lib/stationMapImage";
import {
  getStationPhotoAlt,
  shouldShowStationImageCredit,
} from "@/lib/stationImageAttribution";
import { StationImageCredit } from "@/components/StationImageCredit";
import { getStationLineLinks } from "@/lib/trainLines";
import { TRAIN_TYPE_BADGE_CLASSES } from "@/lib/trainTypes";
import { isAirportHubStation } from "@/lib/airportTypes";

const Station = () => {
  const { t, locale } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const station = slug ? getStationBySlug(slug) : undefined;

  if (!station) {
    return <Navigate to="/404" replace />;
  }

  const hotels = getHotelsForStation(station.name);
  const tripHistorianUrl = getTripHistorianStationUrl(station.name);
  const metroStation = isMetroStation(station);
  const airportStation = isAirportStation(station);
  const showYesimPromo = showsTravelEsimPromo(station);
  const berrymetCityLink = getBerrymetCityLink(station);
  const stationSummary = getStationSummary(station.name, locale);
  const LineIcon = airportStation ? Plane : Train;
  const lineLinks = getStationLineLinks(station);
  const metroLink = getMetroOperatorLink(station);
  const imageUrl = getStationImageUrl(station.name);
  const shareImageUrl = getStationShareImageUrl(station.name);
  const photoAlt = getStationPhotoAlt(station.name, imageUrl, t);
  const showImageCredit = shouldShowStationImageCredit(imageUrl);
  const showPhotoVote = hasRepresentativeStationImage(station.name);
  const { vote, cast } = useStationVote(station.name);
  const { visited, toggle: toggleVisited } = useStationVisited(station.name);
  const pageMeta = buildStationPageMeta(station, hotels, shareImageUrl, locale);
  const structuredData = buildStationStructuredData({
    station,
    slug: slug!,
    hotels,
    imageUrl: shareImageUrl,
  });

  return (
    <>
      <PageHead meta={pageMeta} />
      <JsonLd data={structuredData} />
      <StationViewTracker
        stationName={station.name}
        slug={slug!}
        hotelCount={hotels.length}
        lineCount={station.lines.length}
      />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to={buildHomePath(homeScopeForStationCountry(station.country))}
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.allStations")}
              </Link>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-2xl md:text-4xl">{station.name}</h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-primary-foreground/85 md:mt-2">
                  <LineIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    {lineLinks.length === 0
                      ? null
                      : lineLinks.map((item, index) => (
                          <span key={`${item.name}-${index}`}>
                            {index > 0 ? (
                              <span className="text-primary-foreground/50"> · </span>
                            ) : null}
                            {item.path ? (
                              <Link
                                to={item.path}
                                className="underline decoration-primary-foreground/40 underline-offset-2 transition-colors hover:text-primary-foreground hover:decoration-primary-foreground"
                              >
                                {item.name}
                              </Link>
                            ) : (
                              item.name
                            )}
                          </span>
                        ))}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <SitePageNavLinks variant="hero" />
                <VoteButtons
                  vote={vote}
                  onUp={() => cast("up")}
                  onDown={() => cast("down")}
                  subjectLabel={station.name}
                  surface="primary"
                />
                <VisitedButton
                  visited={visited}
                  onToggle={toggleVisited}
                  subjectLabel={station.name}
                  surface="primary"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          {showPhotoVote ? (
            <StationImageVote
              stationName={station.name}
              imageUrl={imageUrl}
              photoAlt={photoAlt}
            />
          ) : (
            <div className="mb-5 overflow-hidden rounded-lg border border-border bg-muted md:mb-8">
              <StationPhoto
                src={imageUrl}
                alt={photoAlt}
                className="aspect-[2/1] w-full object-cover sm:aspect-[21/9]"
              />
            </div>
          )}

          <div className="mb-5 flex flex-wrap gap-1.5 md:mb-8">
            {station.types.map((type) => (
              <span
                key={type}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TRAIN_TYPE_BADGE_CLASSES[type] || "bg-muted text-muted-foreground"}`}
              >
                {type}
              </span>
            ))}
          </div>

          {(stationSummary || showImageCredit) ? (
            <div className="mb-5 md:mb-8">
              {stationSummary ? (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {stationSummary}
                </p>
              ) : null}
              {showImageCredit ? <StationImageCredit imageUrl={imageUrl} /> : null}
            </div>
          ) : null}

          {!airportStation ? <StationDepartures stationName={station.name} /> : null}
          {!airportStation ? <StationReliabilityCard stationName={station.name} /> : null}
          <NearestLongDistanceStations station={station} />
          {isAirportHubStation(station) ? <AirportConnectionsPanel station={station} /> : null}
          <NearestStations station={station} />

          <div className="mb-6 flex flex-wrap gap-2 md:mb-10">
            <a
              href={getAppleMapsUrl(station)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground/5 px-3 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {t("station.appleMaps")}
            </a>
            <a
              href={getOSMUrl(station)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground/5 px-3 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              {t("station.openStreetMap")}
            </a>
            {berrymetCityLink ? (
              <a
                href={berrymetCityLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 px-3 py-2 text-sm font-medium text-sky-800 transition-colors hover:bg-sky-600 hover:text-white dark:text-sky-200"
              >
                <CloudSun className="h-4 w-4" aria-hidden="true" />
                {t("station.berrymetWeather", { city: berrymetCityLink.cityName })}
              </a>
            ) : null}
            {metroLink ? (
              <a
                href={metroLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-violet-600/10 px-3 py-2 text-sm font-medium text-violet-800 transition-colors hover:bg-violet-600 hover:text-white dark:text-violet-200"
              >
                <Train className="h-4 w-4" aria-hidden="true" />
                {t(metroLink.labelKey)}
              </a>
            ) : null}
            {!metroStation && !airportStation && tripHistorianUrl ? (
              <a
                href={tripHistorianUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-foreground/5 px-3 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <History className="h-4 w-4" aria-hidden="true" />
                {t("station.tripHistorian")}
              </a>
            ) : null}
            <a
              href={getBookingSearchUrl(station)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <BedDouble className="h-4 w-4" aria-hidden="true" />
              {t("station.searchBooking")}
            </a>
          </div>

          {hotels.length > 0 && (
            <section aria-labelledby="hotels-heading">
              <div className="mb-3 flex items-center gap-2 md:mb-4">
                <BedDouble className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 id="hotels-heading" className="font-display text-xl text-foreground md:text-2xl">
                  {t("station.budgetStays")}
                </h2>
              </div>
              <p className="mb-4 text-sm text-muted-foreground md:mb-6">{t("station.hotelsIntro")}</p>
              <HotelList stationName={station.name} hotels={hotels} />
            </section>
          )}

          {showYesimPromo ? <StationYesimPromo /> : null}

          <section className="mt-8 md:mt-10" aria-labelledby="area-map-heading">
            <h2 id="area-map-heading" className="sr-only">
              {t("station.downloadAreaMap")}
            </h2>
            <div className="max-w-md overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={getStationMapImagePath(station.name)}
                alt={stationSummary ?? t("station.areaMapAlt", { name: station.name })}
                width={1080}
                height={1080}
                className="aspect-square w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <a
              href={getStationMapImagePath(station.name)}
              download={`${slug}.png`}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("station.downloadAreaMap")}
            </a>
          </section>

          <p className="mt-5 flex items-center gap-1 text-xs text-muted-foreground md:mt-8">
            <Navigation className="h-3 w-3" aria-hidden="true" />
            {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
          </p>
        </main>

        <SiteFooter
          showIntro={false}
          country={isCountryCode(station.country) ? station.country : undefined}
        />
      </div>
    </>
  );
};

export default Station;
