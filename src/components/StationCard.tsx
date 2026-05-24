import { MapPin, ExternalLink, BedDouble, Train, Euro, Navigation, ThumbsUp, ThumbsDown } from "lucide-react";
import { Station, getAppleMapsUrl, getOSMUrl, getBookingSearchUrl } from "@/data/stations";
import { stationHotels } from "@/data/hotels";
import { stationImages } from "@/data/stationImages";
import { useStationVote } from "@/hooks/useStationVote";
import { formatDistance } from "@/lib/geo";

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

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col">
      {imageUrl && (
        <div className="relative w-full aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={imageUrl}
            alt={`${station.name} train station`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h2 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
            {station.name}
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
        <div className="flex items-center gap-1 shrink-0" aria-label="Your private vote">
          <button
            type="button"
            onClick={() => cast("up")}
            aria-label="Upvote station"
            aria-pressed={vote === "up"}
            title={vote === "up" ? "Remove your upvote" : "Upvote (only you can see this)"}
            className={`p-1.5 rounded-md border transition-colors ${
              vote === "up"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => cast("down")}
            aria-label="Downvote station"
            aria-pressed={vote === "down"}
            title={vote === "down" ? "Remove your downvote" : "Downvote (only you can see this)"}
            className={`p-1.5 rounded-md border transition-colors ${
              vote === "down"
                ? "bg-destructive text-destructive-foreground border-destructive"
                : "bg-card text-muted-foreground border-border hover:border-destructive/40 hover:text-destructive"
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
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

      {/* Hotels section */}
      {hotels.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Budget stays nearby
          </p>
          <ul className="space-y-2">
            {hotels.map((hotel) => (
              <li key={hotel.name}>
                <a
                  href={hotel.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-2 p-2 -mx-2 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {hotel.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Navigation className="w-3 h-3" />
                      {hotel.distanceKm} km from station
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-primary whitespace-nowrap flex items-center gap-0.5">
                    <Euro className="w-3 h-3" />
                    {hotel.priceFrom}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}
