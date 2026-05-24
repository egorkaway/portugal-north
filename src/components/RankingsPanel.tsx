import { AlertCircle, RefreshCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useGlobalStationRatings } from "@/hooks/useGlobalStationRatings";
import { getTopDownvoted, getTopUpvoted } from "@/lib/rankStations";
import { ratingsErrorMessage } from "@/lib/votesApi";
import type { GlobalRatings } from "@/lib/voteTypes";

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
  items: { name: string; up: number; down: number }[];
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
          {items.map((station, index) => (
            <li key={station.name} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                  {station.name}
                </p>
              </div>
              <span
                className={`shrink-0 text-sm font-semibold tabular-nums ${iconClassName}`}
              >
                {station[countKey]}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function getVoteTotals(ratings: GlobalRatings) {
  let stationsWithVotes = 0;
  let up = 0;
  let down = 0;

  for (const counts of Object.values(ratings)) {
    if (counts.up > 0 || counts.down > 0) {
      stationsWithVotes += 1;
      up += counts.up;
      down += counts.down;
    }
  }

  return { stationsWithVotes, up, down };
}

type RankingsPanelProps = {
  alwaysShow?: boolean;
  showDetailedError?: boolean;
  rankingsHref?: string;
};

export function RankingsPanel({
  alwaysShow = false,
  showDetailedError = false,
  rankingsHref,
}: RankingsPanelProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, isFetching } = useGlobalStationRatings();
  const ratings = data?.ratings;
  const topUp = ratings ? getTopUpvoted(ratings) : [];
  const topDown = ratings ? getTopDownvoted(ratings) : [];
  const totals = ratings ? getVoteTotals(ratings) : null;
  const hasRankings = topUp.length > 0 || topDown.length > 0;

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading community votes...</p>
    );
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
              <p className="font-medium text-foreground">Community ratings unavailable</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {ratingsErrorMessage(error)}
              </p>
              {showDetailedError && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Votes on station cards are still saved in your browser. Global totals
                  require the Vercel API route and a Blob store (Storage → Blob) on this project.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["global-station-ratings"] })
              }
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-70"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {isFetching ? "Retrying..." : "Try again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!alwaysShow && !hasRankings) {
    return (
      <p className="text-sm text-muted-foreground">
        No community votes recorded yet. Vote on any station card to help build the
        rankings.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {totals && (
        <p className="text-sm text-muted-foreground">
          {totals.stationsWithVotes === 0
            ? "No community votes recorded yet."
            : `${totals.up.toLocaleString()} upvotes and ${totals.down.toLocaleString()} downvotes across ${totals.stationsWithVotes.toLocaleString()} stations.`}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <RankingList
          title="Top upvoted"
          icon={ThumbsUp}
          iconClassName="text-primary"
          emptyLabel="No upvotes yet. Vote on a station card to get started."
          items={topUp}
          countKey="up"
        />
        <RankingList
          title="Most downvoted"
          icon={ThumbsDown}
          iconClassName="text-destructive"
          emptyLabel="No downvotes yet."
          items={topDown}
          countKey="down"
        />
      </div>
      {rankingsHref && (
        <p className="text-sm">
          <Link
            to={rankingsHref}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            View full community rankings
          </Link>
        </p>
      )}
    </div>
  );
}
