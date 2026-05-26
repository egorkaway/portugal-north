import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PostHogPageView } from "@/components/PostHogPageView";
import { PwaInstallListener } from "@/components/PwaInstallListener";
import { PwaPermissionsPrompt } from "@/components/PwaPermissionsPrompt";
import { VoteSyncBootstrap } from "@/components/VoteSyncBootstrap";
import { VoteSyncNotice } from "@/components/VoteSyncNotice";
import { WebMcpBridge } from "@/components/WebMcpBridge";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import Index from "./pages/Index.tsx";
import Rankings from "./pages/Rankings.tsx";
import Station from "./pages/Station.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PostHogPageView />
          <PwaInstallListener />
          <PwaPermissionsPrompt />
          <VoteSyncBootstrap />
          <VoteSyncNotice />
          <WebMcpBridge />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/stations/:slug" element={<Station />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;
