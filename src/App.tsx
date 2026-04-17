import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useCartSync } from "@/hooks/useCartSync";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import ChapterView from "./pages/ChapterView";
import Enroll from "./pages/Enroll";
import Community from "./pages/Community";
import Feedback from "./pages/Feedback";
import Store from "./pages/Store";
import ScrumSimulation from "./pages/ScrumSimulation";
import Referral from "./pages/Referral";
import MarketingKit from "./pages/MarketingKit";
import ReferralProfile from "./pages/ReferralProfile";
import StudentPortal from "./pages/StudentPortal";
import AdminDashboard from "./pages/AdminDashboard";
import ResumeStudio from "./pages/ResumeStudio";
import InterviewSimulator from "./pages/InterviewSimulator";
import NotFound from "./pages/NotFound";
import HomepageBot from "@/components/HomepageBot";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const RouterAwareFloat = () => {
  const { pathname } = useLocation();
  const isPortal = pathname.startsWith("/portal") || pathname.startsWith("/course") || pathname.startsWith("/chapter") || pathname.startsWith("/dashboard");
  return isPortal ? null : <HomepageBot />;
};

const AppContent = () => {
  useCartSync();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId/chapter/:chapterId" element={<ProtectedRoute><ChapterView /></ProtectedRoute>} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/community" element={<Community />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/store" element={<Store />} />
        <Route path="/simulation" element={<ScrumSimulation />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/referral/kit" element={<MarketingKit />} />
        <Route path="/refer/:code" element={<ReferralProfile />} />
        <Route path="/portal" element={<ProtectedRoute><StudentPortal /></ProtectedRoute>} />
        <Route path="/resume-studio" element={<ProtectedRoute><ResumeStudio /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewSimulator /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireSubscription={false}><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RouterAwareFloat />
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
