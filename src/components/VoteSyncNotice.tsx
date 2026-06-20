import { useSyncExternalStore } from "react";
import { CloudOff } from "lucide-react";
import {
  getPendingVoteSyncCount,
  subscribeVoteSyncQueue,
} from "@/lib/voteSyncQueue";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import {
  shouldShowVoteSyncBanner,
  useVoteSyncBannerGiveUp,
} from "@/hooks/useVoteSyncBannerGiveUp";
import { useLocale } from "@/i18n/LocaleProvider";

function usePendingVoteSyncCount() {
  return useSyncExternalStore(
    subscribeVoteSyncQueue,
    getPendingVoteSyncCount,
    () => 0,
  );
}

export function VoteSyncNotice() {
  const { t } = useLocale();
  const online = useOnlineStatus();
  const pending = usePendingVoteSyncCount();
  const giveUp = useVoteSyncBannerGiveUp(pending, online);

  if (!shouldShowVoteSyncBanner({ pending, online, giveUp })) return null;

  return (
    <p
      className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2 text-center text-xs text-muted-foreground sm:text-sm"
      role="status"
    >
      <CloudOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {online ? t("pwa.votesSyncing") : t("pwa.votesPendingSync", { count: pending })}
    </p>
  );
}
