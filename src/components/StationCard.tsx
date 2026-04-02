import { MapPin, ExternalLink, BedDouble, Train } from "lucide-react";
import { Station, getAppleMapsUrl, getOSMUrl, getBookingSearchUrl } from "@/data/stations";

const typeColors: Record<string, string> = {
  "Alfa Pendular": "bg-primary text-primary-foreground",
  "Intercidades": "bg-secondary text-secondary-foreground",
  "Regional": "bg-accent text-accent-foreground",
  "Urban": "bg-muted text-muted-foreground",
  "Inactive / Historic": "bg-muted text-muted-foreground opacity-60",
};

export function StationCard({ station }: { station: Station }) {
  return (
    <div className="group bg-card border border-border rounded-lg p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
            {station.name}
          </h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Train className="w-3.5 h-3.5" />
            {station.lines.join(" / ")}
          </p>
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

      <div className="flex flex-wrap gap-2">
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
          <BedDouble className="w-3.5 h-3.5" /> Hotels on Booking
        </a>
      </div>
    </div>
  );
}
