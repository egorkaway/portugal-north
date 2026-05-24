function estimateMarkdownTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4);
}

export const config = {
  matcher: [
    /*
     * Page routes only: skip API, well-known, docs, and static files with extensions.
     */
    "/((?!api/|\\.well-known/|docs/|.*\\.[\\w-]+$).*)",
  ],
};

function wantsMarkdown(request: Request): boolean {
  const accept = request.headers.get("accept") ?? "";
  return /\btext\/markdown\b/i.test(accept);
}

function toMarkdownPath(pathname: string): string {
  if (pathname === "/" || pathname === "") return "/index.md";
  return pathname.endsWith("/") ? `${pathname}index.md` : `${pathname}/index.md`;
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  if (!wantsMarkdown(request)) {
    return undefined;
  }

  const url = new URL(request.url);
  const mdPath = toMarkdownPath(url.pathname);
  const mdUrl = new URL(mdPath, request.url);

  const headers = new Headers(request.headers);
  headers.set("accept", "text/html,*/*");

  const upstream = await fetch(mdUrl.toString(), {
    method: request.method === "HEAD" ? "HEAD" : "GET",
    headers,
  });

  if (upstream.status === 404) {
    return undefined;
  }

  const text = request.method === "HEAD" ? "" : await upstream.text();
  const tokenCount = estimateMarkdownTokens(text);

  const responseHeaders = new Headers({
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
    "x-markdown-tokens": String(tokenCount),
    "Content-Signal": "ai-train=no, search=yes, ai-input=no",
  });

  const cacheControl = upstream.headers.get("cache-control");
  if (cacheControl) responseHeaders.set("Cache-Control", cacheControl);

  return new Response(text, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
