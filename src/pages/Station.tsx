import { ArrowLeft, BedDouble, MapPin, Train, ExternalLink, Navigation, History } from "lucide-react";
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
import { useGlobalRatings } from "@/hooks/useGlobalStationRatings";
import { buildStationStructuredData } from "@/lib/structuredData";
import { getStationBySlug } from "@/lib/stationSlug";
import { getTripHistorianStationUrl } from "@/lib/tripHistorian";
import { isAirportStation } from "@/lib/airportStation";
import { getMetroOperatorLink, isMetroStation } from "@/lib/metroStation";
import { StationYesimPromo } from "@/components/StationYesimPromo";
import { NearestLongDistanceStations } from "@/components/NearestLongDistanceStations";

const typeColors: Record<string, string> = {
  "Alfa Pendular": "bg-primary text-primary-foreground",
  "Intercidades": "bg-secondary text-secondary-foreground",
  "Regional": "bg-accent text-accent-foreground",
  "Urban": "bg-muted text-muted-foreground",
  Metro: "bg-violet-600 text-white",
  "Inactive / Historic": "bg-muted text-muted-foreground opacity-60",
};

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
  const metroLink = getMetroOperatorLink(station);
  const imageUrl = getStationImageUrl(station.name);
  const shareImageUrl = getStationShareImageUrl(station.name);
  const showPhotoVote = hasRepresentativeStationImage(station.name);
  const { vote, cast } = useStationVote(station.name);
  const { visited, toggle: toggleVisited } = useStationVisited(station.name);
  const { data: globalVotes } = useGlobalRatings();
  const pageMeta = buildStationPageMeta(station, hotels, shareImageUrl, locale);
  const structuredData = buildStationStructuredData({
    station,
    slug: slug!,
    hotels,
    imageUrl: shareImageUrl,
    hotelRatings: globalVotes?.hotelRatings,
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
            <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.allStations")}
              </Link>
              <SitePageNavLinks variant="hero" />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-2xl md:text-4xl">{station.name}</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-primary-foreground/85 md:mt-2">
                  <Train className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {station.lines.join(" · ")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
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
            <StationImageVote stationName={station.name} imageUrl={imageUrl} />
          ) : (
            <div className="mb-5 overflow-hidden rounded-lg border border-border bg-muted md:mb-8">
              <StationPhoto
                src={imageUrl}
                alt={t("station.stationPhotoAlt", { name: station.name })}
                className="aspect-[2/1] w-full object-cover sm:aspect-[21/9]"
              />
            </div>
          )}

          <div className="mb-5 flex flex-wrap gap-1.5 md:mb-8">
            {station.types.map((type) => (
              <span
                key={type}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[type] || "bg-muted text-muted-foreground"}`}
              >
                {type}
              </span>
            ))}
          </div>

          <StationDepartures stationName={station.name} />

          <NearestLongDistanceStations station={station} />

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
            {!metroStation && tripHistorianUrl ? (
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

          {airportStation ? <StationYesimPromo /> : null}

          <p className="mt-5 flex items-center gap-1 text-xs text-muted-foreground md:mt-8">
            <Navigation className="h-3 w-3" aria-hidden="true" />
            {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
          </p>
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default Station;
