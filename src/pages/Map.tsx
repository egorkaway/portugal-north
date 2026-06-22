import { lazy, Suspense } from "react";
import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { getMapPageMeta } from "@/lib/pageMeta";
import { useLocale } from "@/i18n/LocaleProvider";
import { ArrowLeft, Map as MapIcon } from "lucide-react";
import { Link } from "react-router-dom";

const StationActivityMap = lazy(() => import("@/components/StationActivityMap"));

const MapPage = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead meta={getMapPageMeta(locale)} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.backToStations")}
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <MapIcon className="h-7 w-7 shrink-0" aria-hidden="true" />
                <div>
                  <h1 className="font-display text-2xl md:text-4xl">{t("map.title")}</h1>
                  <p className="mt-1 text-sm text-primary-foreground/85">{t("map.subtitle")}</p>
                </div>
              </div>
              <SitePageNavLinks variant="hero" hide={["map"]} className="shrink-0" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <p className="mb-5 text-muted-foreground md:mb-8">{t("map.intro")}</p>
          <Suspense fallback={<p className="text-sm text-muted-foreground">{t("map.loading")}</p>}>
            <StationActivityMap />
          </Suspense>
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default MapPage;
