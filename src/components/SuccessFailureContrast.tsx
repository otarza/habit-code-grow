import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { tracking } from "@/utils/tracking";

export function SuccessFailureContrast() {
  const successPoints = [
    "ყოველდღიურად წერ კოდს ბუნებრივად",
    "დამოუკიდებლად სწავლობ ნებისმიერ ტექნოლოგიას",
    "AI იარაღებს იყენებ ეფექტურად",
    "გაქვს დისციპლინა და თვითკონტროლი",
    "ხარ BitCamp საზოგადოების აქტიური წევრი",
    "მუდმივად იზრდები და ვითარდები"
  ];

  const failurePoints = [
    "კიდევ ერთი წელი გავა შედეგის გარეშე",
    "იგივე პრობლემები - მოტივაციის დაკარგვა",
    "სხვები გაგისწრებენ კარიერაში",
    "დარჩები იმავე ადგილზე სადაც ახლა ხარ",
    "განმეორებით დაიწყებ და შეწყვეტ სწავლას",
    "ვერ გადალახავ პირველ სირთულეებს"
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            შენი არჩევანი - შენი მომავალი
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            რა გელოდება თუ დაიწყებ ახლა vs თუ გადადებ კიდევ ერთხელ
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Success Side */}
          <Card className="p-8 bg-gradient-to-br from-green-50 to-white border-2 border-green-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-800">
                თუ დაიწყებ ჩელენჯს ახლა
              </h3>
            </div>

            <div className="space-y-4 mb-8">
              {successPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-text-secondary leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-green-100 rounded-lg">
              <p className="text-green-800 font-semibold text-center">
                21 დღეში უკვე შეცვლილი იქნები
              </p>
            </div>
          </Card>

          {/* Failure Side */}
          <Card className="p-8 bg-gradient-to-br from-red-50 to-white border-2 border-red-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-800">
                თუ გადადებ კიდევ ერთხელ
              </h3>
            </div>

            <div className="space-y-4 mb-8">
              {failurePoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-text-secondary leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-100 rounded-lg">
              <p className="text-red-800 font-semibold text-center">
                კიდევ ერთი დაკარგული წელი
              </p>
            </div>
          </Card>
        </div>

        {/* Strong CTA */}
        <div className="text-center px-4">
          <Card className="inline-block p-6 md:p-10 bg-gradient-to-r from-primary to-secondary shadow-2xl max-w-full">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 break-words">
              არ დაკარგო კიდევ ერთი დღე!
            </h3>
            <p className="text-white/90 mb-8 text-base md:text-lg break-words">
              რაც უფრო მალე გადადგამ ამ ნაბიჯს, მით უფრო ადრე დაიწყებ საკუთარი თავის ტრანსფორმაციას
            </p>
            <a href="#pricing" className="block">
              <Button 
                variant="hero" 
                size="lg"
                className="group bg-white text-primary hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => tracking.buttonClick('არ დაკარგო დრო - დაიწყე ახლა', 'success-failure')}
              >
                <span className="font-bold text-sm sm:text-base">არ დაკარგო დრო - დაიწყე ახლა</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
}