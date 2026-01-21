import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TallyModal, useTallyModal } from "@/components/TallyModal";
import { tracking } from "@/utils/tracking";

export function AICareerContrast() {
  const { isOpen, openModal, closeModal } = useTallyModal();

  const successPoints = [
    "2 Harvard სერტიფიკატი (+ პორტფოლიო)",
    "ავტომატიზაციისა და AI-ის ღრმა ცოდნა",
    "დასაქმება მაღალანაზღაურებად პოზიციაზე",
    "საკუთარი სტარტაპის ან სააგენტოს შექმნა",
    "თავისუფლება და დისტანციური მუშაობა",
    "ინვესტიციის 10x უკუგება 1 წელიწადში"
  ];

  const failurePoints = [
    "კიდევ 6 თვე გადის ცვლილების გარეშე",
    "რჩები იგივე სამსახურში, დაბალი ხელფასით",
    "AI ტექნოლოგიები ვითარდება, შენ კი ჩამორჩები",
    "კარგავ კონკურენტულ უპირატესობას ბაზარზე",
    "ნანობ ხელიდან გაშვებულ შანსს",
    "იხდი უფრო მეტს მომავალში იგივე ცოდნისთვის"
  ];

  const handleCTA = () => {
    tracking.buttonClick('Reserve Spot', 'fullstack-ai-final-cta');
    tracking.formStart('FullStack AI Final CTA');
    openModal();
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            შენი არჩევანი{" "}
            <span className="text-red-400">დღეს</span>
            <br />
            განსაზღვრავს{" "}
            <span className="text-green-400">ხვალს</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            სად იქნები 6 თვის შემდეგ? არჩევანი შენზეა.
          </p>
        </div>

        {/* Contrast Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Success Side */}
          <Card className="relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-4 border-green-500 shadow-2xl">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-green-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                ✅ თუ დაიწყებ ახლა
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {successPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-green-900 font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-green-300">
              <p className="text-center font-bold text-green-800 text-lg">
                🎯 შედეგი: ახალი პროფესია და ფინანსური ზრდა
              </p>
            </div>
          </Card>

          {/* Failure Side */}
          <Card className="relative p-8 bg-gradient-to-br from-red-50 to-orange-50 border-4 border-red-500 shadow-2xl">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-red-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                ❌ თუ გადადებ
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {failurePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-red-900 font-medium leading-relaxed">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t-2 border-red-300">
              <p className="text-center font-bold text-red-800 text-lg">
                😞 შედეგი: სტაგნაცია და სინანული
              </p>
            </div>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="inline-block bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-8 sm:p-12 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              მზად ხარ ცვლილებისთვის?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Early Bird ფასდაკლება (-910₾) მალე სრულდება. ადგილები შეზღუდულია.
            </p>

            <Button
              size="lg"
              className="gradient-cta text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 font-bold shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
              onClick={handleCTA}
            >
              დაჯავშნე ადგილი ახლავე
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-gray-400 text-sm mt-6">
              ⚡ Rolling Enrollment - სწავლას იწყებ რეგისტრაციისთანავე
            </p>
          </div>
        </div>

        {/* Trust Line */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            🔒 30-დღიანი გარანტია | ✅ Harvard-ის სტანდარტი | 🎓 ქართული მენტორობა
          </p>
        </div>
      </div>

      {/* Final Modal */}
      <TallyModal
        isOpen={isOpen}
        onClose={closeModal}
        formUrl="https://tally.so/embed/mO6z8Y"
        title="დაჯავშნე ადგილი Full-Stack AI პროგრამაზე"
      />
    </section>
  );
}
