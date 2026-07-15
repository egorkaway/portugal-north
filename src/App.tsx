import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShellFallback } from "@/components/AppShellFallback";
import { PostHogPageView } from "@/components/PostHogPageView";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PwaInstallListener } from "@/components/PwaInstallListener";
import { PwaPermissionsPrompt } from "@/components/PwaPermissionsPrompt";
import { AppUpdateBootstrap } from "@/components/AppUpdateBootstrap";
import { VoteSyncBootstrap } from "@/components/VoteSyncBootstrap";
import { ActiveTripBootstrap } from "@/components/ActiveTripBootstrap";
import { VoteSyncNotice } from "@/components/VoteSyncNotice";
import { WebMcpBridge } from "@/components/WebMcpBridge";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import HomeRedirect from "./pages/HomeRedirect.tsx";
import { MobileBottomNav } from "@/components/MobileBottomNav";

const Index = lazy(() => import("./pages/Index.tsx"));
const Rankings = lazy(() => import("./pages/Rankings.tsx"));
const Station = lazy(() => import("./pages/Station.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Tickets = lazy(() => import("./pages/Tickets.tsx"));
const MapPage = lazy(() => import("./pages/Map.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Trip = lazy(() => import("./pages/Trip.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppUpdateBootstrap />
          <ScrollToTop />
          <PostHogPageView />
          <PwaInstallListener />
          <PwaPermissionsPrompt />
          <VoteSyncBootstrap />
          <ActiveTripBootstrap />
          <VoteSyncNotice />
          <WebMcpBridge />
          <div className="pb-24 sm:pb-0">
            <Suspense fallback={<AppShellFallback />}>
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
        <Analytics />
      </TooltipProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;
