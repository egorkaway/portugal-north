import { useState } from "react";
import { Download } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { useAllVisited } from "@/hooks/useStationVisited";
import { downloadBlob, listVisitedStations, renderVisitedMapPng } from "@/lib/visitedMapPng";

export function VisitedMapDownload() {
  const { t, plural } = useLocale();
  const visited = useAllVisited();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const count = listVisitedStations(visited).length;

  async function onDownload() {
    if (count === 0 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { blob, filename } = await renderVisitedMapPng({
        visitedMap: visited,
        title: t("map.visitedMapTitle"),
        countLabel: plural("map.visitedMapCount", count, { count }),
      });
      downloadBlob(blob, filename);
    } catch {
      setError(t("map.visitedMapError"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 border-t border-border pt-6 sm:mt-10" aria-labelledby="visited-map-download-heading">
      <h2
        id="visited-map-download-heading"
        className="font-display text-xl text-foreground"
      >
        {t("map.visitedMapTitle")}
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{t("map.visitedMapIntro")}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {count === 0
          ? t("map.visitedMapEmpty")
          : plural("map.visitedMapCount", count, { count })}
      </p>
      <button
        type="button"
        disabled={count === 0 || busy}
        onClick={() => void onDownload()}
        className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {busy ? t("map.visitedMapBusy") : t("map.visitedMapDownload")}
      </button>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </section>
  );
}
