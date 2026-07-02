import { Navigate, useSearchParams } from "react-router-dom";
import { DEFAULT_HOME_SCOPE, readStoredHomeScope } from "@/lib/countries";
import { buildHomePath, resolveLegacyHomePath } from "@/lib/homeRoute";

/** `/` → `/all` (or stored scope) or legacy `?country=` / `?page=` paths. */
export default function HomeRedirect() {
  const [searchParams] = useSearchParams();
  const hasLegacyQuery =
    searchParams.has("country") ||
    searchParams.has("page") ||
    searchParams.has("q");

  if (hasLegacyQuery) {
    return <Navigate to={resolveLegacyHomePath(searchParams)} replace />;
  }

  const stored = readStoredHomeScope();
  return <Navigate to={buildHomePath(stored ?? DEFAULT_HOME_SCOPE)} replace />;
}
