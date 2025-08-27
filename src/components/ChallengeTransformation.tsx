import { Card } from "@/components/ui/card";
import { Calendar, Target, Trophy, ArrowRight } from "lucide-react";
import { PixelBackground } from "@/components/PixelBackground";

export function ChallengeTransformation() {
  const challengeStages = [
    {
      days: 21,
      title: "შექმენი ფუნდამენტი",
      subtitle: "ჩვევის ჩამოყალიბება",
      icon: Calendar,
      color: "text-secondary",
      bgColor: "course-free",
      description: "21 დღის განმავლობაში, ყოველდღიური 30-60 წუთიანი სესიებით ჩამოყალიბდება ის ჩვევა, რაც აუცილებელია წარმატებისთვის",
      habits: [
        "ყოველდღიური კოდირება",
        "პრობლემების სისტემატური გადაწყვეტა",
        "სწავლის რუტინის ჩამოყალიბება"
      ],
      outcome: "კოდირება გახდება შენი ყოველდღიური რუტინის ნაწილი"
    },
    {
      days: 30,
      title: "ჩაუჯექი",
      subtitle: "ჩვევის გამყარება", 
      icon: Target,
      color: "text-primary",
      bgColor: "course-challenge",
      description: "30 დღიან ჩელენჯში უკვე გამომუშავებული ჩვევის გამყარება ხდება ისე რომ კოდის წერა ბუნებრივი პროცესი ხდება",
      habits: [
        "რთული პრობლემების დაძლევა",
        "AI ხელსაწყოების ეფექტური გამოყენება", 
        "კონსისტენტური შრომისმოყვარეობა"
      ],
      outcome: "კოდირება ისეთივე ბუნებრივი ხდება როგორც სუნთქვა"
    },
    {
      days: 100,
      title: "ჩააჭირე",
      subtitle: "ჩვევის ინტეგრაცია",
      icon: Trophy,
      color: "text-accent", 
      bgColor: "course-premium",
      description: "100 დღიან ჩელენჯში შენი სამყარო იცვლება და ახალი უნარები შენი ყოველდღიურობის განუყოფელი ნაწილი ხდება",
      habits: [
        "მუდმივი განვითარება და ახალი ტექნოლოგიების სწავლა",
        "რეალური პროექტების შექმნა",
        "სხვების დახმარება და ცოდნის გაზიარება"
      ],
      outcome: "ხდები დამოუკიდებელი დეველოპერი სიცოცხლის ბოლომდე"
    }
  ];

  return (
    <section className="relative py-20 bg-background pixel-bg">
      <PixelBackground />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            ჩელენჯების პროგრამა
          </h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
            სამი ეტაპი რომელიც შეგძლებს გახდე შეუჩერებელი დეველოპერი. 
            ყოველი ჩელენჯი ამყარებს ჩვევებს და ცვლის შენს იდენტობას.
          </p>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {challengeStages.map((stage, index) => {
            const Icon = stage.icon;
            
            return (
              <Card key={stage.days} className={`relative p-8 md:p-10 card-hover pixel-border ${stage.bgColor} text-center overflow-hidden`}>
                {/* Challenge Number - Big and Bold */}
                <div className="mb-8">
                  <div className={`w-20 h-20 mx-auto pixel-border flex items-center justify-center mb-4 ${
                    stage.days === 21 ? "bg-secondary" :
                    stage.days === 30 ? "bg-primary" :
                    "bg-accent"
                  }`}>
                    <span className="text-3xl font-black text-white">{stage.days}</span>
                  </div>
                  <div className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
                    {stage.subtitle}
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    {stage.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-8 text-base">
                  {stage.description}
                </p>

                {/* Habits List */}
                <div className="mb-8">
                  <h4 className="font-bold text-text-primary mb-4 text-left">
                    რას ისწავლი:
                  </h4>
                  <ul className="space-y-3 text-left">
                    {stage.habits.map((habit, habitIndex) => (
                      <li key={habitIndex} className="text-sm text-text-secondary flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-none mt-2 flex-shrink-0 ${stage.color.replace('text-', 'bg-')}`}></div>
                        {habit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome Badge */}
                <div className={`pixel-border p-4 ${
                  stage.days === 21 ? "bg-secondary/10" :
                  stage.days === 30 ? "bg-primary/10" :
                  "bg-accent/10"
                }`}>
                  <Icon className={`w-6 h-6 ${stage.color} mx-auto mb-2`} />
                  <p className="font-bold text-text-primary text-sm leading-tight">
                    {stage.outcome}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Progression Flow */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <div className="text-4xl font-black text-secondary">21</div>
          <ArrowRight className="w-8 h-8 text-text-muted" />
          <div className="text-4xl font-black text-primary">30</div>
          <ArrowRight className="w-8 h-8 text-text-muted" />
          <div className="text-4xl font-black text-accent">100</div>
        </div>

        {/* Final Call to Action */}
        <div className="text-center">
          <Card className="p-8 md:p-12 pixel-border course-challenge max-w-3xl mx-auto card-hover">
            <div className="w-20 h-20 bg-primary pixel-border flex items-center justify-center mx-auto mb-8">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-6">მზად ხარ დაიწყო შენი ტრანსფორმაცია?</h3>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              შეუერთდი ათასობით სტუდენტს ვინც წარმატებით ამოიღო ჩვევები და გახდა დეველოპერი.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-secondary pixel-border"></div>
                <span className="font-bold text-text-secondary">95% წარმატების ალბათობა</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-accent pixel-border"></div>
                <span className="font-bold text-text-secondary">5000+ კურსდამთავრებული</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}