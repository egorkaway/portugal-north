import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { SitePageNavLinks } from "@/components/SitePageNavLinks";
import { portugalTicketLinks, spainTicketLinks, ticketUrls } from "@/data/ticketLinks";
import { useLocale } from "@/i18n/LocaleProvider";
import { getTicketsPageMeta } from "@/lib/pageMeta";
import { defaultHomePath } from "@/lib/homeRoute";
import { ArrowLeft, CreditCard, Globe, Layers, Smartphone, Ticket, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";

const Tickets = () => {
  const { t, locale } = useLocale();

  return (
    <>
      <PageHead meta={getTicketsPageMeta(locale)} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <div className="mb-3 sm:mb-4">
              <Link
                to={defaultHomePath()}
                className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("nav.backToStations")}
              </Link>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <TrainFront className="h-7 w-7 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <h1 className="truncate font-display text-2xl md:text-4xl">{t("tickets.title")}</h1>
                  <p className="mt-1 text-sm text-primary-foreground/85">{t("tickets.subtitle")}</p>
                </div>
              </div>
              <SitePageNavLinks variant="hero" hide={["tickets"]} className="shrink-0" />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
          <div className="space-y-8">
            <p className="text-muted-foreground">{t("tickets.overviewSubtitle")}</p>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold">{t("tickets.countryPortugal")}</h2>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold md:text-xl">{t("tickets.howToBuyTitle")}</h3>
                <p className="text-muted-foreground">{t("tickets.portugalHowToBuyIntro")}</p>
                <p className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                  {t("tickets.portoVigoRenfeNote")}
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <Globe className="h-4 w-4 text-primary" aria-hidden="true" />
                      {t("tickets.buyOnlineTitle")}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyOnlineBody")}</p>
                    <p className="mt-2">
                      <a
                        href={ticketUrls.cpWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
                      >
                        {t("tickets.buyOnlineLink")}
                      </a>
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <Smartphone className="h-4 w-4 text-primary" aria-hidden="true" />
                      {t("tickets.buyInAppTitle")}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyInAppBody")}</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <a
                        href={ticketUrls.cpAppIos}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
                      >
                        {t("tickets.buyInAppIos")}
                      </a>
                      <a
                        href={ticketUrls.cpAppAndroid}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/90"
                      >
                        {t("tickets.buyInAppAndroid")}
                      </a>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <Ticket className="h-4 w-4 text-primary" aria-hidden="true" />
                      {t("tickets.buyAtStationTitle")}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyAtStationBody")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.buyOnboardNote")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold md:text-xl">{t("tickets.pricesTitle")}</h3>
                <p className="text-muted-foreground">{t("tickets.pricesIntro")}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <TrainFront className="h-4 w-4 text-primary" aria-hidden="true" />
                      {t("tickets.serviceTypesTitle")}
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      <li>{t("tickets.portugalServiceAP")}</li>
                      <li>{t("tickets.portugalServiceIC")}</li>
                      <li>{t("tickets.portugalServiceR")}</li>
                      <li>{t("tickets.portugalServiceU")}</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
                      {t("tickets.moneySavingTitle")}
                    </div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      <li>{t("tickets.tipAdvance")}</li>
                      <li>{t("tickets.tipFlexibility")}</li>
                      <li>{t("tickets.tipRailPass")}</li>
                      <li>{t("tickets.tipUrban")}</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                  {t("tickets.disclaimer")}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold md:text-xl">{t("tickets.metroTitle")}</h3>
                <p className="text-muted-foreground">{t("tickets.metroIntro")}</p>
                <p className="text-sm text-muted-foreground">{t("tickets.metroCombineNote")}</p>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-violet-600/20 bg-card p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <Layers className="h-4 w-4 text-violet-600" aria-hidden="true" />
                      {t("tickets.metroPortoTitle")}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroPortoBody")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroPortoZones")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroPortoTips")}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={ticketUrls.andante}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                      >
                        {t("tickets.metroPortoAndanteLink")}
                      </a>
                      <a
                        href={ticketUrls.metroPortoTariffs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                      >
                        {t("tickets.metroPortoTariffsLink")}
                      </a>
                    </div>
                  </div>

                  <div className="rounded-lg border border-violet-600/20 bg-card p-4">
                    <div className="flex items-center gap-2 font-medium">
                      <Layers className="h-4 w-4 text-violet-600" aria-hidden="true" />
                      {t("tickets.metroLisboaTitle")}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroLisboaBody")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroLisboaZones")}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{t("tickets.metroLisboaTips")}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={ticketUrls.navegante}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                      >
                        {t("tickets.metroLisboaNaveganteLink")}
                      </a>
                      <a
                        href={ticketUrls.metroLisboaTariffs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-violet-700 underline underline-offset-4 hover:text-violet-900 dark:text-violet-300"
                      >
                        {t("tickets.metroLisboaTariffsLink")}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                  {t("tickets.metroDisclaimer")}
                </div>
              </div>

              <TicketLinksSection
                title={t("tickets.usefulLinksTitle")}
                links={portugalTicketLinks}
                t={t}
              />
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold">{t("tickets.countrySpain")}</h2>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold md:text-xl">{t("tickets.howToBuyTitle")}</h3>
                <p className="text-muted-foreground">{t("tickets.spainHowToBuyIntro")}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold md:text-xl">{t("tickets.serviceTypesTitle")}</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  <li>{t("tickets.spainServiceAVE")}</li>
                  <li>{t("tickets.spainServiceAlvia")}</li>
                  <li>{t("tickets.spainServiceMedia")}</li>
                  <li>{t("tickets.spainServiceCommuter")}</li>
                </ul>
              </div>

              <TicketLinksSection title={t("tickets.usefulLinksTitle")} links={spainTicketLinks} t={t} />
            </section>

            <p className="text-sm text-muted-foreground">{t("tickets.overviewDisclaimer")}</p>
          </div>
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

function TicketLinksSection({
  title,
  links,
  t,
}: {
  title: string;
  links: typeof portugalTicketLinks;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold md:text-xl">{title}</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <div className="font-medium text-primary">{t(`tickets.${link.titleKey}`)}</div>
            <p className="mt-2 text-sm text-muted-foreground">{t(`tickets.${link.bodyKey}`)}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Tickets;
