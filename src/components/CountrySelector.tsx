import { cn } from "@/lib/utils";
import { COUNTRY_CODES, COUNTRY_FLAGS, type CountryCode } from "@/lib/countries";
import { useLocale } from "@/i18n/LocaleProvider";

type CountrySelectorProps = {
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  className?: string;
};

type CountrySelectorBarProps = CountrySelectorProps & {
  labelClassName?: string;
  /** Light panel on hero image, or default on page content. */
  variant?: "hero" | "surface";
};

export function CountrySelectorBar({
  country,
  onCountryChange,
  className,
  labelClassName,
  variant = "surface",
}: CountrySelectorBarProps) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2",
        variant === "hero" &&
          "rounded-xl border border-border/80 bg-card/95 p-2 shadow-md ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10",
        className,
      )}
    >
      <p
        className={cn(
          "text-sm",
          variant === "hero" ? "font-medium text-foreground" : "text-muted-foreground",
          labelClassName,
        )}
      >
        {t("country.stationsIn")}
      </p>
      <CountrySelector country={country} onCountryChange={onCountryChange} />
    </div>
  );
}

export function CountrySelector({ country, onCountryChange, className }: CountrySelectorProps) {
  const { t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t("country.label")}
      className={cn(
        "inline-flex rounded-full border border-border bg-card p-1 shadow-sm",
        className,
      )}
    >
      {COUNTRY_CODES.map((code) => {
        const active = country === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => onCountryChange(code)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors sm:px-4",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {COUNTRY_FLAGS[code]} {t(`country.${code}`)}
          </button>
        );
      })}
    </div>
  );
}
