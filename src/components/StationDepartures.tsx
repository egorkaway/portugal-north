import { AlertCircle, Clock, RefreshCw } from "lucide-react";
import { getCpStationCode } from "@/data/cpStationCodes";
import { useStationDepartures } from "@/hooks/useStationDepartures";
import { isCpTravelApiConfigured } from "@/lib/cpTravelApi";

function DepartureRow({
  trainNumber,
  time,
  destination,
  serviceType,
  platform,
  delayMinutes,
}: {
  trainNumber: string;
  time: string;
  destination: string;
  serviceType: string;
  platform: string | null;
  delayMinutes: number | null;
}) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-md border border-border bg-card px-4 py-3">
      <div className="min-w-0">
        <p className="font-medium text-foreground tabular-nums">{time}</p>
        <p className="mt-0.5 text-sm text-foreground truncate">→ {destination}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {serviceType} · train {trainNumber}
          {platform ? ` · platform ${platform}` : ""}
        </p>
      </div>
      {delayMinutes !== null && (
        <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
          +{delayMinutes} min
        </span>
      )}
    </li>
  );
}

export function StationDepartures({ stationName }: { stationName: string }) {
  const stationCode = getCpStationCode(stationName);
  const configured = isCpTravelApiConfigured();
  const { data, isLoading, isError, error, isFetching, refetch } = useStationDepartures(stationName);

  if (!configured) {
    return (
      <section className="mb-10" aria-labelledby="departures-heading">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="departures-heading" className="font-display text-2xl text-foreground">
            Next departures
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Live departures are not configured for this deployment. Add{" "}
          <code className="text-xs">VITE_CP_*</code> keys from{" "}
          <code className="text-xs">scripts/refresh-cp-env.mjs</code>, then rebuild.
        </p>
      </section>
    );
  }

  if (!stationCode) {
    return (
      <section className="mb-10" aria-labelledby="departures-heading">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="departures-heading" className="font-display text-2xl text-foreground">
            Next departures
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          No CP station code mapped for this stop yet (inactive or unlisted in CP).
        </p>
      </section>
    );
  }

  return (
    <section className="mb-10" aria-labelledby="departures-heading">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="departures-heading" className="font-display text-2xl text-foreground">
            Next departures
          </h2>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh
        </button>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Up to three upcoming trains from CP (unofficial API, times in Lisbon). Fetched in your
        browser.
      </p>

      {isLoading && (
        <p className="text-sm text-muted-foreground" role="status">
          Loading departures…
        </p>
      )}

      {isError && (
        <p className="flex items-start gap-2 text-sm text-destructive" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          Could not load departures
          {error instanceof Error && error.message ? ` (${error.message})` : ""}.
        </p>
      )}

      {!isLoading && !isError && data && data.length === 0 && (
        <p className="text-sm text-muted-foreground">No upcoming departures listed for today.</p>
      )}

      {data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((dep) => (
            <DepartureRow key={`${dep.trainNumber}-${dep.time}`} {...dep} />
          ))}
        </ul>
      )}
    </section>
  );
}
