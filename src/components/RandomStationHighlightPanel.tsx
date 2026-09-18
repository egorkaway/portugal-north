import { useEffect, useRef, useState } from "react";
import { Gauge } from "lucide-react";
import { Link } from "react-router-dom";
import { pageStations } from "@/data/stationRegistry";
import type { Station } from "@/data/stationTypes";
import { StationPhoto } from "@/components/StationPhoto";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  useReliabilityScores,
  useSpainReliabilityScores,
} from "@/hooks/useReliabilityScore";
import { getStationImageUrl } from "@/lib/stationImage";
import { getStationSummary } from "@/lib/stationSummary";
import { stationToSlug } from "@/lib/stationSlug";
import {
  formatReliabilityScore,
  reliabilityScoreBarTone,
  reliabilityScoreTone,
} from "@/lib/reliabilityScore";
import {
  pickRandomStationHighlight,
  stationHighlightScore,
  type StationHighlightCountry,
} from "@/lib/randomStationHighlight";

type Props = {
  /** Limit the random pick to one Iberian country. */
  country?: StationHighlightCountry;
  /** Quieter spacing when nested under a country section (tickets). */
  embedded?: boolean;
};

export function RandomStationHighlightPanel({ country, embedded = false }: Props) {
  const { t, locale, plural } = useLocale();
  const portugalQuery = useReliabilityScores();
  const spainQuery = useSpainReliabilityScores();
  const [station, setStation] = useState<Station | null>(null);
  const pickedRef = useRef(false);
  const headingId = country
    ? `station-highlight-heading-${country}`
    : "station-highlight-heading";
  const introKey =
    country === "pt"
      ? "rankings.stationHighlightIntroPt"
      : country === "es"
        ? "rankings.stationHighlightIntroEs"
        : "rankings.stationHighlightIntro";

  useEffect(() => {
    if (pickedRef.current) return;
    const needsPortugal = !country || country === "pt";
    const needsSpain = !country || country === "es";
    if (needsPortugal && portugalQuery.isLoading) return;
    if (needsSpain && spainQuery.isLoading) return;
    pickedRef.current = true;
    setStation(
      pickRandomStationHighlight(
        pageStations,
        {
          portugalScores: portugalQuery.data?.scores,
          portugalMovements: portugalQuery.data?.movements,
          spainScores: spainQuery.data?.scores,
          spainMovements: spainQuery.data?.movements,
        },
        Math.random,
        country,
      ),
    );
  }, [
    country,
    portugalQuery.isLoading,
    portugalQuery.data,
    spainQuery.isLoading,
    spainQuery.data,
  ]);

  if (!station) return null;

  const summary = getStationSummary(station.name, locale);
  const reliability = stationHighlightScore(station, {
    portugalScores: portugalQuery.data?.scores,
    portugalMovements: portugalQuery.data?.movements,
    spainScores: spainQuery.data?.scores,
    spainMovements: spainQuery.data?.movements,
  });
  const imageUrl = getStationImageUrl(station.name);
  const href = `/stations/${stationToSlug(station.name)}`;

  return (
    <section
      aria-labelledby={headingId}
      className={
        embedded
          ? "pt-2"
          : "mt-8 mb-2 border-t border-border pt-8 md:mt-12 md:pt-10"
      }
    >
      <div className="mb-3 md:mb-4">
        <h2
          id={headingId}
          className={`font-display text-foreground ${embedded ? "text-xl md:text-2xl" : "text-2xl"}`}
        >
          {t("rankings.stationHighlightTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t(introKey)}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <Link to={href} className="block overflow-hidden bg-muted">
          <StationPhoto
            src={imageUrl}
            alt={station.name}
            className="aspect-[2/1] w-full object-cover sm:aspect-[21/9]"
          />
        </Link>
        <div className="p-4 md:p-5">
          <h3 className="font-display text-xl text-foreground md:text-2xl">
            <Link to={href} className="hover:text-primary hover:underline">
              {station.name}
            </Link>
          </h3>
          {summary ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{summary}</p>
          ) : null}

          {reliability ? (
            <div className="mt-5 flex items-start gap-3 border-t border-border pt-5">
              <Gauge className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {t("station.reliabilityTitle")}
                </p>
                <div className="mt-3 flex items-end gap-3">
                  <p
                    className={`text-3xl font-semibold tabular-nums ${reliabilityScoreTone(reliability.score)}`}
                  >
                    {formatReliabilityScore(reliability.score)}
                    <span className="ml-1 text-base font-medium text-muted-foreground">/10</span>
                  </p>
                  <div className="mb-1 min-w-0 flex-1">
                    <div
                      className="h-2 overflow-hidden rounded-full bg-muted"
                      role="presentation"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full rounded-full ${reliabilityScoreBarTone(reliability.score)}`}
                        style={{ width: `${reliability.score * 10}%` }}
                      />
                    </div>
                    {reliability.movements > 0 ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {plural("rankings.stationHighlightSamples", reliability.movements, {
                          count: reliability.movements,
                        })}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <p className="mt-5">
            <Link
              to={href}
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("rankings.stationHighlightCta")}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
