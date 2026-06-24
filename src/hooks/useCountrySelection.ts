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
    if (fromUrl && fromUrl !== country) {
      setCountryState(fromUrl);
      writeStoredCountry(fromUrl);
    }
  }, [searchParams, country]);

  const setCountry = useCallback(
    (nextCountry: CountryCode) => {
      setCountryState(nextCountry);
      writeStoredCountry(nextCountry);

      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
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
