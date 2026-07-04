import { useEffect } from "react";
import { checkForServiceWorkerUpdate, shouldCheckForServiceWorkerUpdate } from "@/lib/appUpdate";

/** Hourly service worker update check while the app is open (Safari PWA cache). */
export function AppUpdateBootstrap() {
  useEffect(() => {
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
