import { Download } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  getOverviewMapDownloadFilename,
  getOverviewMapImagePath,
  OVERVIEW_MAP_DIMENSIONS,
  type OverviewMapKind,
  type OverviewMapRegion,
} from "@/lib/overviewMapImage";

type RegionConfig = {
  region: OverviewMapRegion;
  headingId: string;
  titleKey: "map.overviewTitle" | "map.overviewIberianTitle";
  introKey: "map.overviewIntro" | "map.overviewIberianIntro";
  activityAltKey: "map.overviewActivityAlt" | "map.overviewIberianActivityAlt";
  reliabilityAltKey: "map.overviewReliabilityAlt" | "map.overviewIberianReliabilityAlt";
};

const REGIONS: RegionConfig[] = [
  {
    region: "portugal",
    headingId: "map-overview-heading",
    titleKey: "map.overviewTitle",
    introKey: "map.overviewIntro",
    activityAltKey: "map.overviewActivityAlt",
    reliabilityAltKey: "map.overviewReliabilityAlt",
  },
  {
    region: "iberian",
    headingId: "map-overview-iberian-heading",
    titleKey: "map.overviewIberianTitle",
    introKey: "map.overviewIberianIntro",
    activityAltKey: "map.overviewIberianActivityAlt",
    reliabilityAltKey: "map.overviewIberianReliabilityAlt",
  },
];

const MAP_KINDS: {
  kind: OverviewMapKind;
  titleKey: "map.overviewActivityTitle" | "map.overviewReliabilityTitle";
  downloadKey: "map.overviewActivityDownload" | "map.overviewReliabilityDownload";
}[] = [
  {
    kind: "activity",
    titleKey: "map.overviewActivityTitle",
    downloadKey: "map.overviewActivityDownload",
  },
  {
    kind: "reliability",
    titleKey: "map.overviewReliabilityTitle",
    downloadKey: "map.overviewReliabilityDownload",
  },
];

function OverviewMapCard({
  region,
  kind,
  titleKey,
  altKey,
  downloadKey,
}: {
  region: OverviewMapRegion;
  kind: OverviewMapKind;
  titleKey: "map.overviewActivityTitle" | "map.overviewReliabilityTitle";
  altKey: RegionConfig["activityAltKey"] | RegionConfig["reliabilityAltKey"];
  downloadKey: "map.overviewActivityDownload" | "map.overviewReliabilityDownload";
}) {
  const { t } = useLocale();
  const { width, height, aspectClass } = OVERVIEW_MAP_DIMENSIONS[region];
  const src = getOverviewMapImagePath(kind, region);
  const filename = getOverviewMapDownloadFilename(kind, region);

  return (
    <article className="min-w-0">
      <h3 className="mb-3 text-base font-semibold text-foreground">{t(titleKey)}</h3>
      <div className="overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src={src}
          alt={t(altKey)}
          width={width}
          height={height}
          className={`${aspectClass} w-full object-cover`}
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
        {t(downloadKey)}
      </a>
    </article>
  );
}

export function MapOverviewImages() {
  const { t } = useLocale();

  return (
    <>
      {REGIONS.map((config, index) => (
        <section
          key={config.region}
          className={index === 0 ? "mt-10 md:mt-12" : "mt-12 md:mt-14"}
          aria-labelledby={config.headingId}
        >
          <h2 id={config.headingId} className="font-display text-xl text-foreground md:text-2xl">
            {t(config.titleKey)}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{t(config.introKey)}</p>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            {MAP_KINDS.map((map) => (
              <OverviewMapCard
                key={`${config.region}-${map.kind}`}
                region={config.region}
                kind={map.kind}
                titleKey={map.titleKey}
                altKey={
                  map.kind === "activity" ? config.activityAltKey : config.reliabilityAltKey
                }
                downloadKey={map.downloadKey}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
