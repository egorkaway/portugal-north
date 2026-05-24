import { Helmet } from "react-helmet-async";
import { ArrowLeft, BedDouble, MapPin, Train, ExternalLink, Navigation } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getAppleMapsUrl,
  getBookingSearchUrl,
  getOSMUrl,
} from "@/data/stations";
import { stationHotels } from "@/data/hotels";
import { stationImages } from "@/data/stationImages";
import { HotelList } from "@/components/HotelList";
import { StationImageVote } from "@/components/StationImageVote";
import { VoteButtons } from "@/components/VoteButtons";
import { useStationVote } from "@/hooks/useStationVote";
import { getStationBySlug } from "@/lib/stationSlug";
import { absoluteUrl } from "@/lib/site";

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

  const hotels = stationHotels[station.name] || [];
  const imageUrl = stationImages[station.name];
  const { vote, cast } = useStationVote(station.name);
  const path = `/stations/${slug}`;

  return (
    <>
      <Helmet>
        <title>{station.name} | Portugal by Train</title>
        <meta
          name="description"
          content={`Budget hotels near ${station.name} train station in Portugal. Lines: ${station.lines.join(", ")}.`}
        />
        <meta property="og:title" content={`${station.name} | Portugal by Train`} />
        <meta
          property="og:description"
          content={`Budget hotels near ${station.name} train station. Vote on stays you would recommend.`}
        />
        <meta property="og:url" content={absoluteUrl(path)} />
      </Helmet>
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
          {imageUrl && <StationImageVote stationName={station.name} imageUrl={imageUrl} />}

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

          <section aria-labelledby="hotels-heading">
            <div className="mb-4 flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 id="hotels-heading" className="font-display text-2xl text-foreground">
                Budget stays nearby
              </h2>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
              Upvote or downvote hotels you have tried, or suggest if a listing may be closed. Your
              feedback is saved in this browser.
            </p>
            <HotelList stationName={station.name} hotels={hotels} />
          </section>

          <p className="mt-8 text-xs text-muted-foreground flex items-center gap-1">
            <Navigation className="h-3 w-3" aria-hidden="true" />
            {station.lat.toFixed(4)}, {station.lng.toFixed(4)}
          </p>
        </main>
      </div>
    </>
  );
};

export default Station;
