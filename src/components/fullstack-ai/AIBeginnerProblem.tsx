import { X, Check, AlertCircle, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PixelGrid } from "@/components/PixelBackground";

export function AIBeginnerProblem() {
  const problems = [
    "AI-ზე ყველა საუბრობს, მაგრამ არ იცი საიდან დაიწყო",
    "YouTube ტუტორიალები არეული და არათანმიმდევრულია",
    "ChatGPT-ს იყენებ, მაგრამ რეალურ პროექტებს ვერ აკეთებ",
    "სწავლობ დამოუკიდებლად, მაგრამ ხშირად იჭედები და მოტივაციას კარგავ",
    "გინდა ტექნოლოგიებში გადმოსვლა, მაგრამ „კოდინგი“ გაშინებს"
  ];

  const solutions = [
    "სტრუქტურირებული 6-თვიანი გეგმა: 0-დან სამსახურამდე",
    "Harvard CS50 - მსოფლიოს საუკეთესო სასწავლო პროგრამა",
    "პირადი მენტორი, რომელიც ყოველ კვირას შეგხვდება",
    "2 საერთაშორისო სერტიფიკატი შენი ცოდნის დასადასტურებლად",
    "4+ რეალური AI პროექტი შენი პორტფოლიოსთვის"
  ];

  return (
    <section className="relative py-20 bg-surface pixel-bg">
      <PixelGrid />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <AlertCircle className="w-4 h-4" />
            <span>იცნობ ამ სიტუაციას?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            დამწყებისთვის{" "}
            <span className="text-red-500">AI-ს სწავლა რთულია...</span>
            <br />
            <span className="text-secondary">მაგრამ არა ჩვენთან.</span>
          </h2>

          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ჩვენ გავითვალისწინეთ ყველა დაბრკოლება, რაც დამწყებებს ხვდებათ და შევქმენით გარემო, სადაც წარუმატებლობა შეუძლებელია.
          </p>
        </div>

        {/* Problem-Solution Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Problem Card */}
          <Card className="p-8 bg-red-50/50 border-2 border-red-200 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-red-900">
                დამოუკიდებლად სწავლა
              </h3>
            </div>

            <ul className="space-y-4">
              {problems.map((problem, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-red-800 leading-relaxed">{problem}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-red-200">
              <p className="text-sm text-red-700 font-semibold text-center">
                შედეგი: დაკარგული დრო და იმედგაცრუება
              </p>
            </div>
          </Card>

          {/* Solution Card */}
          <Card className="p-8 bg-green-50/50 border-2 border-green-200 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-900">
                ჩვენი მენტორობით
              </h3>
            </div>

            <ul className="space-y-4">
              {solutions.map((solution, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-green-800 leading-relaxed font-medium">{solution}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-green-200">
              <p className="text-sm text-green-700 font-semibold text-center">
                შედეგი: გარანტირებული წინსვლა და ახალი პროფესია
              </p>
            </div>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg sm:text-xl font-bold text-text-primary mb-4">
            არ დაკარგო დრო ქაოსურ სწავლაში
          </p>
          <p className="text-text-secondary">
            აირჩიე გამოცდილი გზა, რომელსაც შედეგამდე მიჰყავხარ
          </p>
        </div>
      </div>
    </section>
  );
}
