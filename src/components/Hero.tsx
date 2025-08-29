import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { EpicPixelBackground } from "@/components/EpicPixelBackground";
import { useScarcity } from "@/components/ScarcityManager";
import { tracking } from "@/utils/tracking";
import heroCoding from "@/assets/hero-coding.jpg";

export function Hero() {
  const [liveViewers, setLiveViewers] = useState(0);
  const { scarcityData } = useScarcity();

  useEffect(() => {
    // Generate realistic viewer count based on time of day
    const generateViewerCount = () => {
      const hour = new Date().getHours();
      let baseViewers;
      
      if (hour >= 9 && hour <= 18) {
        // Business hours: 180-330 viewers
        baseViewers = Math.floor(Math.random() * 150) + 180;
      } else if (hour >= 19 && hour <= 23) {
        // Evening: 120-250 viewers
        baseViewers = Math.floor(Math.random() * 130) + 120;
      } else {
        // Night/early morning: 60-150 viewers
        baseViewers = Math.floor(Math.random() * 90) + 60;
      }
      
      setLiveViewers(baseViewers);
    };

    // Initial count
    generateViewerCount();
    
    // Update viewer count every 20-40 seconds
    const viewerInterval = setInterval(() => {
      generateViewerCount();
    }, Math.random() * 20000 + 20000);

    return () => {
      clearInterval(viewerInterval);
    };
  }, []);
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Epic Pixel Art Background Animation */}
      <EpicPixelBackground />
      
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroCoding} 
          alt="Focused developers coding" 
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary/90 to-gray-900"></div>
        {/* Additional depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Dynamic Scarcity Alert */}
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 mt-8 sm:mt-6 animate-pulse">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <span>მიმდინარეობს სექტემბრის ნაკადის შევსება</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-text-inverse mb-6 leading-tight px-2">
            მზად ხარ ტრანსფორმაციისთვის?{" "}
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-text-inverse/90 mb-8 leading-relaxed max-w-3xl mx-auto px-4">
            ეს არ არის უბრალოდ კურსი. ეს არის პიროვნული ტრანსფორმაციის უალტერნატივო პროცესი. 
            შეიძინე დისციპლინა და გახდი დამოუკიდებელი ნებისმიერი ტექნოლოგიური საკითხის შესწავლაში!
          </p>
          
          {/* Trust Indicator */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 px-4">
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              <span className="text-text-inverse/80 text-xs sm:text-sm">5+ წელი ვქმნიდით სრულყოფილ სისტემას</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-text-inverse/80 text-xs sm:text-sm">პრაქტიკაზე დაფუძნებული სწავლება</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4">
            <a href="#pricing" className="w-full sm:w-auto">
              <Button 
                variant="hero" 
                size="xl" 
                className="group pixel-btn w-full sm:w-auto"
                onClick={() => tracking.buttonClick('დაიწყე 21 დღიანი ჩელენჯი', 'hero')}
              >
                <span className="text-sm sm:text-base">დაიწყე 21 დღიანი ჩელენჯი</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
            <a href="#pricing" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="xl" 
                className="group border-2 border-text-inverse/30 text-text-inverse hover:bg-text-inverse hover:text-primary w-full sm:w-auto"
                onClick={() => tracking.courseInterest('free-courses')}
              >
                <span className="text-sm sm:text-base">უფასო კურსები</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </div>
          
          {/* Social Proof with Live Activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">21+ დღე</div>
              <div className="text-text-inverse/80">ჩვევის ჩამოსაყალიბებლად</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">5000+</div>
              <div className="text-text-inverse/80">სტუდენტი 5 წელში</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">95%</div>
              <div className="text-text-inverse/80">წარმატების ალბათობა</div>
            </div>
          </div>
          
          {/* Live Activity Indicator */}
          <div className="inline-flex items-center gap-2 bg-green-100/10 backdrop-blur-sm text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-8 sm:mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>ახლა საიტს ათვალიერებს {liveViewers} ადამიანი </span>
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