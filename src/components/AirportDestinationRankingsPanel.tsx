import { useState } from "react";
import { AlertCircle, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import { useAirportConnections } from "@/hooks/useAirportConnections";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  buildAirportDestinationRankingsByCountry,
  type AirportDestinationRankingRow,
} from "@/lib/airportDestinationRankings";

function AirportDestinationRankingCard({
  title,
  emptyLabel,
  row,
}: {
  title: string;
  emptyLabel: string;
  row: AirportDestinationRankingRow | null;
}) {
  const { t, plural } = useLocale();
  const [mapMissing, setMapMissing] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-4 md:p-5">
      <h3 className="mb-3 font-display text-lg text-foreground md:mb-4 md:text-xl">{title}</h3>
      {!row ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="min-w-0 text-sm font-medium text-foreground">
              <Link
                to={`/stations/${row.slug}`}
                className="hover:text-primary hover:underline"
              >
                {row.name}
              </Link>
            </p>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-primary">
              {plural("rankings.airportDestinationCount", row.destinationCount, {
                count: row.destinationCount,
              })}
            </span>
          </div>
          {!mapMissing ? (
            <Link
              to={`/stations/${row.slug}`}
              className="block overflow-hidden rounded-md border border-border bg-muted"
            >
              <img
                src={row.mapImage}
                alt={t("station.airportConnectionsMapAlt", { name: row.name })}
                width={1080}
                height={1080}
                className="aspect-square w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setMapMissing(true)}
              />
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function AirportDestinationRankingsPanel() {
  const { t } = useLocale();
  const { data, isLoading, isError } = useAirportConnections();

  if (isLoading) {
    return (
      <p className="mt-8 mb-6 text-sm text-muted-foreground md:mt-12 md:mb-10">
        {t("rankings.airportDestinationLoading")}
      </p>
    );
  }

  if (isError || !data) {
    return (
      <div className="mt-8 mb-6 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground md:mt-12 md:mb-10">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{t("rankings.airportDestinationUnavailable")}</p>
        </div>
      </div>
    );
  }

  const rankings = buildAirportDestinationRankingsByCountry(data);
  const hasData = rankings.pt || rankings.es;

  if (!hasData) {
    return (
      <p className="mt-8 mb-6 text-sm text-muted-foreground md:mt-12 md:mb-10">
        {t("rankings.airportDestinationNoData")}
      </p>
    );
  }

  return (
    <section aria-labelledby="airport-destination-rankings-heading" className="mt-8 mb-6 md:mt-12 md:mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Plane className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 id="airport-destination-rankings-heading" className="font-display text-2xl text-foreground">
          {t("rankings.airportDestinationRankings")}
        </h2>
      </div>
      <p className="mb-3 text-sm text-muted-foreground md:mb-4">
        {t("rankings.airportDestinationIntro")}
      </p>
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <AirportDestinationRankingCard
          title={t("rankings.airportDestinationMostPt")}
          emptyLabel={t("rankings.airportDestinationNoData")}
          row={rankings.pt}
        />
        <AirportDestinationRankingCard
          title={t("rankings.airportDestinationMostEs")}
          emptyLabel={t("rankings.airportDestinationNoData")}
          row={rankings.es}
        />
      </div>
    </section>
  );
}
