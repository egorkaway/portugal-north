import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DEFAULT_COUNTRY,
  isCountryCode,
  readStoredCountry,
  writeStoredCountry,
  type CountryCode,
} from "@/lib/countries";

function countryFromSearchParams(params: URLSearchParams): CountryCode | null {
  const value = params.get("country");
  return isCountryCode(value) ? value : null;
}

export function useCountrySelection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [country, setCountryState] = useState<CountryCode>(() => {
    return countryFromSearchParams(searchParams) ?? readStoredCountry() ?? DEFAULT_COUNTRY;
  });

  useEffect(() => {
    const fromUrl = countryFromSearchParams(searchParams);
    if (fromUrl) {
      setCountryState((current) => {
        if (current === fromUrl) return current;
        writeStoredCountry(fromUrl);
        return fromUrl;
      });
    }
  }, [searchParams]);

  const setCountry = useCallback(
    (nextCountry: CountryCode, options?: { clearSearch?: boolean; clearPage?: boolean }) => {
      setCountryState(nextCountry);
      writeStoredCountry(nextCountry);

      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (options?.clearSearch) {
            next.delete("q");
          }
          if (options?.clearPage) {
            next.delete("page");
          }
          if (nextCountry === DEFAULT_COUNTRY) {
            next.delete("country");
          } else {
            next.set("country", nextCountry);
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { country, setCountry };
}
