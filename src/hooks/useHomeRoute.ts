import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { writeStoredHomeScope, type HomeScope } from "@/lib/countries";
import { buildHomePath } from "@/lib/homeRoute";

export function useHomeRoute(scope: HomeScope, currentPage: number) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page: pageParam } = useParams();

  const setScope = useCallback(
    (nextScope: HomeScope) => {
      writeStoredHomeScope(nextScope);
      navigate(buildHomePath(nextScope, 1), { replace: true });
    },
    [navigate],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      navigate(buildHomePath(scope, nextPage, searchParams), { replace: true });
    },
    [scope, navigate, searchParams],
  );

  const goToFirstPage = useCallback(() => {
    if (!pageParam) return;
    navigate(buildHomePath(scope, 1, searchParams), { replace: true });
  }, [scope, navigate, pageParam, searchParams]);

  const setSearchQuery = useCallback(
    (value: string) => {
      const next = new URLSearchParams();
      if (value.trim()) next.set("q", value);
      navigate(buildHomePath(scope, 1, next), { replace: true });
    },
    [scope, navigate],
  );

  return {
    scope,
    currentPage,
    setScope,
    setPage,
    goToFirstPage,
    setSearchQuery,
    searchQuery: searchParams.get("q") ?? "",
  };
}
