import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Bot, Zap, Code2 } from "lucide-react";
import { EpicPixelBackground } from "@/components/EpicPixelBackground";
import { useScarcity } from "@/components/ScarcityManager";
import { tracking } from "@/utils/tracking";

export function AIHero() {
  const [liveViewers, setLiveViewers] = useState(0);
  const { scarcityData } = useScarcity();

  useEffect(() => {
    const generateViewerCount = () => {
      const hour = new Date().getHours();
      let baseViewers;

      if (hour >= 9 && hour <= 18) {
        baseViewers = Math.floor(Math.random() * 120) + 140;
      } else if (hour >= 19 && hour <= 23) {
        baseViewers = Math.floor(Math.random() * 100) + 90;
      } else {
        baseViewers = Math.floor(Math.random() * 60) + 40;
      }

      setLiveViewers(baseViewers);
    };

    generateViewerCount();

    const viewerInterval = setInterval(() => {
      generateViewerCount();
    }, Math.random() * 20000 + 20000);

    return () => clearInterval(viewerInterval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      <EpicPixelBackground />

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-primary/90 to-gray-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
        <div className="w-full max-w-4xl mx-auto">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-6 mt-8 sm:mt-6 border border-accent/30">
            <Sparkles className="w-4 h-4" />
            <span>400+ სტუდენტმა უკვე დაიწყო სწავლა</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-text-inverse mb-6 leading-tight px-2 sm:px-4 max-w-4xl mx-auto">
            დაიმორჩილე ხელოვნური ინტელექტი და{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-secondary">
              გააორმაგე შენი შედეგები
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-text-inverse/90 mb-4 px-3">
            პროფესიის მიუხედავად — ტექნიკური ცოდნის გარეშე
          </p>

          <p className="text-base sm:text-lg md:text-xl text-text-inverse/80 mb-8 leading-relaxed max-w-3xl mx-auto px-3 sm:px-6">
            ერთადერთი ქართული კურსი, რომელიც გასწავლის არა მარტო "ჩატს", არამედ რეალურ ავტომატიზაციას, აგენტების შექმნას და საქმის გამარტივებას.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 px-3">
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Code2 className="w-4 h-4 text-accent" />
              <span className="text-text-inverse/80 text-sm">კოდის წერა არ გჭირდება</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="text-text-inverse/80 text-sm">სრული პრაქტიკა</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-secondary" />
              <span className="text-text-inverse/80 text-sm">სამუდამო წვდომა</span>
            </div>
          </div>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12 px-3 sm:px-6">
            <Button
              variant="hero"
              size="lg"
              className="group pixel-btn w-full sm:w-auto relative z-50 cursor-pointer"
              onClick={() => {
                tracking.buttonClick('იხილე პროგრამა', 'ai-hero-primary');
                const curriculumElement = document.getElementById('curriculum');
                if (curriculumElement) {
                  curriculumElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Sparkles className="w-5 h-5" />
              <span>რა ვისწავლი?</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group w-full sm:w-auto relative z-50 cursor-pointer bg-surface/10 backdrop-blur-sm border-2 border-text-inverse/30 text-text-inverse hover:bg-text-inverse hover:text-primary transition-all"
              onClick={() => {
                tracking.buttonClick('ჩაეწერე ახლავე', 'ai-hero-secondary');
                const pricingElement = document.getElementById('pricing');
                if (pricingElement) {
                  pricingElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span>რეგისტრაცია</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto mb-8 px-3">
            <div className="text-center p-4 bg-surface/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">6</div>
              <div className="text-text-inverse/70 text-xs sm:text-sm">მოდული</div>
            </div>
            <div className="text-center p-4 bg-surface/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1">30+</div>
              <div className="text-text-inverse/70 text-xs sm:text-sm">ვიდეო გაკვეთილი</div>
            </div>
            <div className="text-center p-4 bg-surface/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-secondary mb-1">400+</div>
              <div className="text-text-inverse/70 text-xs sm:text-sm">მონაწილე</div>
            </div>
            <div className="text-center p-4 bg-surface/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-2xl sm:text-3xl font-bold text-pink-400 mb-1">0%</div>
              <div className="text-text-inverse/70 text-xs sm:text-sm">თეორია / 100% პრაქტიკა</div>
            </div>
          </div>

          {/* Live Activity */}
          <div className="inline-flex items-center gap-2 bg-green-100/10 backdrop-blur-sm text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>ახლა გვერდს ათვალიერებს {liveViewers} ადამიანი</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-text-inverse/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-text-inverse/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
