import { useEffect, useState } from "react";
import { CAMINO_APP_STORE_URL, caminoStoreUrl } from "@/lib/caminoStore";

/** Client-resolved Camino store URL (Play on Android, App Store otherwise). */
export function useCaminoStoreUrl(): string {
  const [url, setUrl] = useState(CAMINO_APP_STORE_URL);

  useEffect(() => {
    setUrl(caminoStoreUrl());
  }, []);

  return url;
}
