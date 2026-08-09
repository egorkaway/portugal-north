import { Thermometer } from "lucide-react";
import { useStationMonthlyTemperature } from "@/hooks/useStationMonthlyTemperature";
import { monthlyTemperatureTone } from "@/lib/stationMonthlyTemperatures";
import { useLocale } from "@/i18n/LocaleProvider";

export function StationMonthlyTemperatureCard({ stationName }: { stationName: string }) {
  const { t } = useLocale();
  const { entry, visible, isLoading, isError } = useStationMonthlyTemperature(stationName);

  if (isError || isLoading || !visible || !entry) return null;

  return (
    <section
      className="rounded-lg border border-border bg-card p-4"
      aria-labelledby="monthly-temp-heading"
    >
      <div className="flex items-start gap-3">
        <Thermometer className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h2 id="monthly-temp-heading" className="font-display text-lg text-foreground md:text-xl">
            {t("station.monthlyTempTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("station.monthlyTempBody")}</p>
          <p className="mt-3 text-sm font-medium text-foreground">{t("station.monthlyTempThisMonth")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-base font-medium tabular-nums md:text-lg">
            <li>
              {t("station.monthlyTempAvgHigh")}{" "}
              <span className={monthlyTemperatureTone(entry.avgHighC)}>{entry.avgHighC}°C</span>
            </li>
            <li>
              {t("station.monthlyTempAvgLow")}{" "}
              <span className={monthlyTemperatureTone(entry.avgLowC)}>{entry.avgLowC}°C</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
