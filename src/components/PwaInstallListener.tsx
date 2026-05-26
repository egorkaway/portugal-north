import { useEffect } from "react";
import { markPwaJustInstalled } from "@/lib/pwaInstall";

/** Records the `appinstalled` event so we can prompt in the installing browser tab. */
export function PwaInstallListener() {
  useEffect(() => {
    const onInstalled = () => markPwaJustInstalled();
    window.addEventListener("appinstalled", onInstalled);
    return () => window.removeEventListener("appinstalled", onInstalled);
  }, []);

  return null;
}
