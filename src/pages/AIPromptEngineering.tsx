import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ABTestProvider } from "@/components/ABTestTracker";
import { RetargetingProvider } from "@/components/RetargetingPixels";
import { ScarcityProvider } from "@/components/ScarcityManager";

import { AIHero } from "@/components/ai-course/AIHero";
import { AIWhoIsThisFor } from "@/components/ai-course/AIWhoIsThisFor";
import { AICurriculumModules } from "@/components/ai-course/AICurriculumModules";
import { AITestimonials } from "@/components/ai-course/AITestimonials";
import { AIFinalProject } from "@/components/ai-course/AIFinalProject";
import { AITransformationPath } from "@/components/ai-course/AITransformationPath";
import { AIPricing } from "@/components/ai-course/AIPricing";
import { AIRegistrationForm } from "@/components/ai-course/AIRegistrationForm";
import { AIFAQ } from "@/components/ai-course/AIFAQ";

import { SEO } from "@/components/SEO";

const AIPromptEngineering = () => {
  const retargetingConfig = {
    facebookPixelId: undefined,
    googleAdsId: undefined,
    tiktokPixelId: undefined,
    customPixelEndpoints: []
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="AI აგენტები, პრომპტ-ინჟინერია & ავტომატიზაცია | BitCamp"
        description="ისწავლე როგორ შექმნა ჭკვიანი AI აგენტები, დაეუფლე ChatGPT-ს და n8n ავტომატიზაციას. 0-დან AI არქიტექტორამდე - დაიწყე დღესვე!"
      />
      <RetargetingProvider config={retargetingConfig}>
        <ABTestProvider>
          <ScarcityProvider>
            <Navbar />

            {/* Hero: Main value proposition */}
            <AIHero />

            {/* Social Proof: Build trust early */}
            <AITestimonials />

            {/* Target Audience: Who is this for */}
            <AIWhoIsThisFor />

            {/* Transformation: Before vs After */}
            <AITransformationPath />

            {/* Curriculum: Detailed syllabus (main content) */}
            <AICurriculumModules />

            {/* Final Project: What they'll build */}
            <AIFinalProject />

            {/* Pricing: Call to action */}
            <AIPricing />

            {/* Registration: ManyChat link (temporary until n8n+Tally is ready) */}
            <AIRegistrationForm />

            {/* FAQ: Address objections */}
            <AIFAQ />

            <Footer />
          </ScarcityProvider>
        </ABTestProvider>
      </RetargetingProvider>
    </div>
  );
};

export default AIPromptEngineering;
