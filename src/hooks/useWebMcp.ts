import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerWebMcpTools } from "@/lib/webmcp/registerWebMcp";

/** Registers WebMCP tools on mount (Chrome WebMCP EPP / supporting browsers). */
export function useWebMcp(): void {
  const navigate = useNavigate();

  useEffect(() => {
    const controller = registerWebMcpTools(navigate);
    return () => controller.abort();
  }, [navigate]);
}
