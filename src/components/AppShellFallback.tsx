/** Instant shell while JS bundles load or route chunks suspend. */
export function AppShellFallback() {
  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#1a2a32]">
      <header className="relative overflow-hidden bg-[#1c756c] px-4 py-12 text-white md:px-6 md:py-28">
        <div className="absolute inset-0 bg-[#1c756c]/80" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl">
          <h1 className="mb-2 font-serif text-3xl tracking-tight md:mb-4 md:text-5xl">
            Sustainable Iberian
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Train stations and airports across Portugal and Spain, with line info and budget hotels
            near key stops.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-4 md:px-6">
        <div className="mb-4 h-10 animate-pulse rounded-lg bg-[#e2e8ee]" aria-hidden="true" />
        <p className="mb-4 text-sm text-[#5c6f7a]">Loading stations…</p>
        <div
          className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-[#e2e8ee] bg-white"
            >
              <div className="aspect-[16/9] animate-pulse bg-[#e2e8ee]" />
              <div className="space-y-3 p-4 md:p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-[#e2e8ee]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#e2e8ee]" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-[#e2e8ee]" />
                  <div className="h-6 w-20 animate-pulse rounded-full bg-[#e2e8ee]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function removeStaticAppShell(): void {
  document.getElementById("static-app-shell")?.remove();
}
