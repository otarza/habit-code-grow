import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FullStackAI from "./pages/FullStackAI";
import AIPromptEngineering from "./pages/AIPromptEngineering";
import CoursePage from "./pages/CoursePage";
import NotFound from "./pages/NotFound";

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
          {/* Course routes */}
          <Route path="/courses/:courseSlug" element={<CoursePage />} />
          <Route path="/courses/:courseSlug/:topicSlug/:lessonSlug" element={<CoursePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
