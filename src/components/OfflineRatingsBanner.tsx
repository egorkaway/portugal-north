import { AlertCircle, WifiOff } from "lucide-react";
import type { RatingsSource } from "@/lib/voteTypes";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLocale } from "@/i18n/LocaleProvider";

type FallbackMessageKey =
  | "rankings.cachedFallback"
  | "rankings.cachedFallbackOffline"
  | "rankings.deviceFallback"
  | "rankings.deviceFallbackOffline";

export function getRatingsFallbackMessageKey(
  source: RatingsSource,
  online: boolean,
): FallbackMessageKey | null {
  if (source === "cache") {
    return online ? "rankings.cachedFallback" : "rankings.cachedFallbackOffline";
  }
  if (source === "device") {
    return online ? "rankings.deviceFallback" : "rankings.deviceFallbackOffline";
  }
  return null;
}

export function OfflineRatingsBanner({ source }: { source?: RatingsSource }) {
  const { t } = useLocale();
  const online = useOnlineStatus();

  if (!source || source === "network") return null;

  const messageKey = getRatingsFallbackMessageKey(source, online);
  if (!messageKey) return null;

  const Icon = online ? AlertCircle : WifiOff;

  return (
    <p
      className="mb-3 flex items-start gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground md:mb-4"
      role="status"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {t(messageKey)}
    </p>
  );
}
