import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ABTestProvider } from "@/components/ABTestTracker";
import { RetargetingProvider } from "@/components/RetargetingPixels";
import { ScarcityProvider } from "@/components/ScarcityManager";
import { FullStackAIHero } from "@/components/fullstack-ai/FullStackAIHero";
import { HarvardTrustBadge } from "@/components/fullstack-ai/HarvardTrustBadge";
import { AIBeginnerProblem } from "@/components/fullstack-ai/AIBeginnerProblem";
import { AICurriculumTimeline } from "@/components/fullstack-ai/AICurriculumTimeline";
import { FullStackAIPricing } from "@/components/fullstack-ai/FullStackAIPricing";
import { AITestimonials } from "@/components/fullstack-ai/AITestimonials";
import { AIProjectShowcase } from "@/components/fullstack-ai/AIProjectShowcase";
import { ComparisonTable } from "@/components/fullstack-ai/ComparisonTable";
import { FullStackAIFAQ } from "@/components/fullstack-ai/FullStackAIFAQ";
import { AICareerContrast } from "@/components/fullstack-ai/AICareerContrast";

const FullStackAI = () => {
  // Simplified retargeting config to avoid env variable issues
  const retargetingConfig = {
    facebookPixelId: undefined,
    googleAdsId: undefined,
    tiktokPixelId: undefined,
    customPixelEndpoints: []
  };

  return (
    <div className="min-h-screen">
      <RetargetingProvider config={retargetingConfig}>
        <ABTestProvider>
          <ScarcityProvider>
            <Navbar />

            {/* Premium Direct Sale: Lead with credibility and value */}
            <FullStackAIHero />
            <HarvardTrustBadge />
            <AIBeginnerProblem />
            <AICurriculumTimeline />
            <FullStackAIPricing />
            <AITestimonials />
            <AIProjectShowcase />
            <ComparisonTable />
            <FullStackAIFAQ />
            <AICareerContrast />

            <Footer />
          </ScarcityProvider>
        </ABTestProvider>
      </RetargetingProvider>
    </div>
  );
};

export default FullStackAI;
