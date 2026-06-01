import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FullStackAI from "./pages/FullStackAI";
import AIPromptEngineering from "./pages/AIPromptEngineering";
import PythonSQL from "./pages/PythonSQL";
import CoursePage from "./pages/CoursePage";
import CoursesIndex from "./pages/CoursesIndex";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AIBootcamp from "./pages/AIBootcamp";
import ThankYou from "./pages/ThankYou";
import LearnCoursePage from "./pages/LearnCoursePage";
import AIPromptsLibrary from "./pages/AIPromptsLibrary";
import TeachersAIGuide from "./pages/TeachersAIGuide";
import TeacherMasterclassConfirmed from "./pages/TeacherMasterclassConfirmed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fullstack-ai" element={<FullStackAI />} />
          <Route path="/ai" element={<AIPromptEngineering />} />
          <Route path="/python-sql" element={<PythonSQL />} />
          {/* Legal pages (Flitt compliance) */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* Independence Day campaign */}
          <Route path="/ai-bootcamp" element={<AIBootcamp />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/learn/:courseSlug" element={<LearnCoursePage />} />
          <Route path="/learn/:courseSlug/:topicSlug/:lessonSlug" element={<LearnCoursePage />} />
          {/* Courses routes */}
          <Route path="/courses" element={<CoursesIndex />} />
          <Route path="/courses/:courseSlug" element={<CoursePage />} />
          <Route path="/courses/:courseSlug/:topicSlug/:lessonSlug" element={<CoursePage />} />
          {/* Resources */}
          <Route path="/resources/ai-prompts-library" element={<AIPromptsLibrary />} />
          <Route path="/teachers-ai-guide" element={<TeachersAIGuide />} />
          <Route path="/teachers-ai-masterclass/confirmed" element={<TeacherMasterclassConfirmed />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
