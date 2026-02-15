import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import ChapterView from "./pages/ChapterView";
import Enroll from "./pages/Enroll";
import Community from "./pages/Community";
import Feedback from "./pages/Feedback";
import Store from "./pages/Store";
import ScrumSimulation from "./pages/ScrumSimulation";
import Referral from "./pages/Referral";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterView />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/community" element={<Community />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/store" element={<Store />} />
        <Route path="/simulation" element={<ScrumSimulation />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
