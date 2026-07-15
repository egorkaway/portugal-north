import type { AirportConnectionsEntry } from "../../server/lib/airportConnections";
import { Download, Plane } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  fetchAirportConnectionsManifest,
  getAirportConnectionsMapImagePath,
} from "@/lib/airportConnections";
import { stationToSlug } from "@/lib/stationSlug";
import type { Station } from "@/data/stations";

type AirportConnectionsPanelProps = {
  station: Station;
};

export function AirportConnectionsPanel({ station }: AirportConnectionsPanelProps) {
  const { t } = useLocale();
  const slug = stationToSlug(station.name);
  const [entry, setEntry] = useState<AirportConnectionsEntry | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchAirportConnectionsManifest().then((manifest) => {
      if (cancelled) return;
      const iata = station.lines[0]?.toUpperCase();
      const match =
        (iata && manifest?.airports[iata]) ||
        Object.values(manifest?.airports ?? {}).find(
          (airport) => airport.slug === slug || airport.stationName === station.name,
        ) ||
        null;
      setEntry(match);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, station.lines, station.name]);

  if (!loaded || !entry || entry.topDestinations.length === 0) {
    return null;
  }

  const mapPath = getAirportConnectionsMapImagePath(entry.slug);

  return (
    <section className="mb-8 md:mb-10" aria-labelledby="airport-connections-heading">
      <div className="mb-3 flex items-center gap-2 md:mb-4">
        <Plane className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="airport-connections-heading" className="font-display text-xl text-foreground md:text-2xl">
          {t("station.airportConnectionsTitle")}
        </h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground md:mb-6">
        {t("station.airportConnectionsIntro", {
          count: entry.sampledFlights,
          destinations: entry.connections.length,
        })}
      </p>

      <div className="max-w-md overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={mapPath}
          alt={t("station.airportConnectionsMapAlt", { name: station.name })}
          width={1080}
          height={1080}
          className="aspect-square w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <a
        href={mapPath}
        download={`${entry.slug}-connections.png`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {t("station.downloadConnectionsMap")}
      </a>

      <ol className="mt-6 space-y-3">
        {entry.topDestinations.map((destination, index) => (
          <li
            key={destination.iata}
            className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground">
                {index + 1}. {destination.name}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({destination.iata})
                </span>
              </p>
              {destination.country ? (
                <p className="text-sm text-muted-foreground">{destination.country}</p>
              ) : null}
            </div>
            <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
              {t("station.airportConnectionsFlights", { count: destination.flightCount })}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
