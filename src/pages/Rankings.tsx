import { Helmet } from "react-helmet-async";
import { ArrowLeft, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { JsonLd } from "@/components/JsonLd";
import { RankingsPanel } from "@/components/RankingsPanel";
import { buildRankingsStructuredData } from "@/lib/structuredData";
import { absoluteUrl } from "@/lib/site";

const Rankings = () => {
  return (
    <>
      <Helmet>
        <title>Community Rankings | Portugal by Train</title>
        <meta
          name="description"
          content="See which CP train stations and budget hotels visitors rate highest and lowest across Portugal."
        />
        <meta property="og:title" content="Community Rankings | Portugal by Train" />
        <meta
          property="og:description"
          content="Community rankings for CP stations and budget hotels across Portugal."
        />
        <meta property="og:url" content={absoluteUrl("/rankings")} />
        <link rel="canonical" href={absoluteUrl("/rankings")} />
      </Helmet>
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
