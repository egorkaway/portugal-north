import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useGlobalStationRatings } from "@/hooks/useGlobalStationRatings";
import { getTopDownvoted, getTopUpvoted } from "@/lib/rankStations";

function RankingList({
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

export function StationRankings() {
  const { data: ratings, isLoading } = useGlobalStationRatings();
  const topUp = ratings ? getTopUpvoted(ratings) : [];
  const topDown = ratings ? getTopDownvoted(ratings) : [];

  if (isLoading) {
    return (
      <section
        aria-labelledby="community-rankings-heading"
        className="max-w-5xl mx-auto px-6 py-12 border-t border-border"
      >
        <h2
          id="community-rankings-heading"
          className="font-display text-2xl md:text-3xl text-foreground mb-2"
        >
          Community rankings
        </h2>
        <p className="text-sm text-muted-foreground">Loading community votes...</p>
      </section>
    );
  }

  if (topUp.length === 0 && topDown.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="community-rankings-heading"
      className="max-w-5xl mx-auto px-6 py-12 border-t border-border"
    >
      <h2
        id="community-rankings-heading"
        className="font-display text-2xl md:text-3xl text-foreground mb-2"
      >
        Community rankings
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Global upvotes and downvotes from visitors. Your vote counts too.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <RankingList
          title="Top upvoted"
          icon={ThumbsUp}
          iconClassName="text-primary"
          emptyLabel="No upvotes yet."
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
    </section>
  );
}
