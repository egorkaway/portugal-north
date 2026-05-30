import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHead } from "@/components/PageHead";
import { SiteFooter } from "@/components/SiteFooter";
import { getPrivacyContent } from "@/content/privacy";
import { useLocale } from "@/i18n/LocaleProvider";
import { getPrivacyPageMeta } from "@/lib/pageMeta";

const Privacy = () => {
  const { locale, t } = useLocale();
  const content = getPrivacyContent(locale);
  const meta = getPrivacyPageMeta(locale);

  return (
    <>
      <PageHead meta={meta} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-4 py-5 md:px-6 md:py-8">
            <Link
              to="/"
              className="mb-3 inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground sm:mb-4"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("nav.backToStations")}
            </Link>
            <div className="flex items-center gap-3">
              <Shield className="h-7 w-7 shrink-0" aria-hidden="true" />
              <div>
                <h1 className="font-display text-2xl md:text-4xl">{content.title}</h1>
                <p className="mt-1 text-sm text-primary-foreground/85">{content.subtitle}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-10">

          <p className="text-sm text-muted-foreground">{content.lastUpdated}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{content.intro}</p>

          <div className="mt-8 space-y-8">
            {content.sections.map((section) => (
              <section key={section.id} aria-labelledby={`privacy-${section.id}`}>
                <h2
                  id={`privacy-${section.id}`}
                  className="font-display text-xl text-foreground md:text-2xl"
                >
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>

        <SiteFooter showIntro={false} />
      </div>
    </>
  );
};

export default Privacy;
