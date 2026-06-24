import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { PostHogProvider } from "posthog-js/react";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

createRoot(document.getElementById("root")!).render(
  isPostHogEnabled ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app,
);
