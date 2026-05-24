import { MapPin, ExternalLink, BedDouble, Train, Navigation, ArrowRight } from "lucide-react";
import { HotelList } from "@/components/HotelList";
import { Link } from "react-router-dom";
import { Station, getAppleMapsUrl, getOSMUrl, getBookingSearchUrl } from "@/data/stations";
import { getHotelsForStation } from "@/lib/stationHotels";
import { getStationImageUrl } from "@/lib/stationImage";
import { useStationVote } from "@/hooks/useStationVote";
import { formatDistance } from "@/lib/geo";
import { getStationPath } from "@/lib/stationSlug";
import { VoteButtons } from "@/components/VoteButtons";
import { useLocale } from "@/i18n/LocaleProvider";

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
  const { t } = useLocale();
  const hotels = getHotelsForStation(station.name);
  const imageUrl = getStationImageUrl(station.name);
  const { vote, cast } = useStationVote(station.name);
  const stationPath = getStationPath(station);

  return (
    <div className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col">
      <Link to={stationPath} className="block relative w-full aspect-[16/9] bg-muted overflow-hidden">
        <img
          src={imageUrl}
          alt={t("station.stationPhotoAlt", { name: station.name })}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
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
                {t("station.away", { distance: formatDistance(distanceKm) })}
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
            <MapPin className="w-3.5 h-3.5" /> {t("station.appleMaps")}
          </a>
          <a
            href={getOSMUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-foreground/5 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> {t("station.openStreetMap")}
          </a>
          <a
            href={getBookingSearchUrl(station)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground transition-colors"
          >
            <BedDouble className="w-3.5 h-3.5" /> {t("station.moreOnBooking")}
          </a>
        </div>

        {hotels.length > 0 && (
          <div className="border-t border-border pt-3 mt-auto">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("station.budgetStays")}
              </p>
              <Link
                to={stationPath}
                className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {t("station.stationPage")}
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            <HotelList stationName={station.name} hotels={hotels} variant="compact" />
          </div>
        )}
      </div>
    </div>
  );
}
