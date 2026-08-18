import { Platform, type ImageURISource } from 'react-native';

export const REMOTE_IMAGE_USER_AGENT = 'VeryStays/1.0 (https://www.verystays.com)';

const SITE_BASE = 'https://www.verystays.com';

function isWikimediaHost(hostname: string): boolean {
  return (
    hostname === 'upload.wikimedia.org' ||
    hostname === 'commons.wikimedia.org' ||
    hostname.endsWith('.wikimedia.org') ||
    hostname.endsWith('.wikipedia.org')
  );
}

/** Android's default okhttp User-Agent is blocked by Wikimedia (HTTP 403). */
export function displayImageUrl(uri: string): string {
  if (Platform.OS !== 'android') return uri;
  try {
    const parsed = new URL(uri);
    if (!isWikimediaHost(parsed.hostname)) return uri;
    return `${SITE_BASE}/api/station-photo?u=${encodeURIComponent(uri)}`;
  } catch {
    return uri;
  }
}

export function remoteImageSource(uri: string): ImageURISource {
  return {
    uri: displayImageUrl(uri),
    headers: {
      'User-Agent': REMOTE_IMAGE_USER_AGENT,
    },
  };
}
