import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  TrendingUp,
  Users,
  Lightbulb,
  CheckCircle2,
  XCircle
} from "lucide-react";

export function AIWhoIsThisFor() {
  const targetAudience = [
    {
      icon: Megaphone,
      title: "მარკეტერები & კონტენტ-მენეჯერები",
      description: "გაამრავალფეროვნე კონტენტის შექმნა, ააწყვე ავტომატური პოსტინგი და გაზარდე პროდუქტიულობა AI-ით.",
      benefits: [
        "კონტენტ-კალენდრის ავტომატიზაცია",
        "SEO-ოპტიმიზებული ტექსტები",
        "სოციალური მედიის მართვა"
      ],
      color: "from-pink-500 to-rose-600"
    },
    {
      icon: TrendingUp,
      title: "ბიზნეს მფლობელები & ანალიტიკოსები",
      description: "გააანალიზე მონაცემები, მოამზადე რეპორტები და მიიღე გადაწყვეტილებები AI-ის დახმარებით.",
      benefits: [
        "PDF/Excel ანალიზი წამებში",
        "SWOT და კონკურენტული ანალიზი",
        "ბიზნეს-რეპორტების გენერაცია"
      ],
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Users,
      title: "HR & ოპერაციების მენეჯერები",
      description: "ავტომატიზირე რუტინული პროცესები, გააუმჯობესე კომუნიკაცია და დაზოგე დრო.",
      benefits: [
        "იმეილების ავტომატური დრაფტინგი",
        "კანდიდატების სკრინინგი",
        "შეხვედრების შეჯამება"
      ],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Lightbulb,
      title: "ტექნოლოგიით დაინტერესებულები",
      description: "შეისწავლე AI-ის პრაქტიკული გამოყენება პროგრამირების ცოდნის გარეშე.",
      benefits: [
        "Custom GPT-ების შექმნა",
        "AI აგენტების აწყობა",
        "ავტომატიზაციის სისტემები"
      ],
      color: "from-purple-500 to-violet-600"
    }
  ];

  const notFor = [
    "ვინც ელოდება, რომ AI თავისით იმუშავებს გაწვრთნის გარეშე",
    "ვისაც არ სურს ახალი უნარების სწავლაში დროის დახარჯვა",
    "ვინც ეძებს \"ჯადოსნურ ღილაკს\" წარმატებისთვის"
  ];

  return (
    <section id="who-is-this-for" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-semibold">
            ვისთვის არის ეს კურსი?
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            ეს პროგრამა შენთვისაა, თუ...
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            AI არის ინსტრუმენტი, რომელიც ყველას შეუძლია აითვისოს — პროგრამირების გარეშე.
          </p>
        </div>

        {/* Target Audience Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {targetAudience.map((audience, index) => {
            const Icon = audience.icon;
            return (
              <Card
                key={index}
                className="group p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl card-hover bg-card"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${audience.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
                  {audience.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {audience.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-3">
                  {audience.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center gap-3 text-text-secondary">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-sm sm:text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Not For Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              ეს კურსი არ არის შენთვის, თუ...
            </h3>
            <ul className="space-y-3">
              {notFor.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-red-600">
                  <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
