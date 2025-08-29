import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, TrendingUp } from "lucide-react";

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after user scrolls past hero section (approximately 800px)
      const shouldShow = window.scrollY > 800;
      setIsVisible(shouldShow && !isDismissed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl border-t-4 border-red-500 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Enrollment Status */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <TrendingUp className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <div className="min-w-0">
              <div className="font-bold text-sm sm:text-base">
                მიმდინარეობს სექტემბრის ნაკადის შევსება
              </div>
              <div className="text-xs text-red-100 hidden sm:block">
                ჩელენჯების და ინდივიდუალურ მენტორის სერვისებზე
              </div>
            </div>
          </div>

          {/* Center: Limited Spots Alert */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">ადგილები შეზღუდულია</span>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href="#pricing">
              <Button 
                variant="secondary"
                size="sm"
                className="bg-white text-red-700 hover:bg-gray-100 font-bold whitespace-nowrap"
              >
                📚 დაჯავშნე ადგილი
              </Button>
            </a>
            
            <button
              onClick={() => setIsDismissed(true)}
              className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
              aria-label="დახურვა"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar showing urgency */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-800">
        <div className="h-full bg-yellow-400 animate-pulse" style={{ width: '25%' }}></div>
      </div>
    </div>
  );
}