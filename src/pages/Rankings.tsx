import { Helmet } from "react-helmet-async";
import { ArrowLeft, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { RankingsPanel } from "@/components/RankingsPanel";
import { absoluteUrl } from "@/lib/site";

const Rankings = () => {
  return (
    <>
      <Helmet>
        <title>Community Rankings | Portugal by Train</title>
        <meta
          name="description"
          content="See which CP train stations visitors rate highest and lowest, based on global community votes."
        />
        <meta property="og:title" content="Community Rankings | Portugal by Train" />
        <meta
          property="og:description"
          content="See which CP train stations visitors rate highest and lowest, based on global community votes."
        />
        <meta property="og:url" content={absoluteUrl("/rankings")} />
      </Helmet>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-8">
            <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
            <div>
              <h1 className="font-display text-3xl md:text-4xl">Community rankings</h1>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Top and bottom stations by global visitor votes
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
              These rankings come from thumbs up and down votes on station cards across
              the site. If the API or vote storage is misconfigured on deployment, the
              error below explains what went wrong.
            </p>
          </div>

          <RankingsPanel alwaysShow showDetailedError />
        </main>
      </div>
    </>
  );
};

export default Rankings;
