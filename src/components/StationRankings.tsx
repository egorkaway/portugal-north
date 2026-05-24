import { Link } from "react-router-dom";
import { RankingsPanel } from "@/components/RankingsPanel";

export function StationRankings() {
  return (
    <section
      aria-labelledby="community-rankings-heading"
      className="max-w-5xl mx-auto px-6 py-12 border-t border-border"
    >
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="community-rankings-heading"
            className="font-display text-2xl md:text-3xl text-foreground mb-2"
          >
            Community rankings
          </h2>
          <p className="text-sm text-muted-foreground">
            Top stations by global votes. See hotel rankings on the full page.
          </p>
        </div>
        <Link
          to="/rankings"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline shrink-0"
        >
          Full rankings page
        </Link>
      </div>
      <RankingsPanel stationsOnly rankingsHref="/rankings" />
    </section>
  );
}
