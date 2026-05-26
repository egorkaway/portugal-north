import { WifiOff } from "lucide-react";
import type { RatingsSource } from "@/lib/voteTypes";
import { useLocale } from "@/i18n/LocaleProvider";

export function OfflineRatingsBanner({ source }: { source?: RatingsSource }) {
  const { t } = useLocale();

  if (source === "cache") {
    return (
      <p
        className="mb-3 flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground md:mb-4"
        role="status"
      >
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t("rankings.offlineCached")}
      </p>
    );
  }

  if (source === "device") {
    return (
      <p
        className="mb-3 flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground md:mb-4"
        role="status"
      >
        <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t("rankings.offlineDevice")}
      </p>
    );
  }

  return null;
}
