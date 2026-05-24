import { Clock, RefreshCw } from "lucide-react";
import { getCpStationCode } from "@/data/cpStationCodes";
import { useStationDepartures } from "@/hooks/useStationDepartures";

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
  const { data, isLoading, isError, isFetching, refetch, error } = useStationDepartures(stationName);

  if (!stationCode) {
    return null;
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
        {!isLoading && !isError && (
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </button>
        )}
      </div>

      {isLoading && (
        <ul className="space-y-2" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="h-[4.25rem] animate-pulse rounded-md border border-border bg-muted/40"
            />
          ))}
        </ul>
      )}

      {isError && (
        <p className="text-sm text-muted-foreground" role="status">
          Live departures are temporarily unavailable
          {error instanceof Error && import.meta.env.DEV ? ` (${error.message})` : ""}.
        </p>
      )}

      {!isLoading && !isError && data?.length === 0 && (
        <p className="text-sm text-muted-foreground" role="status">
          No upcoming departures found for the next few hours.
        </p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((dep) => (
            <DepartureRow key={`${dep.trainNumber}-${dep.time}`} {...dep} />
          ))}
        </ul>
      )}
    </section>
  );
}
