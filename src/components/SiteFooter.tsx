import { Link } from "react-router-dom";
import { ExternalLink, Footprints, Languages, Smartphone } from "lucide-react";
import footerDouro from "@/assets/footer-douro.jpg";
import { BuildNumberLabel } from "@/components/BuildNumberLabel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/i18n/LocaleProvider";
import {
  footerIntroMessageKeys,
  useFooterCountry,
  useFooterHomeScope,
} from "@/hooks/useFooterCountry";
import { APP_STORE_URL, appStoreBadgeSrc } from "@/lib/appStore";
import type { CountryCode, HomeScope } from "@/lib/countries";

export function SiteFooter({
  showIntro = true,
  country: countryOverride,
  scope: scopeOverride,
}: {
  showIntro?: boolean;
  country?: CountryCode;
  /** Home list scope — drives Portugal / Spain / Iberia intro copy. */
  scope?: HomeScope;
}) {
  const { locale, t } = useLocale();
  const country = useFooterCountry(countryOverride);
  const introScope = useFooterHomeScope(scopeOverride);
  const introKeys = footerIntroMessageKeys(introScope);

  return (
    <footer className="relative mt-8 overflow-hidden text-primary-foreground md:mt-12">
      <img
        src={footerDouro}
        alt=""
        width={1920}
        height={768}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
      <div className="relative mx-auto max-w-5xl px-4 py-6 text-center md:px-6 md:py-10">
        {showIntro && (
          <div className="mb-4 space-y-2 md:mb-5">
            <h2 className="font-display text-2xl leading-tight md:text-3xl">{t(introKeys.title)}</h2>
            <p className="mx-auto max-w-xl text-sm text-primary-foreground/90 md:text-base">
              {t(introKeys.subtitle)}
            </p>
            <p className="text-xs text-primary-foreground/70 md:text-sm">{t("footer.disclaimer")}</p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center pt-1"
            >
              <img
                src={appStoreBadgeSrc(locale)}
                alt={t("footer.appStoreBadgeAlt")}
                width={120}
                height={40}
                className="h-10 w-auto"
                loading="lazy"
              />
            </a>
          </div>
        )}

        <div
          className={
            showIntro
              ? "space-y-5 border-t border-primary-foreground/20 pt-5 md:space-y-8 md:pt-6"
              : "space-y-6 md:space-y-8"
          }
        >
          <LanguageSwitcher />

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
            <Link
              to="/lines"
              className="underline underline-offset-4 transition-colors hover:text-primary-foreground"
            >
              {t("nav.lines")}
            </Link>
            <Link
              to="/privacy"
              className="underline underline-offset-4 transition-colors hover:text-primary-foreground"
            >
              {t("footer.privacy")}
            </Link>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground/60">
              {t("footer.alsoFromUs")}
            </p>
            <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="https://apps.apple.com/pt/app/my-personal-camino-de-santiago/id6761839093?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
              >
                <Footprints className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-primary-foreground">
                    {t("footer.caminoTitle")}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{t("footer.caminoDesc")}</p>
                </div>
                <ExternalLink
                  className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                  aria-hidden="true"
                />
              </a>
              <a
                href="https://getmapa.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-1 items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
              >
                <Smartphone className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl text-primary-foreground">
                    {t("footer.mapaTitle")}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{t("footer.mapaDesc")}</p>
                </div>
                <ExternalLink
                  className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                  aria-hidden="true"
                />
              </a>
              {country === "es" ? (
                <a
                  href="https://sovnik.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
                >
                  <Languages className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl text-primary-foreground">
                      {t("footer.sovnikTitle")}
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/80">{t("footer.sovnikDesc")}</p>
                  </div>
                  <ExternalLink
                    className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <a
                  href="https://portuguess.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-4 text-left backdrop-blur-sm transition-colors hover:border-primary-foreground/40 hover:bg-primary-foreground/15 md:gap-4 md:p-5"
                >
                  <Languages className="mt-0.5 h-8 w-8 shrink-0 text-secondary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl text-primary-foreground">
                      {t("footer.portuGuessTitle")}
                    </p>
                    <p className="mt-1 text-sm text-primary-foreground/80">
                      {t("footer.portuGuessDesc")}
                    </p>
                  </div>
                  <ExternalLink
                    className="mt-1 h-4 w-4 shrink-0 text-primary-foreground/50 transition-colors group-hover:text-primary-foreground"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          </div>

          <BuildNumberLabel className="mt-2 border-0 pt-0 text-primary-foreground/50" />
        </div>
      </div>
    </footer>
  );
}
