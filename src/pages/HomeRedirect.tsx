import { Navigate, useSearchParams } from "react-router-dom";
import { readStoredCountry } from "@/lib/countries";
import { buildHomePath, resolveLegacyHomePath } from "@/lib/homeRoute";

/** `/` → `/pt` or legacy `?country=` / `?page=` paths. */
export default function HomeRedirect() {
  const [searchParams] = useSearchParams();
  const hasLegacyQuery =
    searchParams.has("country") ||
    searchParams.has("page") ||
    searchParams.has("q");

  if (hasLegacyQuery) {
    return <Navigate to={resolveLegacyHomePath(searchParams)} replace />;
  }

  const stored = readStoredCountry();
  return <Navigate to={buildHomePath(stored ?? "pt")} replace />;
}
