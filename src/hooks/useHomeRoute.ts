import { useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { writeStoredCountry, type CountryCode } from "@/lib/countries";
import { buildHomePath } from "@/lib/homeRoute";

export function useHomeRoute(country: CountryCode, currentPage: number) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { page: pageParam } = useParams();

  const setCountry = useCallback(
    (nextCountry: CountryCode) => {
      writeStoredCountry(nextCountry);
      navigate(buildHomePath(nextCountry, 1), { replace: true });
    },
    [navigate],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      navigate(buildHomePath(country, nextPage, searchParams), { replace: true });
    },
    [country, navigate, searchParams],
  );

  const goToFirstPage = useCallback(() => {
    if (!pageParam) return;
    navigate(buildHomePath(country, 1, searchParams), { replace: true });
  }, [country, navigate, pageParam, searchParams]);

  const setSearchQuery = useCallback(
    (value: string) => {
      const next = new URLSearchParams();
      if (value.trim()) next.set("q", value);
      navigate(buildHomePath(country, 1, next), { replace: true });
    },
    [country, navigate],
  );

  return {
    country,
    currentPage,
    setCountry,
    setPage,
    goToFirstPage,
    setSearchQuery,
    searchQuery: searchParams.get("q") ?? "",
  };
}
