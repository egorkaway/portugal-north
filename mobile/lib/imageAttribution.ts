import pexelsPhotoCreditsJson from '@/data/pexelsPhotoCredits.json';

type PexelsPhotoCredit = {
  photographer: string;
  photographerUrl: string;
  photoPageUrl: string;
};

const pexelsPhotoCredits = pexelsPhotoCreditsJson as Record<string, PexelsPhotoCredit>;

export type ImageAttribution = {
  creator: { type: 'Person' | 'Organization'; name: string };
  creditText: string;
  authorUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
};

const WIKIMEDIA_COMMONS = 'https://commons.wikimedia.org/';
const PEXELS_LICENSE = 'https://www.pexels.com/license/';
const PLACEHOLDER_MARKERS = ['Comboios_de_Portugal_logo.svg', 'station-placeholder'];

export function isPlaceholderImageUrl(url: string | undefined): boolean {
  if (!url) return true;
  return PLACEHOLDER_MARKERS.some((marker) => url.includes(marker));
}

function pexelsPhotoIdFromUrl(url: string): string | null {
  const match = url.match(/pexels\.com\/photos\/(\d+)\//i);
  return match?.[1] ?? null;
}

function humanizeSlug(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

function filenameFromImageUrl(url: string): string {
  try {
    const { pathname } = new URL(url);
    const segment = decodeURIComponent(pathname.split('/').pop() ?? '');
    return segment.startsWith('960px-') ? segment.slice(6) : segment;
  } catch {
    return '';
  }
}

function wikimediaCreatorFromFilename(filename: string): string | null {
  const flickrUser = filename.match(/Flickr_-_(.+?)_-_/i);
  if (flickrUser?.[1]) return humanizeSlug(flickrUser[1]);

  const trailingAuthor = filename.match(/_-_(.+?)\.[a-z0-9]+$/i);
  if (trailingAuthor?.[1]) {
    const candidate = trailingAuthor[1];
    if (!/^\d+$/.test(candidate) && !candidate.includes('(')) {
      return humanizeSlug(candidate);
    }
  }
  return null;
}

function wikimediaFilePageUrl(filename: string): string {
  return `${WIKIMEDIA_COMMONS}wiki/${encodeURIComponent(`File:${filename}`)}`;
}

/** Attribution for a station photo URL (Pexels / Wikimedia). */
export function attributionForImageUrl(imageUrl: string): ImageAttribution {
  const pexelsId = pexelsPhotoIdFromUrl(imageUrl);
  if (pexelsId) {
    const credit = pexelsPhotoCredits[pexelsId];
    if (credit) {
      return {
        creator: { type: 'Person', name: credit.photographer },
        creditText: `Photo by ${credit.photographer}`,
        authorUrl: credit.photographerUrl || undefined,
        sourceUrl: credit.photoPageUrl || PEXELS_LICENSE,
        sourceName: 'Pexels',
      };
    }
  }

  if (imageUrl.includes('wikimedia.org') || imageUrl.includes('wikipedia.org')) {
    const filename = filenameFromImageUrl(imageUrl);
    const authorName = wikimediaCreatorFromFilename(filename);
    const filePage = filename ? wikimediaFilePageUrl(filename) : WIKIMEDIA_COMMONS;
    if (authorName) {
      return {
        creator: { type: 'Person', name: authorName },
        creditText: `Photo by ${authorName}`,
        authorUrl: filePage,
        sourceUrl: WIKIMEDIA_COMMONS,
        sourceName: 'Wikimedia Commons',
      };
    }
    return {
      creator: { type: 'Organization', name: 'Wikimedia Commons' },
      creditText: 'Wikimedia Commons',
      sourceUrl: filePage,
      sourceName: 'Wikimedia Commons',
    };
  }

  if (imageUrl.includes('pexels.com')) {
    return {
      creator: { type: 'Organization', name: 'Pexels' },
      creditText: 'Photo via Pexels',
      sourceUrl: PEXELS_LICENSE,
      sourceName: 'Pexels',
    };
  }

  return {
    creator: { type: 'Organization', name: 'VeryStays' },
    creditText: 'VeryStays',
  };
}

/** True when the station photo should show an on-page credit line. */
export function shouldShowStationImageCredit(imageUrl: string | undefined): boolean {
  if (!imageUrl || isPlaceholderImageUrl(imageUrl)) return false;
  const attribution = attributionForImageUrl(imageUrl);
  return (
    attribution.creator.type === 'Person' ||
    attribution.sourceName === 'Wikimedia Commons' ||
    attribution.sourceName === 'Pexels'
  );
}
