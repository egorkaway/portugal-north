import { Link } from "react-router-dom";
import { RankingsPanel } from "@/components/RankingsPanel";
import { useLocale } from "@/i18n/LocaleProvider";

export function StationRankings() {
  const { t } = useLocale();

  return (
    <section
      aria-labelledby="community-rankings-heading"
      className="mx-auto max-w-5xl border-t border-border px-4 py-8 md:px-6 md:py-12"
    >
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:mb-6">
        <div>
          <h2
            id="community-rankings-heading"
            className="mb-1 font-display text-xl text-foreground md:mb-2 md:text-3xl"
          >
            {t("rankings.communityTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("rankings.communityTeaser")}</p>
        </div>
        <Link
          to="/rankings"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline shrink-0"
        >
          {t("rankings.fullPage")}
        </Link>
      </div>
      <RankingsPanel stationsOnly rankingsHref="/rankings" />
    </section>
  );
}
