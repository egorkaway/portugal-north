import { Thermometer } from "lucide-react";
import { useStationMonthlyTemperature } from "@/hooks/useStationMonthlyTemperature";
import { useLocale } from "@/i18n/LocaleProvider";

export function StationMonthlyTemperatureCard({ stationName }: { stationName: string }) {
  const { t } = useLocale();
  const { entry, visible, isLoading, isError } = useStationMonthlyTemperature(stationName);

  if (isError || isLoading || !visible || !entry) return null;

  return (
    <section
      className="mb-6 rounded-lg border border-border bg-card p-4 md:mb-10 md:p-5"
      aria-labelledby="monthly-temp-heading"
    >
      <div className="flex items-start gap-3">
        <Thermometer className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id="monthly-temp-heading" className="font-display text-xl text-foreground md:text-2xl">
            {t("station.monthlyTempTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("station.monthlyTempBody")}</p>
          <p className="mt-4 text-lg font-medium tabular-nums text-foreground md:text-xl">
            {t("station.monthlyTempSummary", {
              low: String(entry.avgLowC),
              high: String(entry.avgHighC),
            })}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("station.monthlyTempMeta", {
              days: String(entry.dayCount),
              samples: String(entry.sampleCount),
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
