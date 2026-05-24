import { AlertCircle, BedDouble, RefreshCw, ThumbsDown, ThumbsUp, TrainFront } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useGlobalRatings } from "@/hooks/useGlobalStationRatings";
import { getTopDownvotedHotels, getTopUpvotedHotels } from "@/lib/rankHotels";
import { getTopDownvoted, getTopUpvoted } from "@/lib/rankStations";
import { ratingsErrorMessage } from "@/lib/votesApi";
import { stationToSlug } from "@/lib/stationSlug";
import type { GlobalRatings } from "@/lib/voteTypes";
import { useLocale } from "@/i18n/LocaleProvider";

function formatCount(n: number, locale: string): string {
  return n.toLocaleString(locale === "pt" ? "pt-PT" : locale === "es" ? "es-ES" : "en-US");
}

export function RankingList({
  title,
  icon: Icon,
  iconClassName,
  emptyLabel,
  items,
  countKey,
}: {
  title: string;
  icon: typeof ThumbsUp;
  iconClassName: string;
  emptyLabel: string;
  items: {
    name: string;
    up: number;
    down: number;
    subtitle?: string;
    href?: string;
  }[];
  countKey: "up" | "down";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconClassName}`} aria-hidden="true" />
        <h3 className="font-display text-xl text-foreground">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={item.name + (item.subtitle ?? "")} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                  {item.name}
                </p>
                {item.subtitle && (
                  <p className="mt-0.5 pl-5 text-xs text-muted-foreground">
                    {item.href ? (
                      <Link to={item.href} className="hover:text-primary hover:underline">
                        {item.subtitle}
                      </Link>
                    ) : (
                      item.subtitle
                    )}
                  </p>
                )}
              </div>
              <span
                className={`shrink-0 text-sm font-semibold tabular-nums ${iconClassName}`}
              >
                {item[countKey]}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function getVoteTotals(ratings: GlobalRatings, label: string) {
  let itemsWithVotes = 0;
  let up = 0;
  let down = 0;

  for (const counts of Object.values(ratings)) {
    if (counts.up > 0 || counts.down > 0) {
      itemsWithVotes += 1;
      up += counts.up;
      down += counts.down;
    }
  }

  return { itemsWithVotes, up, down, label };
}

type RankingsPanelProps = {
  alwaysShow?: boolean;
  /** Homepage teaser: only top stations, link to /rankings for hotels */
  stationsOnly?: boolean;
  showDetailedError?: boolean;
  rankingsHref?: string;
};

export function RankingsPanel({
  alwaysShow = false,
  stationsOnly = false,
  showDetailedError = false,
  rankingsHref,
}: RankingsPanelProps) {
  const { t, locale } = useLocale();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, isFetching } = useGlobalRatings();

  const stationRatings = data?.ratings;
  const hotelRatings = data?.hotelRatings;
  const topStationsUp = stationRatings ? getTopUpvoted(stationRatings) : [];
  const topStationsDown = stationRatings ? getTopDownvoted(stationRatings) : [];
  const topHotelsUp = hotelRatings ? getTopUpvotedHotels(hotelRatings) : [];
  const topHotelsDown = hotelRatings ? getTopDownvotedHotels(hotelRatings) : [];

  const stationTotals = stationRatings ? getVoteTotals(stationRatings, "stations") : null;
  const hotelTotals = hotelRatings ? getVoteTotals(hotelRatings, "hotels") : null;

  const hasStationRankings = topStationsUp.length > 0 || topStationsDown.length > 0;
  const hasHotelRankings = topHotelsUp.length > 0 || topHotelsDown.length > 0;
  const hasRankings = stationsOnly
    ? hasStationRankings
    : hasStationRankings || hasHotelRankings;

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">{t("rankings.loading")}</p>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <div className="min-w-0 space-y-3">
            <div>
              <p className="font-medium text-foreground">{t("rankings.unavailableTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {ratingsErrorMessage(error)}
              </p>
              {showDetailedError && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {t("rankings.unavailableDetail")}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["global-ratings"] })}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-70"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {isFetching ? t("rankings.retrying") : t("rankings.tryAgain")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!alwaysShow && !hasRankings) {
    return (
      <p className="text-sm text-muted-foreground">{t("rankings.noVotesYet")}</p>
    );
  }

  const hotelItemsUp = topHotelsUp.map((h) => ({
    name: h.hotelName,
    up: h.up,
    down: h.down,
    subtitle: h.stationName,
    href: h.stationName ? `/stations/${stationToSlug(h.stationName)}` : undefined,
  }));

  const hotelItemsDown = topHotelsDown.map((h) => ({
    name: h.hotelName,
    up: h.up,
    down: h.down,
    subtitle: h.stationName,
    href: h.stationName ? `/stations/${stationToSlug(h.stationName)}` : undefined,
  }));

  return (
    <div className="space-y-10">
      <section aria-labelledby={stationsOnly ? undefined : "station-rankings-heading"}>
        {!stationsOnly && (
          <div className="mb-4 flex items-center gap-2">
            <TrainFront className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 id="station-rankings-heading" className="font-display text-2xl text-foreground">
              {t("rankings.stationRankings")}
            </h2>
          </div>
        )}
        {stationTotals && (
          <p className="mb-4 text-sm text-muted-foreground">
            {stationTotals.itemsWithVotes === 0
              ? t("rankings.noStationVotes")
              : t("rankings.voteTotalsStations", {
                  up: formatCount(stationTotals.up, locale),
                  down: formatCount(stationTotals.down, locale),
                  items: formatCount(stationTotals.itemsWithVotes, locale),
                })}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <RankingList
            title={t("rankings.topUpvoted")}
            icon={ThumbsUp}
            iconClassName="text-primary"
            emptyLabel={t("rankings.noStationUpvotes")}
            items={topStationsUp}
            countKey="up"
          />
          <RankingList
            title={t("rankings.mostDownvoted")}
            icon={ThumbsDown}
            iconClassName="text-destructive"
            emptyLabel={t("rankings.noStationDownvotes")}
            items={topStationsDown}
            countKey="down"
          />
        </div>
      </section>

      {!stationsOnly && (
        <section aria-labelledby="hotel-rankings-heading">
          <div className="mb-4 flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 id="hotel-rankings-heading" className="font-display text-2xl text-foreground">
              {t("rankings.hotelRankings")}
            </h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">{t("rankings.hotelLeaderboard")}</p>
          {hotelTotals && (
            <p className="mb-4 text-sm text-muted-foreground">
              {hotelTotals.itemsWithVotes === 0
                ? t("rankings.noHotelVotes")
                : t("rankings.voteTotalsHotels", {
                    up: formatCount(hotelTotals.up, locale),
                    down: formatCount(hotelTotals.down, locale),
                    items: formatCount(hotelTotals.itemsWithVotes, locale),
                  })}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <RankingList
              title={t("rankings.topUpvoted")}
              icon={ThumbsUp}
              iconClassName="text-primary"
              emptyLabel={t("rankings.noHotelUpvotes")}
              items={hotelItemsUp}
              countKey="up"
            />
            <RankingList
              title={t("rankings.mostDownvoted")}
              icon={ThumbsDown}
              iconClassName="text-destructive"
              emptyLabel={t("rankings.noHotelDownvotes")}
              items={hotelItemsDown}
              countKey="down"
            />
          </div>
        </section>
      )}

      {rankingsHref && (
        <p className="text-sm">
          <Link
            to={rankingsHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("rankings.viewFull")}
          </Link>
        </p>
      )}
    </div>
  );
}
