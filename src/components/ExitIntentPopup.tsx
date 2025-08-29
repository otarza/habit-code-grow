import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Clock, AlertTriangle, Gift } from "lucide-react";

export function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving towards the top of the screen (to close tab/navigate away)
      if (e.clientY <= 0 && !exitIntentTriggered && !isDismissed) {
        exitIntentTriggered = true;
        setIsVisible(true);
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !exitIntentTriggered && !isDismissed) {
        exitIntentTriggered = true;
        setIsVisible(true);
      }
    };

    // Only add listeners after user has been on page for at least 30 seconds
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('keydown', handleEscapeKey);
    }, 30000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDismissed]);

  const handleClose = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleClaim = () => {
    // In a real implementation, this would trigger the lead magnet flow
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <Card className="relative max-w-md mx-4 p-8 shadow-2xl border-4 border-red-500 bg-gradient-to-br from-red-50 to-orange-50 animate-scale-in">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          aria-label="დახურვა"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Urgent header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            კი, ნუ წადიხარ!
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            უკანასკნელი შანსი!
          </h3>
          <p className="text-gray-600 mb-4">
            230₾ ღირებულების პაკეტი <strong>მხოლოდ დღეს უფასოდ</strong>
          </p>
        </div>

        {/* Benefits list */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>5 დღიანი ვიდეო მინი-კურსი</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>40 გვერდიანი PDF გაიდი</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Discord კომუნიტიში წვდომა</span>
          </div>
        </div>

        {/* Countdown timer */}
        <div className="bg-red-500 text-white p-4 rounded-lg text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="font-bold text-sm">ეს შეთავაზება ვრცელდება:</span>
          </div>
          <div className="text-2xl font-mono font-bold">04:47</div>
          <div className="text-xs opacity-90">წუთი:წამი</div>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button 
            onClick={handleClaim}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 text-lg shadow-lg"
          >
            ✅ კი, მინდა უფასო პაკეტი!
          </Button>
          
          <button
            onClick={handleClose}
            className="w-full text-center text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            არა, მადლობა
          </button>
        </div>

        {/* Urgency reinforcement */}
        <div className="text-center mt-4">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
            <span>ახლა 47 ადამიანი იხილავს ამ შეთავაზებას</span>
          </div>
        </div>
      </Card>
    </div>
  );
}