import { Award, Users, TrendingUp, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function HarvardTrustBadge() {
  const stats = [
    {
      icon: Users,
      number: "3.6M+",
      label: "CS50 სტუდენტი მსოფლიოში",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      number: "10% → 85%+",
      label: "ჩვენი სტუდენტების წარმატების მაჩვენებელი",
      color: "text-green-600"
    },
    {
      icon: Award,
      number: "4000-8000₾",
      label: "საშუალო ხელფასი AI სფეროში",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="relative py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-full">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            2 Harvard University სერტიფიკატი{" "}
            <span className="text-red-600">შედის ფასში</span>
          </h2>

          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
            <CheckCircle className="w-5 h-5" />
            <span>CS50 Python (CS50P) + CS50 SQL</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="p-6 sm:p-8 border-2 border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg text-center"
              >
                <div className="flex flex-col items-center">
                  <div className={`mb-4 ${stat.color}`}>
                    <IconComponent className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <div className={`text-3xl sm:text-4xl font-bold mb-2 ${stat.color}`}>
                    {stat.number}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Harvard Logo Acknowledgment */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
            CS50 და CS50 SQL არის Harvard-ის ოფიციალური კურსები (ხელმისაწვდომია edX-ზე).
            ჩვენ გთავაზობთ ქართულ მენტორობას და დამატებით პრაქტიკულ მოდულებს ამ კურსების წარმატებით დასახურად.
          </p>
        </div>
      </div>
    </section>
  );
}
