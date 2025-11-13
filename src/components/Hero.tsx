import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { EpicPixelBackground } from "@/components/EpicPixelBackground";
import { useScarcity } from "@/components/ScarcityManager";
import { tracking } from "@/utils/tracking";
import heroCoding from "@/assets/hero-coding.jpg";

export function Hero() {
  const [liveViewers, setLiveViewers] = useState(0);
  const [currentMonth, setCurrentMonth] = useState('სექტემბრის');
  const { scarcityData } = useScarcity();

  // Georgian month names in genitive case (ending with -ის for "month's stream")
  const georgianMonthsGenitive = {
    0: 'იანვრის',
    1: 'თებერვლის', 
    2: 'მარტის',
    3: 'აპრილის',
    4: 'მაისის',
    5: 'ივნისის',
    6: 'ივლისის',
    7: 'აგვისტოს',
    8: 'სექტემბრის',
    9: 'ოქტომბრის',
    10: 'ნოემბრის',
    11: 'დეკემბრის'
  };

  // Set current month on component mount
  useEffect(() => {
    const currentMonthIndex = new Date().getMonth();
    setCurrentMonth(georgianMonthsGenitive[currentMonthIndex]);
  }, []);

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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
        <div className="w-full max-w-4xl mx-auto">
          {/* Dynamic Scarcity Alert */}
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold mb-6 mt-8 sm:mt-6 animate-pulse max-w-full">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping flex-shrink-0"></div>
            <span className="whitespace-nowrap">{currentMonth} ნაკადი ივსება</span>
          </div>
          
          {/* Main Headline - StoryBrand Character */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-text-inverse mb-6 leading-tight px-2 sm:px-4 max-w-4xl mx-auto break-words">
            თუ გინდა დაიწყო ტექნოლოგიური კარიერა ნულიდან,{" "}
            <span className="text-secondary">სწორ ადგილას მოხვდი</span>
          </h1>

          {/* Subheadline - Problem & Solution */}
          <p className="text-base sm:text-lg md:text-xl text-text-inverse/90 mb-8 leading-relaxed max-w-3xl mx-auto px-3 sm:px-6 break-words">
            21 დღეში ჩამოგიყალიბდება დისციპლინა და მყარად დაადგები ტექნოლოგიების ათვისების გზას.
            ყოველდღიური ჩართულობით დაძლევ მოტივაციის ნაკლებობის პრობლემას.
          </p>
          
          {/* Trust Indicator */}
          <div className="flex flex-col items-center justify-center gap-3 mb-12 px-3 sm:px-6 w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 w-full sm:max-w-sm justify-center">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-text-inverse/80 text-xs sm:text-sm text-center break-words">ჩვენ ვიცით რა სირთულეებს აწყდები</span>
            </div>
            <div className="flex items-center gap-2 bg-surface/10 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 w-full sm:max-w-sm justify-center">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-text-inverse/80 text-xs sm:text-sm text-center break-words">გაგიძღვებით იმ მომავლისკენ სადაც ყველა მათგანს გადალახავ</span>
            </div>
          </div>
          
          {/* Dual CTA Buttons - Free First Approach */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 px-3 sm:px-6">
            {/* Primary CTA - Free Course */}
            <Button
              variant="hero"
              size="lg"
              className="group pixel-btn w-full sm:w-auto sm:max-w-md relative z-50 cursor-pointer"
              onClick={() => {
                tracking.buttonClick('დაიწყე უფასო კურსით', 'hero-primary');
                const freeCoursesElement = document.getElementById('free-courses');
                if (freeCoursesElement) {
                  freeCoursesElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm md:text-base break-words">დაიწყე უფასო კურსით</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>

            {/* Secondary CTA - Paid Mentorship */}
            <Button
              variant="outline"
              size="lg"
              className="group w-full sm:w-auto sm:max-w-md relative z-50 cursor-pointer bg-surface/10 backdrop-blur-sm border-2 border-text-inverse/30 text-text-inverse hover:bg-text-inverse hover:text-primary transition-all"
              onClick={() => {
                tracking.buttonClick('იხილე სამენტორო პროგრამა', 'hero-secondary');
                const pricingElement = document.getElementById('pricing');
                if (pricingElement) {
                  pricingElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="text-xs sm:text-sm md:text-base break-words">იხილე სამენტორო პროგრამა</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>
          </div>

          {/* Trust Badge & Discord Link */}
          <div className="flex flex-col items-center gap-3 mb-8 px-3">
            <div className="inline-flex items-center gap-2 bg-green-100/10 backdrop-blur-sm text-green-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="break-words">50K+ სტუდენტმა დაიწყო უფასო კურსებით</span>
            </div>
            <a
              href="https://discord.gg/AGAW3xmGPr"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => tracking.buttonClick('შემოუერთდი Discord საზოგადოებას', 'hero-discord')}
              className="text-text-inverse/80 hover:text-text-inverse text-sm underline underline-offset-4 transition-colors"
            >
              ან შემოუერთდი Discord საზოგადოებას უფასოდ
            </a>
          </div>
          
          {/* Social Proof with Live Activity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mb-8 px-3 sm:px-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">21+ დღე</div>
              <div className="text-text-inverse/80">ჩვევის ჩამოსაყალიბებლად</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">50K+</div>
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