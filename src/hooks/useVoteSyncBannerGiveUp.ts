import { useEffect, useState } from "react";

export const VOTE_SYNC_BANNER_GIVE_UP_MS = 30_000;

export function shouldShowVoteSyncBanner({
  pending,
  online,
  giveUp,
}: {
  pending: number;
  online: boolean;
  giveUp: boolean;
}): boolean {
  if (pending === 0) return false;
  if (!online) return true;
  return !giveUp;
}

/** Hides the online "syncing votes" banner after sustained failed sync attempts. */
export function useVoteSyncBannerGiveUp(pending: number, online: boolean): boolean {
  const [giveUp, setGiveUp] = useState(false);

  useEffect(() => {
    if (pending === 0 || !online) {
      setGiveUp(false);
      return;
    }

    setGiveUp(false);
    const timer = setTimeout(() => setGiveUp(true), VOTE_SYNC_BANNER_GIVE_UP_MS);
    return () => clearTimeout(timer);
  }, [pending, online]);

  return giveUp;
}
