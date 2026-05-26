import { PageHead } from "@/components/PageHead";
import { getRankingsPageMeta } from "@/lib/pageMeta";
import { useLocale } from "@/i18n/LocaleProvider";
import { ArrowLeft, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { JsonLd } from "@/components/JsonLd";
import { RankingsPanel } from "@/components/RankingsPanel";
import { buildRankingsStructuredData } from "@/lib/structuredData";

const Rankings = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead meta={getRankingsPageMeta(locale)} />
      <JsonLd data={buildRankingsStructuredData()} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 md:px-6 md:py-8">
            <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
            <div>
              <h1 className="font-display text-2xl md:text-4xl">{t("rankings.title")}</h1>
              <p className="mt-1 text-sm text-primary-foreground/85">{t("rankings.subtitle")}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:mb-8"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("nav.backToStations")}
          </Link>

          <div className="mb-5 space-y-2 md:mb-8">
            <p className="text-muted-foreground">{t("rankings.intro")}</p>
          </div>

          <RankingsPanel alwaysShow showDetailedError />
        </main>
      </div>
    </>
  );
};

export default Rankings;
