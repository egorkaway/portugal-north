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
import { StationDepartures } from "@/components/StationDepartures";
import { StationImageVote } from "@/components/StationImageVote";
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

const typeColors: Record<string, string> = {
  "Alfa Pendular": "bg-primary text-primary-foreground",
  "Intercidades": "bg-secondary text-secondary-foreground",
  "Regional": "bg-accent text-accent-foreground",
  "Urban": "bg-muted text-muted-foreground",
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
    stationRatings: globalVotes?.ratings,
    hotelRatings: globalVotes?.hotelRatings,
  });

  return (
    <>
      <PageHead meta={pageMeta} />
      <JsonLd data={structuredData} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-6 py-8">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("nav.allStations")}
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-3xl md:text-4xl">{station.name}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/85">
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
                />
                <VisitedButton
                  visited={visited}
                  onToggle={toggleVisited}
                  subjectLabel={station.name}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-10">
          {showPhotoVote ? (
            <StationImageVote stationName={station.name} imageUrl={imageUrl} />
          ) : (
            <div className="mb-8 overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={imageUrl}
                alt={t("station.stationPhotoAlt", { name: station.name })}
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          )}

          <div className="mb-8 flex flex-wrap gap-1.5">
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

          <div className="mb-10 flex flex-wrap gap-2">
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
            {tripHistorianUrl ? (
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
              <div className="mb-4 flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 id="hotels-heading" className="font-display text-2xl text-foreground">
                  {t("station.budgetStays")}
                </h2>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">{t("station.hotelsIntro")}</p>
              <HotelList stationName={station.name} hotels={hotels} />
            </section>
          )}

          <p className="mt-8 text-xs text-muted-foreground flex items-center gap-1">
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
