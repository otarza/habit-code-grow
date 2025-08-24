import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { PixelBackground } from "@/components/PixelBackground";
import heroCoding from "@/assets/hero-coding.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Pixel Art Background Animation */}
      <PixelBackground />
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroCoding} 
          alt="Focused developers coding" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-text-inverse mb-6 leading-tight">
            გახდი შეუჩერებელი{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
              კოდის წერის და AI
            </span>{" "}
            — უნარების ათვისებით
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-text-inverse/90 mb-8 leading-relaxed max-w-3xl mx-auto">
            Not just another course. A mentorship system that helps you code daily, 
            grow discipline, and become an independent lifelong learner.
          </p>
          
          {/* Trust Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-text-inverse/80 text-sm">5+ years refining this system</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-text-inverse/80 text-sm">Evidence-based learning</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="hero" size="xl" className="group pixel-btn">
              Join the 21-Day Challenge
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="pixel-btn border-text-inverse/30 text-text-inverse hover:bg-text-inverse hover:text-primary">
              <Download className="w-5 h-5" />
              Get the Free Habit Tracker
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">21+</div>
              <div className="text-text-inverse/80">Days Average Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">500+</div>
              <div className="text-text-inverse/80">Students Transformed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">95%</div>
              <div className="text-text-inverse/80">Habit Success Rate</div>
            </div>
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