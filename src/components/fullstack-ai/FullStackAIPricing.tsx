import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Clock, Award } from "lucide-react";
import { PixelGrid } from "@/components/PixelBackground";
import { TallyModal, useTallyModal } from "@/components/TallyModal";
import { tracking } from "@/utils/tracking";

export function FullStackAIPricing() {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const { isOpen, openModal, closeModal } = useTallyModal();

  useEffect(() => {
    // Calculate days until early bird expires
    const earlyBirdDeadline = new Date('2026-03-01');
    const today = new Date();
    const diffTime = earlyBirdDeadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(Math.max(0, diffDays));
  }, []);

  const features = [
    "6-თვიანი სრული აქსელერაციის პროგრამა",
    "2 Harvard University სერტიფიკატი (CS50P + CS50 SQL)",
    "24+ ინდივიდუალური მენტორ-სესია (კვირაში ერთხელ)",
    "დახურული Discord ქომიუნითი და ნეთვორქინგი",
    "დავალებების რევიუ და დეტალური უკუკავშირი",
    "კარიერული მზაობა: CV, LinkedIn, Mock Interviews",
    "წვდომა ყველა განახლებად რესურსსა და მასალაზე",
    "დაიწყე ნებისმიერ დროს - შენს ტემპში"
  ];

  const handleEnrollClick = () => {
    tracking.courseInterest('fullstack-ai-program');
    tracking.formStart('FullStack AI Enrollment');
    openModal();
  };

  return (
    <section id="pricing" className="relative py-20 bg-surface pixel-bg">
      <PixelGrid />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-pulse">
            <Clock className="w-4 h-4 animate-spin-slow" />
            <span>Early Bird ფასდაკლება დასრულდება {daysRemaining} დღეში</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            საუკეთესო ინვესტიცია{" "}
            <span className="text-secondary">შენს მომავალში</span>
          </h2>

          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ერთჯერადი გადახდა, რომელიც ახალ პროფესიას და კარიერულ თავისუფლებას მოგიტანს.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="relative p-8 sm:p-10 card-hover shadow-glow ring-2 ring-primary course-premium premium-chrome">
            {/* Early Bird Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 text-sm font-bold shadow-lg border-2 border-white">
                🔥 Early Bird Offer
              </Badge>
            </div>

            <div className="text-center mb-8">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 mb-6">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                Full-Stack AI პროგრამა
              </h3>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline justify-center gap-3 mb-2">
                  <span className="text-2xl text-text-muted line-through">3900₾</span>
                  <span className="text-5xl sm:text-6xl font-bold text-primary">2990₾</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                  <Badge className="bg-green-100 text-green-700 px-4 py-1 font-semibold">
                    ზოგავ 910₾-ს
                  </Badge>
                  <span className="text-text-secondary">ან 3 x 1099₾ (განვადებით)</span>
                </div>
              </div>

              <p className="text-sm text-text-muted">სრული 6-თვიანი პროგრამის ღირებულება</p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <p className="text-center font-semibold text-text-primary mb-4">რა შედის ღირებულებაში:</p>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-text-secondary leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            {/* Scarcity Message */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 justify-center text-orange-700 font-semibold">
                <Award className="w-5 h-5" />
                <span className="text-sm">
                  თებერვლის ნაკადში დარჩენილია 8 ადგილი
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              size="lg"
              className="w-full gradient-cta text-lg py-6 font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300"
              onClick={handleEnrollClick}
            >
              დაჯავშნე ადგილი - დაზოგე 910₾
            </Button>

            {/* Bottom Trust Line */}
            <div className="mt-6 pt-6 border-t border-primary/10">
              <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                <Check className="w-4 h-4 text-green-500" />
                <span>100% უსაფრთხო გადახდა</span>
              </div>
            </div>
          </Card>

          {/* Value Breakdown Below Card */}
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary mb-4">შედარებისთვის:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                <p className="text-2xl font-bold text-primary">2</p>
                <p className="text-xs text-text-muted">Harvard Certs</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                <p className="text-2xl font-bold text-primary">24+</p>
                <p className="text-xs text-text-muted">მენტორ-სესია</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                <p className="text-2xl font-bold text-primary">6</p>
                <p className="text-xs text-text-muted">თვე სწავლა</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10">
                <p className="text-2xl font-bold text-primary">∞</p>
                <p className="text-xs text-text-muted">მასალები</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <TallyModal
        isOpen={isOpen}
        onClose={closeModal}
        formUrl="https://tally.so/embed/mO6z8Y"
        title="დაჯავშნე ადგილი Full-Stack AI პროგრამაზე"
      />
    </section>
  );
}
