import { Download } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { getStationMapImagePath, hasStationMapImage } from "@/lib/stationMapImage";
import { stationToSlug } from "@/lib/stationSlug";
import type { Station } from "@/data/stations";

type Props = {
  station: Station;
  summary: string | null;
};

/**
 * Local area map card. Only rendered when the PNG exists in the availability
 * index; also hides if the image 404s at runtime (stale index).
 */
export function StationAreaMap({ station, summary }: Props) {
  const { t } = useLocale();
  const [missing, setMissing] = useState(false);

  if (!hasStationMapImage(station.name) || missing) {
    return null;
  }

  const slug = stationToSlug(station.name);
  const mapPath = getStationMapImagePath(station.name);

  return (
    <section className="mt-8 md:mt-10" aria-labelledby="area-map-heading">
      <h2 id="area-map-heading" className="sr-only">
        {t("station.downloadAreaMap")}
      </h2>
      <div className="max-w-md overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={mapPath}
          alt={summary ?? t("station.areaMapAlt", { name: station.name })}
          width={1080}
          height={1080}
          className="aspect-square w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
        />
      </div>
      <a
        href={mapPath}
        download={`${slug}.png`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {t("station.downloadAreaMap")}
      </a>
    </section>
  );
}
