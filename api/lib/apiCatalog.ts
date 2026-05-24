/** RFC 9727 / RFC 9264 linkset for /.well-known/api-catalog */

export type LinksetLink = { href: string; type?: string };

export type ApiCatalogEntry = {
  anchor: string;
  "service-desc"?: LinksetLink[];
  "service-doc"?: LinksetLink[];
  status?: LinksetLink[];
};

export type ApiCatalogDocument = {
  linkset: ApiCatalogEntry[];
};

export function getSiteUrl(): string {
  const fromEnv = process.env.VITE_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "https://www.verystays.com";
}

export function buildApiCatalogLinkset(siteUrl = getSiteUrl()): ApiCatalogDocument {
  const base = siteUrl.replace(/\/$/, "");
  const apiAnchor = `${base}/api`;

  return {
    linkset: [
      {
        anchor: apiAnchor,
        "service-desc": [
          {
            href: `${base}/api/openapi.json`,
            type: "application/openapi+json",
          },
        ],
        "service-doc": [
          {
            href: `${base}/docs/api`,
            type: "text/markdown",
          },
        ],
        status: [
          {
            href: `${base}/api/votes?ping=1`,
            type: "application/json",
          },
        ],
      },
    ],
  };
}
