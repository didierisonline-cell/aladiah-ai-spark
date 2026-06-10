import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
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
import CommandCenter from "./pages/admin/CommandCenter";
import AgentOS from "./pages/admin/AgentOS";
import MarketingAgent from "./pages/admin/MarketingAgent";
import SeoAgent from "./pages/admin/SeoAgent";
import AIWorkforce from "./pages/admin/AIWorkforce";
import ProductAgent from "./pages/admin/ProductAgent";
import QAAgent from "./pages/admin/QAAgent";
import AdmissionsAgent from "./pages/admin/AdmissionsAgent";
import StudentSuccessAgent from "./pages/admin/StudentSuccessAgent";
import PlacementAgent from "./pages/admin/PlacementAgent";
import AnalyticsAgent from "./pages/admin/AnalyticsAgent";
import OperationsAgent from "./pages/admin/OperationsAgent";
import CurriculumExcellence from "./pages/admin/CurriculumExcellence";
import Approvals from "./pages/admin/Approvals";
import ResumeStudio from "./pages/ResumeStudio";
import InterviewSimulator from "./pages/InterviewSimulator";
import NotFound from "./pages/NotFound";
import HomepageBot from "@/components/HomepageBot";
import { useLocation } from "react-router-dom";
// New pages
import Schools from "./pages/Schools";
import Certifications from "./pages/Certifications";
import TalentNetwork from "./pages/TalentNetwork";
import Employers from "./pages/Employers";
import PortalTalentScore from "./pages/PortalTalentScore";
import PortalPortfolio from "./pages/PortalPortfolio";
import PortalSettings from "./pages/PortalSettings";
import PortalCourses from "./pages/PortalCourses";
import PortalCourseDetail from "./pages/PortalCourseDetail";
import MyCareerPath from "./pages/MyCareerPath";
import PortalSimulations from "./pages/PortalSimulations";
import PortalResources from "./pages/PortalResources";
import PortalCertifications from "./pages/PortalCertifications";

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
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/talent-network" element={<TalentNetwork />} />
        <Route path="/employers" element={<Employers />} />
        {/* Learning */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId/chapter/:chapterId" element={<ProtectedRoute><ChapterView /></ProtectedRoute>} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/community" element={<Community />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/store" element={<Store />} />
        <Route path="/simulation" element={<ScrumSimulation />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/referral/kit" element={<MarketingKit />} />
        <Route path="/refer/:code" element={<ReferralProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Portal */}
        <Route path="/portal" element={<ProtectedRoute><StudentPortal /></ProtectedRoute>} />
        <Route path="/portal/courses" element={<ProtectedRoute><PortalCourses /></ProtectedRoute>} />
        <Route path="/portal/course/:courseId" element={<ProtectedRoute><PortalCourseDetail /></ProtectedRoute>} />
        <Route path="/portal/talent-score" element={<ProtectedRoute><PortalTalentScore /></ProtectedRoute>} />
        <Route path="/portal/portfolio" element={<ProtectedRoute><PortalPortfolio /></ProtectedRoute>} />
        <Route path="/portal/settings" element={<ProtectedRoute><PortalSettings /></ProtectedRoute>} />
        <Route path="/portal/career" element={<ProtectedRoute><ResumeStudio /></ProtectedRoute>} />
        <Route path="/portal/my-career-path" element={<ProtectedRoute><MyCareerPath /></ProtectedRoute>} />
        <Route path="/portal/simulations" element={<ProtectedRoute><PortalSimulations /></ProtectedRoute>} />
        <Route path="/portal/resources" element={<ProtectedRoute><PortalResources /></ProtectedRoute>} />
        <Route path="/portal/certifications" element={<ProtectedRoute><PortalCertifications /></ProtectedRoute>} />
        {/* Tools */}
        <Route path="/resume-studio" element={<ProtectedRoute><ResumeStudio /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewSimulator /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/ai-workforce" element={<AdminRoute><AIWorkforce /></AdminRoute>} />
        <Route path="/admin/approvals" element={<AdminRoute><Approvals /></AdminRoute>} />
        <Route path="/admin/command-center" element={<AdminRoute><CommandCenter /></AdminRoute>} />
        <Route path="/admin/agent-os" element={<AdminRoute><AgentOS /></AdminRoute>} />
        <Route path="/admin/marketing-agent" element={<AdminRoute><MarketingAgent /></AdminRoute>} />
        <Route path="/admin/seo-agent" element={<AdminRoute><SeoAgent /></AdminRoute>} />
        <Route path="/admin/product-agent" element={<AdminRoute><ProductAgent /></AdminRoute>} />
        <Route path="/admin/qa-agent" element={<AdminRoute><QAAgent /></AdminRoute>} />
        <Route path="/admin/admissions-agent" element={<AdminRoute><AdmissionsAgent /></AdminRoute>} />
        <Route path="/admin/student-success" element={<AdminRoute><StudentSuccessAgent /></AdminRoute>} />
        <Route path="/admin/placement-agent" element={<AdminRoute><PlacementAgent /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AnalyticsAgent /></AdminRoute>} />
        <Route path="/admin/operations" element={<AdminRoute><OperationsAgent /></AdminRoute>} />
        <Route path="/admin/curriculum-excellence" element={<AdminRoute><CurriculumExcellence /></AdminRoute>} />
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
