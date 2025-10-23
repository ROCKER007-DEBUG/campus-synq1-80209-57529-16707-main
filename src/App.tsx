import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import Wellness from "./pages/Wellness";
import Forum from "./pages/Forum";
import Mentorship from "./pages/Mentorship";
import Events from "./pages/Events";
import Scholarships from "./pages/Scholarships";
import Blogs from "./pages/Blogs";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import Features from "./pages/Features";
import CareerNavigator from "./pages/CareerNavigator";
import MajorCareerMapping from "./pages/MajorCareerMapping";
import AlumniPath from "./pages/AlumniPath";
import SynqFinance from "./pages/SynqFinance";
import ExpenseTracker from "./pages/ExpenseTracker";
import ScholarshipDiscovery from "./pages/ScholarshipDiscovery";
import LoanCalculator from "./pages/LoanCalculator";
import BooksMarketplace from "./pages/BooksMarketplace";
import AIAssessmentSuite from "./pages/AIAssessmentSuite";
import SleepTracking from "./pages/wellness/SleepTracking";
import NutritionPlanning from "./pages/wellness/NutritionPlanning";
import GymBuddy from "./pages/wellness/GymBuddy";
import SubstanceAwareness from "./pages/wellness/SubstanceAwareness";
import SocialCalendar from "./pages/wellness/SocialCalendar";
import WorkLifeBalance from "./pages/wellness/WorkLifeBalance";
import BurnoutDetection from "./pages/wellness/BurnoutDetection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/wellness/sleep-tracking" element={<SleepTracking />} />
          <Route path="/wellness/nutrition" element={<NutritionPlanning />} />
          <Route path="/wellness/gym-buddy" element={<GymBuddy />} />
          <Route path="/wellness/substance-awareness" element={<SubstanceAwareness />} />
          <Route path="/wellness/social-calendar" element={<SocialCalendar />} />
          <Route path="/wellness/work-life-balance" element={<WorkLifeBalance />} />
          <Route path="/wellness/burnout-detection" element={<BurnoutDetection />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/events" element={<Events />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/community" element={<Community />} />
          <Route path="/features" element={<Features />} />
          <Route path="/career-navigator" element={<CareerNavigator />} />
          <Route path="/major-career-mapping" element={<MajorCareerMapping />} />
          <Route path="/alumni-path" element={<AlumniPath />} />
          <Route path="/synq-finance" element={<SynqFinance />} />
          <Route path="/expense-tracker" element={<ExpenseTracker />} />
          <Route path="/scholarship-discovery" element={<ScholarshipDiscovery />} />
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/books-marketplace" element={<BooksMarketplace />} />
          <Route path="/ai-assessment-suite" element={<AIAssessmentSuite />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
