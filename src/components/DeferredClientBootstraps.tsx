import { lazy, Suspense, useEffect, useState } from "react";

const ClientBootstraps = lazy(() => import("@/components/ClientBootstraps"));

function useAfterFirstPaint() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(() => setReady(true), { timeout: 2_000 });
      return () => cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setReady(true), 1);
    return () => window.clearTimeout(id);
  }, []);

  return ready;
}

/** Loads analytics, sync, PWA helpers, and WebMCP after the UI is interactive. */
export function DeferredClientBootstraps() {
  const ready = useAfterFirstPaint();
  if (!ready) return null;

  return (
    <Suspense fallback={null}>
      <ClientBootstraps />
    </Suspense>
  );
}
