import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { installChunkLoadRecovery } from "@/lib/chunkLoadRecovery";
import { registerPwaServiceWorker } from "@/lib/registerPwa.ts";
import "./index.css";

installChunkLoadRecovery();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>,
);

registerPwaServiceWorker();

void import("./lib/posthog.ts")
  .then(({ initPostHog }) => {
    initPostHog();
  })
  .catch((error) => {
    console.warn("Analytics init failed", error);
  });
