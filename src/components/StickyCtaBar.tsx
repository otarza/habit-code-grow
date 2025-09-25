import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, TrendingUp } from "lucide-react";

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(73);
  const [currentMonth, setCurrentMonth] = useState('სექტემბერი');

  // Georgian month names
  const georgianMonths = {
    0: 'იანვარი',
    1: 'თებერვალი', 
    2: 'მარტი',
    3: 'აპრილი',
    4: 'მაისი',
    5: 'ივნისი',
    6: 'ივლისი',
    7: 'აგვისტო',
    8: 'სექტემბერი',
    9: 'ოქტომბერი',
    10: 'ნოემბერი',
    11: 'დეკემბერი'
  };

  // Calculate dynamic progress and month based on current date
  useEffect(() => {
    const calculateProgressAndMonth = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthIndex = now.getMonth();
      const currentMonthName = georgianMonths[currentMonthIndex];
      
      // Set current month name
      setCurrentMonth(currentMonthName);
      
      // Calculate progress based on current month
      const startOfMonth = new Date(currentYear, currentMonthIndex, 1);
      const endOfMonth = new Date(currentYear, currentMonthIndex + 1, 0); // Last day of current month
      
      // Calculate progress through current month (60% to 95%)
      const totalDays = (endOfMonth.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24);
      const daysPassed = (now.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24);
      const progressThroughMonth = Math.min(daysPassed / totalDays, 1); // Cap at 1
      
      // Scale from 60% to 95% based on how far through the month we are
      return Math.round(60 + (35 * progressThroughMonth));
    };

    setProgressPercentage(calculateProgressAndMonth());
  }, []);

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
                {currentMonth}
              </div>
              <div className="text-xs text-red-100 hidden sm:block">
                ჩელენჯების და ინდივიდუალურ მენტორის სერვისებზე
              </div>
            </div>
          </div>

          {/* Center: Progress Bar Alert */}
          <div className="hidden md:flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg min-w-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">ადგილები შეზღუდულია</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full animate-pulse shadow-lg" 
                   style={{ width: `${progressPercentage}%` }}>
              </div>
            </div>
            <span className="text-xs text-yellow-200 font-bold">{progressPercentage}% შევსებული</span>
          </div>

          {/* Right: CTA Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button 
              variant="secondary"
              size="sm"
              className="bg-white text-red-700 hover:bg-gray-100 font-bold whitespace-nowrap"
              onClick={() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              📚 დაჯავშნე ადგილი
            </Button>
            
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
      
      {/* Progress bar showing urgency - synced with main progress */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-red-800/80">
        <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse shadow-lg" 
             style={{ width: `${progressPercentage}%` }}>
        </div>
      </div>
    </div>
  );
}