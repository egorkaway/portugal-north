import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { getRankingsPageMeta } from "@/lib/pageMeta";
import { useLocale } from "@/i18n/LocaleProvider";
import { ArrowLeft, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { JsonLd } from "@/components/JsonLd";
import { RankingsPanel } from "@/components/RankingsPanel";
import { ReliabilityRankingsPanel } from "@/components/ReliabilityRankingsPanel";
import { BuildNumberLabel } from "@/components/BuildNumberLabel";
import { buildRankingsStructuredData } from "@/lib/structuredData";

const Rankings = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead meta={getRankingsPageMeta(locale)} />
      <JsonLd data={buildRankingsStructuredData()} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to="/pt"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.backToStations")}
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
                <div>
                  <h1 className="font-display text-2xl md:text-4xl">{t("rankings.title")}</h1>
                  <p className="mt-1 text-sm text-primary-foreground/85">{t("rankings.subtitle")}</p>
                </div>
              </div>
              <SitePageNavLinks variant="hero" hide={["rankings"]} className="shrink-0" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <ReliabilityRankingsPanel />

          <p className="mb-5 text-muted-foreground md:mb-8">{t("rankings.intro")}</p>

          <RankingsPanel alwaysShow showDetailedError />
          <BuildNumberLabel />
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default Rankings;
