import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { PostHogProvider } from "posthog-js/react";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ensureLatestBuild } from "@/lib/appUpdate";
import { initPostHog, isPostHogEnabled, posthog } from "./lib/posthog.ts";
import "./index.css";

try {
  registerSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      void registration.update();
    },
    onRegisterError(error) {
      console.warn("Service worker registration failed", error);
    },
  });
} catch (error) {
  console.warn("Service worker setup failed", error);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

try {
  initPostHog();
} catch (error) {
  console.warn("Analytics init failed", error);
}

const app = (
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
);

async function bootstrap() {
  const reloading = await ensureLatestBuild();
  if (reloading) return;

  createRoot(document.getElementById("root")!).render(
    isPostHogEnabled ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app,
  );
}

void bootstrap();
