import { ArrowLeft, ChevronRight, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { JsonLd } from "@/components/JsonLd";
import { getLinesPageMeta } from "@/lib/pageMeta";
import { buildLinesStructuredData } from "@/lib/structuredData";
import { defaultHomePath } from "@/lib/homeRoute";
import { useLocale } from "@/i18n/LocaleProvider";
import { getLinePath, getTrainLines, type TrainLine } from "@/lib/trainLines";
import { getTrainTypeBadgeClass } from "@/lib/trainTypes";

function LineCard({ line }: { line: TrainLine }) {
  const { t, plural } = useLocale();
  return (
    <Link
      to={getLinePath(line)}
      className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-lg text-foreground">{line.name}</span>
          {line.historic ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground opacity-70">
              {t("lines.historicBadge")}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {plural("lines.stationCount", line.stations.length, {
            count: line.stations.length,
          })}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {line.serviceTypes.map((type) => (
            <span
              key={type}
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getTrainTypeBadgeClass(type)}`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden="true"
      />
    </Link>
  );
}

function LineSection({ title, lines }: { title: string; lines: TrainLine[] }) {
  if (lines.length === 0) return null;
  return (
    <section className="mb-8 md:mb-10">
      <h2 className="mb-3 font-display text-xl text-foreground md:mb-4 md:text-2xl">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {lines.map((line) => (
          <LineCard key={line.slug} line={line} />
        ))}
      </div>
    </section>
  );
}

const Lines = () => {
  const { t, locale } = useLocale();
  const lines = getTrainLines();
  const railPt = lines.filter((l) => l.category === "rail" && l.country === "pt");
  const railEs = lines.filter((l) => l.category === "rail" && l.country === "es");
  const metro = lines.filter((l) => l.category === "metro");

  return (
    <>
      <PageHead meta={getLinesPageMeta(locale)} />
      <JsonLd data={buildLinesStructuredData(lines)} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to={defaultHomePath()}
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
                  <h1 className="font-display text-2xl md:text-4xl">{t("lines.title")}</h1>
                  <p className="mt-1 text-sm text-primary-foreground/85">{t("lines.subtitle")}</p>
                </div>
              </div>
              <SitePageNavLinks variant="hero" hide={["lines"]} className="shrink-0" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <p className="mb-5 text-muted-foreground md:mb-8">{t("lines.intro")}</p>

          <LineSection title={t("lines.portugalHeading")} lines={railPt} />
          <LineSection title={t("lines.spainHeading")} lines={railEs} />
          <LineSection title={t("lines.metroHeading")} lines={metro} />

          <p className="mt-2 text-xs text-muted-foreground">{t("lines.orderingNote")}</p>
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default Lines;
