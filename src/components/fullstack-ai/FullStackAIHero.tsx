import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Award } from "lucide-react";
import { EpicPixelBackground } from "@/components/EpicPixelBackground";
import { TallyModal, useTallyModal } from "@/components/TallyModal";
import { tracking } from "@/utils/tracking";

export function FullStackAIHero() {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const { isOpen, openModal, closeModal } = useTallyModal();

  useEffect(() => {
    // Calculate days until early bird expires (example: March 1, 2026)
    const earlyBirdDeadline = new Date('2026-03-01');
    const today = new Date();
    const diffTime = earlyBirdDeadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(Math.max(0, diffDays));
  }, []);

  const handlePrimaryCTA = () => {
    tracking.buttonClick('იხილე სასწავლო პროგრამა', 'fullstack-ai-hero-primary');
    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSecondaryCTA = () => {
    tracking.buttonClick('დაჯავშნე კონსულტაცია', 'fullstack-ai-hero-secondary');
    tracking.formStart('FullStack AI Consultation');
    openModal();
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Epic Pixel Art Background Animation */}
      <EpicPixelBackground />

      {/* Background overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary/90 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
        <div className="w-full max-w-4xl mx-auto">
          {/* Early Bird Discount Badge */}
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-6 mt-8 sm:mt-6 animate-pulse max-w-full">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping flex-shrink-0"></div>
            <span className="whitespace-nowrap">
              🔥 Early Bird: -910₾ ფასდაკლება — სრულდება {daysRemaining} დღეში
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-text-inverse mb-6 leading-tight px-2 sm:px-4 max-w-5xl mx-auto break-words">
            დაეუფლე <span className="text-secondary">AI პროფესიას</span><br className="hidden sm:block" />
            <span className="text-accent">6 თვეში, ნულიდან.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed px-2 sm:px-4 max-w-3xl mx-auto">
            2 Harvard-ის სერტიფიკატი, პრაქტიკული AI აგენტები და <br className="hidden md:block"/> პირადი მენტორი, რომელიც ბოლომდე გიჭერს მხარს.
          </p>

          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10 text-sm sm:text-base text-text-secondary px-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent flex-shrink-0" />
              <span className="font-semibold">6 თვე</span>
            </div>
            <div className="hidden sm:block text-text-muted">|</div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-secondary flex-shrink-0" />
              <span className="font-semibold">2 Harvard სერტიფიკატი</span>
            </div>
            <div className="hidden sm:block text-text-muted">|</div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <span className="font-semibold">24+ მენტორ-სესია</span>
            </div>
          </div>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8 px-4">
            <Button
              size="lg"
              className="gradient-cta w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
              onClick={handlePrimaryCTA}
            >
              ნახე სილაბუსი
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              onClick={handleSecondaryCTA}
            >
              უფასო კონსულტაცია
            </Button>
          </div>

          {/* Trust Line */}
          <p className="text-xs sm:text-sm text-text-muted max-w-2xl mx-auto px-4">
            ⭐ ეფუძნება CS50-ს — მსოფლიოში #1 პროგრამირების კურსს (3.6M+ სტუდენტი)
          </p>
        </div>
      </div>

      {/* Consultation Modal */}
      <TallyModal
        isOpen={isOpen}
        onClose={closeModal}
        formUrl="https://tally.so/embed/mO6z8Y"
        title="დაჯავშნე უფასო კონსულტაცია"
      />
    </section>
  );
}
