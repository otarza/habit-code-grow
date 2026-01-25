import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Repeat,
  Zap,
  Bot,
  TrendingUp,
  ArrowRight
} from "lucide-react";

export function AITransformationPath() {
  const beforeItems = [
    { icon: Clock, text: "საათობით ხარჯავ დროს რუტინულ დავალებებზე" },
    { icon: AlertTriangle, text: "AI-ს პასუხები არაპროგნოზირებადი და არაზუსტია" },
    { icon: Repeat, text: "იგივე სამუშაოს ხელით მეორდები ყოველდღე" },
    { icon: XCircle, text: "არ იცი როგორ დააკავშირო AI სხვა ინსტრუმენტებთან" }
  ];

  const afterItems = [
    { icon: Zap, text: "ავტომატიზაციები მუშაობს 24/7 შენს ნაცვლად" },
    { icon: CheckCircle2, text: "AI-სგან იღებ ზუსტად იმ პასუხს, რაც გინდა" },
    { icon: Bot, text: "შენი პერსონალური AI აგენტები ასრულებენ დავალებებს" },
    { icon: TrendingUp, text: "n8n-ით აკავშირებ ნებისმიერ აპლიკაციას" }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 px-4 py-2 text-sm font-semibold">
            ტრანსფორმაცია
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            სანამ vs შემდეგ
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            ნახე რა იცვლება, როცა AI-ს სწორად იყენებ
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before Card */}
          <Card className="p-6 sm:p-8 border-2 border-red-200 bg-red-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-700">სანამ</h3>
                <p className="text-red-600 text-sm">კურსის გავლამდე</p>
              </div>
            </div>

            <ul className="space-y-4">
              {beforeItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700">{item.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 pt-6 border-t border-red-200">
              <div className="flex items-center justify-between">
                <span className="text-red-600 font-medium">პროდუქტიულობა</span>
                <div className="flex gap-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="w-4 h-4 bg-red-400 rounded"></div>
                  ))}
                  {[3, 4, 5].map((i) => (
                    <div key={i} className="w-4 h-4 bg-red-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* After Card */}
          <Card className="p-6 sm:p-8 border-2 border-green-200 bg-green-50/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-700">შემდეგ</h3>
                <p className="text-green-600 text-sm">კურსის გავლის შემდეგ</p>
              </div>
            </div>

            <ul className="space-y-4">
              {afterItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-green-700">{item.text}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 pt-6 border-t border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-medium">პროდუქტიულობა</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-4 h-4 bg-green-400 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Transformation Arrow (Mobile) */}
        <div className="flex justify-center my-8 lg:hidden">
          <ArrowRight className="w-8 h-8 text-text-secondary rotate-90" />
        </div>

        {/* Key Transformation Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">10x</div>
            <div className="text-text-secondary text-sm">უფრო სწრაფი კონტენტის შექმნა</div>
          </div>
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <div className="text-3xl sm:text-4xl font-bold text-purple-500 mb-2">90%</div>
            <div className="text-text-secondary text-sm">რუტინის ავტომატიზაცია</div>
          </div>
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <div className="text-3xl sm:text-4xl font-bold text-secondary mb-2">24/7</div>
            <div className="text-text-secondary text-sm">AI აგენტები მუშაობს</div>
          </div>
          <div className="text-center p-6 bg-muted/50 rounded-xl">
            <div className="text-3xl sm:text-4xl font-bold text-blue-500 mb-2">0</div>
            <div className="text-text-secondary text-sm">კოდის ხაზი საჭირო</div>
          </div>
        </div>
      </div>
    </section>
  );
}
