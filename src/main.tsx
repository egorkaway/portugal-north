import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { PostHogProvider } from "posthog-js/react";
import { registerSW } from "virtual:pwa-register";
import App from "./App.tsx";
import { initPostHog, isPostHogEnabled, posthog } from "./lib/posthog.ts";
import "./index.css";

registerSW({
  immediate: true,
  onRegisteredSW(_url, registration) {
    if (!registration) return;
    void registration.update();
  },
});
initPostHog();

const app = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

createRoot(document.getElementById("root")!).render(
  isPostHogEnabled ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app,
);
