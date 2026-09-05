import { Download, Plane } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { getExternalAirportMapPaths } from "@/lib/externalAirportPages";
import { stationToSlug } from "@/lib/stationSlug";
import type { Station } from "@/data/stations";

type Props = {
  station: Station;
};

function MapCard({
  src,
  alt,
  downloadName,
  title,
}: {
  src: string;
  alt: string;
  downloadName: string;
  title: string;
}) {
  const { t } = useLocale();
  const [missing, setMissing] = useState(false);
  if (missing) return null;

  return (
    <div className="max-w-md">
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <div className="overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={src}
          alt={alt}
          width={1080}
          height={1080}
          className="aspect-square w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
        />
      </div>
      <a
        href={src}
        download={downloadName}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {t("station.downloadConnectionsMap")}
      </a>
    </div>
  );
}

export function ExternalAirportConnectionsMaps({ station }: Props) {
  const { t } = useLocale();
  const slug = stationToSlug(station.name);
  const maps = getExternalAirportMapPaths(station);

  return (
    <section className="mb-8 md:mb-10" aria-labelledby="airport-connections-heading">
      <div className="mb-3 flex items-center gap-2 md:mb-4">
        <Plane className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="airport-connections-heading" className="font-display text-xl text-foreground md:text-2xl">
          {t("station.airportConnectionsTitle")}
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <MapCard
          src={maps.iberian}
          alt={t("station.airportConnectionsIberianMapAlt", { name: station.name })}
          downloadName={`${slug}-iberian-connections.png`}
          title={t("station.airportConnectionsIberianTitle")}
        />
        <MapCard
          src={maps.all}
          alt={t("station.airportConnectionsAllFlightsMapAlt", { name: station.name })}
          downloadName={`${slug}-connections.png`}
          title={t("station.airportConnectionsAllFlightsTitle")}
        />
      </div>
    </section>
  );
}
