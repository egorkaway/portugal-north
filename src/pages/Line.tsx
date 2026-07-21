import { ArrowLeft, ChevronRight, MapPin, TrainFront } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { JsonLd } from "@/components/JsonLd";
import { buildLinePageMeta } from "@/lib/pageMeta";
import { buildLineStructuredData } from "@/lib/structuredData";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  getLinePath,
  getListedLinesForStation,
  getTrainLineBySlug,
} from "@/lib/trainLines";
import { getStationPath } from "@/lib/stationSlug";
import { getTrainTypeBadgeClass } from "@/lib/trainTypes";

const Line = () => {
  const { t, plural, locale } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const line = slug ? getTrainLineBySlug(slug) : undefined;

  if (!line) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <PageHead meta={buildLinePageMeta(line, locale)} />
      <JsonLd data={buildLineStructuredData(line)} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to="/lines"
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("lines.backToLines")}
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl md:text-4xl">{line.name}</h1>
                    {line.historic ? (
                      <span className="rounded-full bg-primary-foreground/15 px-2 py-0.5 text-xs font-medium text-primary-foreground/90">
                        {t("lines.historicBadge")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-primary-foreground/85">
                    {plural("lines.stationCount", line.stations.length, {
                      count: line.stations.length,
                    })}
                  </p>
                </div>
              </div>
              <SitePageNavLinks variant="hero" className="shrink-0" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <div className="mb-5 flex flex-wrap gap-1.5 md:mb-6">
            {line.serviceTypes.map((type) => (
              <span
                key={type}
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getTrainTypeBadgeClass(type)}`}
              >
                {type}
              </span>
            ))}
          </div>

          <p className="mb-5 text-sm text-muted-foreground">{t("lines.servicesNote")}</p>

          <h2 className="mb-3 font-display text-xl text-foreground md:mb-4 md:text-2xl">
            {t("lines.stationsHeading")}
          </h2>

          {line.stations.length === 0 ? (
            <p className="text-muted-foreground">{t("lines.emptyLine")}</p>
          ) : (
            <ol className="space-y-2">
              {line.stations.map((station, index) => {
                const others = getListedLinesForStation(station).filter(
                  (l) => l.slug !== line.slug,
                );
                return (
                  <li
                    key={station.name}
                    className="rounded-lg border border-border bg-card transition-colors hover:border-primary/40 hover:bg-muted/40"
                  >
                    <Link
                      to={getStationPath(station)}
                      className="group flex items-start gap-3 p-3 md:p-4"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          {station.name}
                        </span>
                        <span className="mt-1.5 flex flex-wrap gap-1.5">
                          {station.types.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              {t("lines.noServiceData")}
                            </span>
                          ) : (
                            station.types.map((type) => (
                              <span
                                key={type}
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${getTrainTypeBadgeClass(type)}`}
                              >
                                {type}
                              </span>
                            ))
                          )}
                        </span>
                      </span>
                      <ChevronRight
                        className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                    {others.length > 0 ? (
                      <p className="border-t border-border/70 px-3 pb-3 pt-0 text-xs text-muted-foreground md:px-4 md:pb-4">
                        <span className="pl-9">
                          {t("lines.alsoOn")}:{" "}
                          {others.map((other, otherIndex) => (
                            <span key={other.slug}>
                              {otherIndex > 0 ? " · " : null}
                              <Link
                                to={getLinePath(other)}
                                className="font-medium text-primary underline-offset-2 hover:underline"
                              >
                                {other.name}
                              </Link>
                            </span>
                          ))}
                        </span>
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          )}

          <p className="mt-5 text-xs text-muted-foreground md:mt-6">{t("lines.orderingNote")}</p>

          <div className="mt-6">
            <Link
              to="/lines"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("lines.viewAllLines")}
            </Link>
          </div>
        </main>

        <SiteFooter showIntro={false} country={line.country} />
      </div>
    </>
  );
};

export default Line;
