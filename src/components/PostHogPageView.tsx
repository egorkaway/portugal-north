import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isPostHogEnabled, posthog } from "@/lib/posthog";

/** Sends `$pageview` on client-side route changes (React Router SPA). */
export function PostHogPageView() {
  const location = useLocation();

  useEffect(() => {
    if (!isPostHogEnabled) return;
    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [location.pathname, location.search]);

  return null;
}
