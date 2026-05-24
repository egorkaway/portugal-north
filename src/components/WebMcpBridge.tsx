import { useWebMcp } from "@/hooks/useWebMcp";

/** Invisible bridge: registers navigator.modelContext tools for AI agents. */
export function WebMcpBridge() {
  useWebMcp();
  return null;
}
