import { lazy, Suspense, type ComponentType } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { withShellDismiss } from "@/components/AppShellFallback";
import { ScrollToTop } from "@/components/ScrollToTop";
import { DeferredClientBootstraps } from "@/components/DeferredClientBootstraps";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import HomeRedirect from "./pages/HomeRedirect.tsx";
import Index from "./pages/Index.tsx";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const Analytics = lazy(() =>
  import("@vercel/analytics/react").then((module) => ({ default: module.Analytics })),
);

const lazyPage = <P extends object>(loader: () => Promise<{ default: ComponentType<P> }>) =>
  lazy(() => loader().then((module) => ({ default: withShellDismiss(module.default) })));

const Rankings = lazyPage(() => import("./pages/Rankings.tsx"));
const Station = lazyPage(() => import("./pages/Station.tsx"));
const NotFound = lazyPage(() => import("./pages/NotFound.tsx"));
const Tickets = lazyPage(() => import("./pages/Tickets.tsx"));
const MapPage = lazyPage(() => import("./pages/Map.tsx"));
const Privacy = lazyPage(() => import("./pages/Privacy.tsx"));
const Trip = lazyPage(() => import("./pages/Trip.tsx"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <DeferredClientBootstraps />
            <div className="pb-24 sm:pb-0">
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/all" element={<Index />} />
                  <Route path="/all/:page" element={<Index />} />
                  <Route path="/pt" element={<Index />} />
                  <Route path="/pt/:page" element={<Index />} />
                  <Route path="/es" element={<Index />} />
                  <Route path="/es/:page" element={<Index />} />
                  <Route path="/rankings" element={<Rankings />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/trip" element={<Trip />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/stations/:slug" element={<Station />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <MobileBottomNav />
          </BrowserRouter>
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </TooltipProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};

export default App;
