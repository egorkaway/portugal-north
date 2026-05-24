import { ArrowLeft, BedDouble, MapPin, Train, ExternalLink, Navigation } from "lucide-react";
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
import { useStationVote } from "@/hooks/useStationVote";
import { PageHead } from "@/components/PageHead";
import { buildStationPageMeta } from "@/lib/pageMeta";
import { JsonLd } from "@/components/JsonLd";
import { useGlobalRatings } from "@/hooks/useGlobalStationRatings";
import { buildStationStructuredData } from "@/lib/structuredData";
import { getStationBySlug } from "@/lib/stationSlug";

const typeColors: Record<string, string> = {
  "Alfa Pendular": "bg-primary text-primary-foreground",
  "Intercidades": "bg-secondary text-secondary-foreground",
  "Regional": "bg-accent text-accent-foreground",
  "Urban": "bg-muted text-muted-foreground",
  "Inactive / Historic": "bg-muted text-muted-foreground opacity-60",
};

const Station = () => {
  const { slug } = useParams<{ slug: string }>();
  const station = slug ? getStationBySlug(slug) : undefined;

  if (!station) {
    return <Navigate to="/404" replace />;
  }

  const hotels = getHotelsForStation(station.name);
  const imageUrl = getStationImageUrl(station.name);
  const shareImageUrl = getStationShareImageUrl(station.name);
  const showPhotoVote = hasRepresentativeStationImage(station.name);
  const { vote, cast } = useStationVote(station.name);
  const { data: globalVotes } = useGlobalRatings();
  const pageMeta = buildStationPageMeta(station, hotels, shareImageUrl);
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
              All stations
            </Link>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="font-display text-3xl md:text-4xl">{station.name}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/85">
                  <Train className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {station.lines.join(" · ")}
                </p>
              </div>
              <VoteButtons
                vote={vote}
                onUp={() => cast("up")}
                onDown={() => cast("down")}
                subjectLabel={station.name}
              />
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
                alt={`${station.name} train station`}
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
              Apple Maps
            </a>
            <a
              href={getOSMUrl(station)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground/5 px-3 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              OpenStreetMap
            </a>
            <a
              href={getBookingSearchUrl(station)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <BedDouble className="h-4 w-4" aria-hidden="true" />
              Search hotels on Booking
            </a>
          </div>

          {hotels.length > 0 && (
            <section aria-labelledby="hotels-heading">
              <div className="mb-4 flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 id="hotels-heading" className="font-display text-2xl text-foreground">
                  Budget stays nearby
                </h2>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">
                Upvote or downvote hotels you have tried, or suggest if a listing may be closed.
                Your feedback is saved in this browser.
              </p>
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
