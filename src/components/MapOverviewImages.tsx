import { Download } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  getOverviewMapDownloadFilename,
  getOverviewMapImagePath,
  OVERVIEW_MAP_HEIGHT,
  OVERVIEW_MAP_WIDTH,
  type OverviewMapKind,
} from "@/lib/overviewMapImage";

const OVERVIEW_MAPS: { kind: OverviewMapKind; titleKey: "map.overviewActivityTitle" | "map.overviewReliabilityTitle"; altKey: "map.overviewActivityAlt" | "map.overviewReliabilityAlt"; downloadKey: "map.overviewActivityDownload" | "map.overviewReliabilityDownload" }[] = [
  {
    kind: "activity",
    titleKey: "map.overviewActivityTitle",
    altKey: "map.overviewActivityAlt",
    downloadKey: "map.overviewActivityDownload",
  },
  {
    kind: "reliability",
    titleKey: "map.overviewReliabilityTitle",
    altKey: "map.overviewReliabilityAlt",
    downloadKey: "map.overviewReliabilityDownload",
  },
];

export function MapOverviewImages() {
  const { t } = useLocale();

  return (
    <section className="mt-10 md:mt-12" aria-labelledby="map-overview-heading">
      <h2 id="map-overview-heading" className="font-display text-xl text-foreground md:text-2xl">
        {t("map.overviewTitle")}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{t("map.overviewIntro")}</p>

      <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {OVERVIEW_MAPS.map((map) => {
          const src = getOverviewMapImagePath(map.kind);
          const filename = getOverviewMapDownloadFilename(map.kind);

          return (
            <article key={map.kind} className="min-w-0">
              <h3 className="mb-3 text-base font-semibold text-foreground">{t(map.titleKey)}</h3>
              <div className="overflow-hidden rounded-lg border border-border bg-muted">
                <img
                  src={src}
                  alt={t(map.altKey)}
                  width={OVERVIEW_MAP_WIDTH}
                  height={OVERVIEW_MAP_HEIGHT}
                  className="aspect-[4/5] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <a
                href={src}
                download={filename}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t(map.downloadKey)}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
