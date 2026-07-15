import { useEffect } from "react";
import {
  checkForServiceWorkerUpdate,
  ensureLatestBuild,
  shouldCheckForServiceWorkerUpdate,
} from "@/lib/appUpdate";

/** Background update checks and one-shot stale-bundle recovery (Safari/PWA). */
export function AppUpdateBootstrap() {
  useEffect(() => {
    void ensureLatestBuild();

    const runCheck = () => {
      if (shouldCheckForServiceWorkerUpdate()) {
        void checkForServiceWorkerUpdate();
      }
    };

    runCheck();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        runCheck();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return null;
}
