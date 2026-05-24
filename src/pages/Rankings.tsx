import { PageHead } from "@/components/PageHead";
import { RANKINGS_PAGE_META } from "@/lib/pageMeta";
import { ArrowLeft, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { JsonLd } from "@/components/JsonLd";
import { RankingsPanel } from "@/components/RankingsPanel";
import { buildRankingsStructuredData } from "@/lib/structuredData";

const Rankings = () => {
  return (
    <>
      <PageHead meta={RANKINGS_PAGE_META} />
      <JsonLd data={buildRankingsStructuredData()} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-8">
            <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
            <div>
              <h1 className="font-display text-3xl md:text-4xl">Community rankings</h1>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Stations and hotels ranked by visitor votes across Portugal
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-10">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to stations
          </Link>

          <div className="mb-8 space-y-2">
            <p className="text-muted-foreground">
              Rankings come from thumbs up and down on station cards and on hotel lists at
              each station page. If vote storage is misconfigured, the error below explains
              what went wrong.
            </p>
          </div>

          <RankingsPanel alwaysShow showDetailedError />
        </main>
      </div>
    </>
  );
};

export default Rankings;
