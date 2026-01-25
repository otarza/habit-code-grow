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
            შენ გეძებთ
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            ეს პროგრამა შენთვისაა, თუ...
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            არ აქვს მნიშვნელობა პროფესიას — მთავარია გქონდეს სურვილი, მართო მომავლის ტექნოლოგია.
          </p>
        </div>

        {/* Target Audience Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          <Card className="group p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl card-hover bg-card">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
              0 - დან დამწყები
            </h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              გინდა გაერკვიე AI სამყაროში, შეიძინო მომავლის პროფესია ან უბრალოდ გაიმარტივო ყოველდღიურობა ტექნოლოგიებით.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">ახალი უნარების ათვისება</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">კარიერული ტრანსფორმაცია</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">პირადი ასისტენტის შექმნა</span>
              </li>
            </ul>
          </Card>

          <Card className="group p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl card-hover bg-card">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Megaphone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
              მარკეტერი & კრეატორი
            </h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              გჭირდება უსასრულო იდეები, კონტენტის სწრაფი შექმნა და სოციალური მედიის ავტომატიზაცია რუტინის გარეშე.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">კონტენტ-გეგმის ავტომატიზაცია</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">ვიზუალების გენერაცია</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">კოპირაიტინგი 10x სისწრაფით</span>
              </li>
            </ul>
          </Card>

          <Card className="group p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl card-hover bg-card">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
              ბიზნესის მფლობელი & მენეჯერი
            </h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              გსურს ოპერაციული ხარჯების შემცირება, პროცესების აჩქარება და გუნდის ეფექტურობის გაზრდა AI-ს დახმარებით.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">მონაცემების ანალიზი წამებში</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">რეპორტინგის ავტომატიზაცია</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">მომხმარებელთა მხარდაჭერა</span>
              </li>
            </ul>
          </Card>

          <Card className="group p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl card-hover bg-card">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3">
              ადმინისტრატორი & HR
            </h3>
            <p className="text-text-secondary mb-6 leading-relaxed">
              იძირები საბუთებსა და იმეილებში? ისწავლე როგორ გადააბარო მოსაწყენი საქმეები ხელოვნურ ინტელექტს.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">დოკუმენტაციის დამუშავება</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">CV-ების სკრინინგი</span>
              </li>
              <li className="flex items-center gap-3 text-text-secondary">
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base">შეხვედრების მართვა</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Not For Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6" />
              ეს კურსი არ გამოგადგება, თუ...
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-red-600">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>გგონია, რომ "ყურება" საკმარისია — აქ კეთებაა მთავარი.</span>
              </li>
              <li className="flex items-start gap-3 text-red-600">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>ეძებ "ჯადოსნურ ღილაკს", რომელიც მუშაობის გარეშე გაგამდიდრებს.</span>
              </li>
              <li className="flex items-start gap-3 text-red-600">
                <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>არ გაქვს სურვილი, დაუთმო დღეში 20-30 წუთი განვითარებას.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
