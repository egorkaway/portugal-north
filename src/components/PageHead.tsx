import { Helmet } from "react-helmet-async";
import { useLocale } from "@/i18n/LocaleProvider";
import type { PageMeta } from "@/lib/pageMeta";
import { absoluteUrl } from "@/lib/site";

type PageHeadProps = {
  meta: PageMeta;
};

/** Per-route title, description, canonical, and social tags (mirrored in static HTML at build). */
export function PageHead({ meta }: PageHeadProps) {
  const { locale, t } = useLocale();
  const ogImage = meta.ogImagePath?.startsWith("http")
    ? meta.ogImagePath
    : absoluteUrl(meta.ogImagePath ?? "/og-image.jpg");
  const ogTitle = meta.ogTitle ?? meta.title;
  const ogDescription = meta.ogDescription ?? meta.description;
  const pageUrl = absoluteUrl(meta.canonicalPath);

  return (
    <Helmet prioritizeSeoTags>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.robots && <meta name="robots" content={meta.robots} />}
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={t("meta.siteName")} />
      <html lang={locale} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      {(!meta.ogImagePath || meta.ogImagePath === "/og-image.jpg") && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@egorkaway" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
