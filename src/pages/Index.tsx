import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { TrustIndicators } from "@/components/TrustIndicators";
import { LeadMagnet } from "@/components/LeadMagnet";
import { PricingSection } from "@/components/PricingSection";
import { ChallengeTransformation } from "@/components/ChallengeTransformation";
import { HowItWorks } from "@/components/HowItWorks";
import { ThreeStepPlan } from "@/components/ThreeStepPlan";
import { SuccessFailureContrast } from "@/components/SuccessFailureContrast";
import { FreeCoursesSection } from "@/components/FreeCoursesSection";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import { FloatingSocialProof } from "@/components/FloatingSocialProof";
import { ABTestProvider } from "@/components/ABTestTracker";
import { RetargetingProvider } from "@/components/RetargetingPixels";
import { ScarcityProvider } from "@/components/ScarcityManager";
import { VideoExplainer } from "@/components/VideoExplainer";
import { SEO } from "@/components/SEO";

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
      <SEO
        title="პროგრამირების კურსები BitCamp-ში | AI, Python, SQL და 21 დღიანი ჩელენჯი"
        description="ისწავლე AI, Python, SQL პროგრამირება BitCamp-ში. უფასო კურსები, 21 დღიანი ჩელენჯები და პირადი მენტორობა. შექმენი ყოველდღიური კოდირების ჩვევები."
        image="https://www.bitcamp.ge/hero-og-image.png"
        url="https://www.bitcamp.ge"
      />
      <RetargetingProvider config={retargetingConfig}>
        <ABTestProvider>
          <ScarcityProvider>
            <Navbar />
            {/* Value Ladder: Start with FREE to build trust */}
            <FreeCoursesSection />
            <VideoExplainer />
            <FAQ />
            <Hero />
            <Testimonials />
            {/* <TrustIndicators /> */}
            <ProblemSolution />
            <ThreeStepPlan />
            <HowItWorks />
            {/* <LeadMagnet /> */}
            <PricingSection />
            <SuccessFailureContrast />
            <ChallengeTransformation />
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
