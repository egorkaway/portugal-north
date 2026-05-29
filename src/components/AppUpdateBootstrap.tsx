import { useEffect } from "react";
import { checkForServiceWorkerUpdate, shouldCheckForServiceWorkerUpdate } from "@/lib/appUpdate";

/** Weekly service worker update check so Safari picks up new station/hotel bundles. */
export function AppUpdateBootstrap() {
  useEffect(() => {
    if (shouldCheckForServiceWorkerUpdate()) {
      void checkForServiceWorkerUpdate();
    }

    const onVisible = () => {
      if (document.visibilityState === "visible" && shouldCheckForServiceWorkerUpdate()) {
        void checkForServiceWorkerUpdate();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return null;
}
