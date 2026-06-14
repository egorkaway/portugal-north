import { ArrowRight, Navigation, Train } from "lucide-react";
import { Link } from "react-router-dom";
import type { Station } from "@/data/stations";
import { formatDistance } from "@/lib/geo";
import {
  getLongDistanceTypes,
  getNearestLongDistanceStations,
  shouldShowNearestLongDistance,
} from "@/lib/nearestLongDistanceStations";
import { getStationPath } from "@/lib/stationSlug";
import { useLocale } from "@/i18n/LocaleProvider";

const typeColors: Record<string, string> = {
  "Alfa Pendular": "bg-primary text-primary-foreground",
  Intercidades: "bg-secondary text-secondary-foreground",
};

export function NearestLongDistanceStations({ station }: { station: Station }) {
  const { t } = useLocale();

  if (!shouldShowNearestLongDistance(station)) {
    return null;
  }

  const nearest = getNearestLongDistanceStations(station);
  if (nearest.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="long-distance-heading" className="mb-6 md:mb-8">
      <div className="mb-3 flex items-center gap-2 md:mb-4">
        <Train className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="long-distance-heading" className="font-display text-xl text-foreground md:text-2xl">
          {t("station.longDistanceNearby")}
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground md:mb-6">
        {t("station.longDistanceIntro")}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {nearest.map(({ station: candidate, distanceKm }) => (
          <li key={candidate.name}>
            <Link
              to={getStationPath(candidate)}
              className="group flex h-full flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-lg text-foreground group-hover:text-primary">
                    {candidate.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {candidate.lines.join(" · ")}
                  </p>
                </div>
                <ArrowRight
                  className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <p className="mb-3 flex items-center gap-1 text-xs text-primary">
                <Navigation className="h-3 w-3 shrink-0" aria-hidden="true" />
                {t("station.away", { distance: formatDistance(distanceKm) })}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5">
                {getLongDistanceTypes(candidate).map((type) => (
                  <span
                    key={type}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[type] || "bg-muted text-muted-foreground"}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
