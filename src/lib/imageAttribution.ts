import { pexelsPhotoCredits } from "@/data/pexelsPhotoCredits";
import { pexelsPhotoIdFromUrl } from "@/lib/pexelsPhotoId";

/** Image creator / credit / copyright for JSON-LD ImageObject (Google image metadata). */

export type ImageAttribution = {
  creator: { "@type": "Person" | "Organization"; name: string };
  creditText: string;
  copyrightNotice: string;
  license?: string;
  acquireLicensePage?: string;
  /** Optional link targets for on-page credit UI. */
  authorUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
};

const CC_BY_SA_NOTICE =
  "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)";
const CC_BY_SA_LICENSE = "https://creativecommons.org/licenses/by-sa/4.0/";
const WIKIMEDIA_COMMONS = "https://commons.wikimedia.org/";
const PEXELS_LICENSE = "https://www.pexels.com/license/";

const SITE_NAME = "Sustainable Iberian";

function humanizeSlug(slug: string): string {
  return slug.replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

/** Basename from URL path (handles Wikimedia /thumb/.../960px-name.jpg). */
export function filenameFromImageUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const segment = decodeURIComponent(pathname.split("/").pop() ?? "");
    return segment.startsWith("960px-") ? segment.slice(6) : segment;
  } catch {
    return "";
  }
}

/** Best-effort author name from a Wikimedia Commons filename. */
export function wikimediaCreatorFromFilename(filename: string): string | null {
  const flickrUser = filename.match(/Flickr_-_(.+?)_-_/i);
  if (flickrUser?.[1]) {
    return humanizeSlug(flickrUser[1]);
  }

  const trailingAuthor = filename.match(/_-_(.+?)\.[a-z0-9]+$/i);
  if (trailingAuthor?.[1]) {
    const candidate = trailingAuthor[1];
    if (!/^\d+$/.test(candidate) && !candidate.includes("(")) {
      return humanizeSlug(candidate);
    }
  }

  return null;
}

function wikimediaFilePageUrl(filename: string): string {
  const title = `File:${filename}`;
  return `${WIKIMEDIA_COMMONS}wiki/${encodeURIComponent(title)}`;
}

function attributionForPexelsCredit(credit: {
  photographer: string;
  photographerUrl: string;
  photoPageUrl: string;
}): ImageAttribution {
  return {
    creator: { "@type": "Person", name: credit.photographer },
    creditText: `${credit.photographer} on Pexels`,
    copyrightNotice: "Free to use under the Pexels License",
    license: PEXELS_LICENSE,
    acquireLicensePage: credit.photoPageUrl || PEXELS_LICENSE,
    authorUrl: credit.photographerUrl || undefined,
    sourceUrl: credit.photoPageUrl || PEXELS_LICENSE,
    sourceName: "Pexels",
  };
}

export function attributionForImageUrl(imageUrl: string): ImageAttribution {
  const pexelsId = pexelsPhotoIdFromUrl(imageUrl);
  if (pexelsId) {
    const credit = pexelsPhotoCredits[pexelsId];
    if (credit) {
      return attributionForPexelsCredit(credit);
    }
  }

  if (imageUrl.includes("wikimedia.org") || imageUrl.includes("wikipedia.org")) {
    const filename = filenameFromImageUrl(imageUrl);
    const authorName = wikimediaCreatorFromFilename(filename);
    const creator = authorName
      ? { "@type": "Person" as const, name: authorName }
      : { "@type": "Organization" as const, name: "Wikimedia Commons" };
    const creditText = authorName
      ? `${authorName} via Wikimedia Commons`
      : "Wikimedia Commons";
    const filePage = filename ? wikimediaFilePageUrl(filename) : WIKIMEDIA_COMMONS;
    return {
      creator,
      creditText,
      copyrightNotice: CC_BY_SA_NOTICE,
      license: CC_BY_SA_LICENSE,
      acquireLicensePage: filePage,
      authorUrl: filePage,
      sourceUrl: WIKIMEDIA_COMMONS,
      sourceName: "Wikimedia Commons",
    };
  }

  if (imageUrl.includes("pexels.com")) {
    return {
      creator: { "@type": "Organization", name: "Pexels" },
      creditText: "Photo via Pexels",
      copyrightNotice: "Free to use under the Pexels License",
      license: PEXELS_LICENSE,
      acquireLicensePage: PEXELS_LICENSE,
      sourceUrl: PEXELS_LICENSE,
      sourceName: "Pexels",
    };
  }

  return {
    creator: { "@type": "Organization", name: SITE_NAME },
    creditText: SITE_NAME,
    copyrightNotice: `© ${SITE_NAME}`,
  };
}

export function siteLogoAttribution(): ImageAttribution {
  return {
    creator: { "@type": "Organization", name: SITE_NAME },
    creditText: SITE_NAME,
    copyrightNotice: `© ${SITE_NAME}`,
  };
}
