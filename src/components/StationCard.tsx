import { MapPin, ExternalLink, BedDouble, Train, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { Station, getAppleMapsUrl, getOSMUrl, getBookingSearchUrl } from "@/data/stations";
import { stationHotels } from "@/data/hotels";
import { stationImages } from "@/data/stationImages";
import { useStationVote } from "@/hooks/useStationVote";
import { formatDistance } from "@/lib/geo";
import { getStationPath } from "@/lib/stationSlug";
import { VoteButtons } from "@/components/VoteButtons";

const typeColors: Record<string, string> = {
  "Alfa Pendular": "bg-primary text-primary-foreground",
  "Intercidades": "bg-secondary text-secondary-foreground",
  "Regional": "bg-accent text-accent-foreground",
  "Urban": "bg-muted text-muted-foreground",
  "Inactive / Historic": "bg-muted text-muted-foreground opacity-60",
};

export function StationCard({
  station,
  distanceKm,
}: {
  station: Station;
  distanceKm?: number;
}) {
  const hotels = stationHotels[station.name] || [];
  const imageUrl = stationImages[station.name];
  const { vote, cast } = useStationVote(station.name);
  const stationPath = getStationPath(station);

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col">
      <Link to={stationPath} className="block relative w-full aspect-[16/9] bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${station.name} train station`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <Train className="h-10 w-10 opacity-40" aria-hidden="true" />
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h2 className="font-display text-xl">
              <Link
                to={stationPath}
                className="text-foreground group-hover:text-primary transition-colors"
              >
                {station.name}
              </Link>
            </h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Train className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{station.lines.join(" / ")}</span>
            </p>
            {distanceKm !== undefined && (
              <p className="text-xs text-primary flex items-center gap-1 mt-1">
                <Navigation className="w-3 h-3 shrink-0" />
                {formatDistance(distanceKm)} away
              </p>
            )}
          </div>
          <VoteButtons
            vote={vote}
            onUp={() => cast("up")}
            onDown={() => cast("down")}
            subjectLabel={station.name}
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {station.types.map((type) => (
            <span
              key={type}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[type] || "bg-muted text-muted-foreground"}`}
            >
              {type}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <a
            href={getAppleMapsUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-foreground/5 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> Apple Maps
          </a>
          <a
            href={getOSMUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-foreground/5 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> OpenStreetMap
          </a>
          <a
            href={getBookingSearchUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            <BedDouble className="w-3.5 h-3.5" /> More on Booking
          </a>
        </div>

        {hotels.length > 0 && (
          <div className="border-t border-border pt-3 mt-auto">
            <p className="text-xs text-muted-foreground mb-2">
              {hotels.length} budget {hotels.length === 1 ? "stay" : "stays"} nearby
            </p>
            <Link
              to={stationPath}
              className="text-sm font-medium text-primary hover:underline"
            >
              View hotels and vote
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
