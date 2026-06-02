import { ExternalLink, Smartphone } from "lucide-react";
import { YESIM_AIRPORT_URL } from "@/lib/airportStation";
import { useLocale } from "@/i18n/LocaleProvider";

export function StationYesimPromo() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="yesim-promo-heading"
      className="mt-6 rounded-lg border border-border bg-card p-4 md:mt-8 md:p-5"
    >
      <div className="flex gap-3 md:gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:h-11 md:w-11"
          aria-hidden="true"
        >
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2
            id="yesim-promo-heading"
            className="font-display text-lg text-foreground md:text-xl"
          >
            {t("station.yesimTitle")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t("station.yesimBody")}
          </p>
          <a
            href={YESIM_AIRPORT_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("station.yesimCta")}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="mt-2 text-xs text-muted-foreground">{t("station.yesimNote")}</p>
        </div>
      </div>
    </section>
  );
}
