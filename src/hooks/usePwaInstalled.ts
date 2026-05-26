import { useSyncExternalStore } from "react";
import { isPwaInstalledContext, subscribePwaInstall } from "@/lib/pwaInstall";

export function usePwaInstalled(): boolean {
  return useSyncExternalStore(
    subscribePwaInstall,
    isPwaInstalledContext,
    () => false,
  );
}
