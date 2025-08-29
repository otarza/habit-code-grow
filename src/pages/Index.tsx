import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { TrustIndicators } from "@/components/TrustIndicators";
import { LeadMagnet } from "@/components/LeadMagnet";
import { PricingSection } from "@/components/PricingSection";
import { ChallengeTransformation } from "@/components/ChallengeTransformation";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import { FloatingSocialProof } from "@/components/FloatingSocialProof";
import { ABTestProvider } from "@/components/ABTestTracker";
import { RetargetingProvider } from "@/components/RetargetingPixels";
import { ScarcityProvider } from "@/components/ScarcityManager";

const Index = () => {
  // Simplified retargeting config to avoid env variable issues
  const retargetingConfig = {
    facebookPixelId: undefined, // Will be set when env vars are configured
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
            <Hero />
            {/* <TrustIndicators /> */}
            <ProblemSolution />
            <HowItWorks />
            {/* <LeadMagnet /> */}
            <PricingSection />
            <ChallengeTransformation />
            <Testimonials />
            <FAQ />
            <Footer />
            <StickyCtaBar />
            {/* <FloatingSocialProof /> */}
          </ScarcityProvider>
        </ABTestProvider>
      </RetargetingProvider>
    </div>
  );
};

export default Index;
