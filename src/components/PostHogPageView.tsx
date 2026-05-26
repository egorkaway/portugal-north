import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capturePostHog, isPostHogEnabled } from "@/lib/posthog";

/** Sends `$pageview` on client-side route changes (React Router SPA). */
export function PostHogPageView() {
  const location = useLocation();

  useEffect(() => {
    if (!isPostHogEnabled) return;
    capturePostHog("$pageview", {
      $current_url: window.location.href,
    });
  }, [location.pathname, location.search]);

  return null;
}
