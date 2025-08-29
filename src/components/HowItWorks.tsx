import { Card } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Target, Brain, Trophy } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      title: "ყოველდღიურობა",
      description: "30-60 წუთიანი ფოკუსირებული, ყოველდღიური მუშაობა საკუთარ თავზე უფრო მეტს გაძლევს ვიდრე შაბათ-კვირას ღამეების თენება. მუდმივად ფორმაში ყოფნა და საკუთარი პროგრესის შეგრძნება გაძლევს თავდაჯერებას.",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "სამეცადინო სესიები",
      description: "ინდივიდუალურად შენთვის შედგენილი მინი გაკვეთილები მხოლოდ იმ თემებზე რაც შენთვისაა მნიშვნელოვანი და არა ზოგადად ჯგუფისთვის.",
      color: "text-primary"
    },
    {
      icon: MessageSquare,
      title: "მუდმივი მხარდაჭერა",
      description: "სასწავლო სერვერი, მეგობრულობა, ერთმანეთზე ზრუნვის კულტურა და შემართება ქმნის წარმატებისთვის საჭირო უალტერნატივო გარემოს",
      color: "text-accent"
    },
    {
      icon: Target,
      title: "ინდივიდუალური სასწავლო პროცესი",
      description: "ყველა სტუდენტს თავისი გზა აქვს. შენ ვერ ჩამორჩები და ვერ გაასწრებ ვერავის რადგან შენი ტემპი გაქვს და მხოლოდ შენს გუშინდელ თავს ედრები. ჩვენი საგანმანათლებლო სისტემა უზრუნველყოფს იმას რომ შენი ბილიკი მხოლოდ შენია და სხვებზე არ ხარ დამოკიდებული",
      color: "text-secondary"
    },
    {
      icon: Brain,
      title: "მეცნიერულად დადასტურებული",
      description: "ნეირო-ტექნიკები ინსპირირებულია ისეთი წყაროებიდან როგორიცაა 'A Mind for Numbers' - რაც საშუალებას იძლევა ისწავლო ყველაზე კომპლექსური საკითხები, მაშნაც კი თუ ფიქრობ რომ არ გაქვს \"ტექნიკური ან მათემატიკური\" ტვინი",
      color: "text-primary"
    },
    {
      icon: Trophy,
      title: "მიზანი - დამოუკიდებლობა",
      description: "წარმატება ნიშნავს იმას რომ შენ აღწევ იმ მომენტს როცა აღარ გჭირდება მენტორის დახმარება - შენი ჩვევები ცხოვრების ბოლომდე შენთან რჩება, შეუპოვრობა კი შენი უსასრულო განვითარების უმძლავრეს იარაღად იქცევა. დამოუკიდებელ პროფესიონალად ჩამოყალიბება შენი მთავარი მიზანია.",
      color: "text-accent"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            როგორ მუშაობს
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ყოველდღიური პროგრესი, სტრუქტურა, მეგობრული საზოგადოება, მხარდაჭერისა და ზრუნვის კულტურა, მეცნიერულად დადასტურებული სწავლის ტექნიკები, მსოფლიო დონის მენტორობა 
          </p>
        </div>

        {/* Timeline Visual */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Desktop Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-secondary via-primary to-accent rounded-full"></div>
          {/* Mobile Timeline Line */}
          <div className="md:hidden absolute left-6 w-1 h-full bg-gradient-to-b from-secondary via-primary to-accent rounded-full"></div>
          
          <div className="space-y-8 md:space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center ${
                // Desktop: alternating layout, Mobile: consistent left layout
                index % 2 === 0 ? 'md:flex-row flex-row' : 'md:flex-row-reverse flex-row'
              }`}>
                <div className={`${
                  // Desktop: half width with proper padding and alignment, Mobile: full width minus circle space
                  index % 2 === 0 
                    ? 'md:w-1/2 md:pr-8 md:text-right w-full pl-16 text-left' 
                    : 'md:w-1/2 md:pl-8 md:text-left w-full pl-16 text-left'
                }`}>
                  <Card className="p-4 md:p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                    <div className={`flex items-center gap-3 md:gap-4 mb-3 md:mb-4 ${
                      // Desktop: alternating icon position, Mobile: consistent left position
                      index % 2 === 0 ? 'md:flex-row-reverse flex-row' : 'md:flex-row flex-row'
                    }`}>
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        step.color === 'text-secondary' ? 'bg-secondary/10' :
                        step.color === 'text-primary' ? 'bg-primary/10' :
                        'bg-accent/10'
                      }`}>
                        <step.icon className={`w-5 h-5 md:w-6 md:h-6 ${step.color}`} />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-text-primary">{step.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-text-secondary leading-relaxed">{step.description}</p>
                  </Card>
                </div>
                
                {/* Center Circle */}
                <div className={`relative z-10 ${
                  // Desktop: centered, Mobile: positioned on left
                  'md:static absolute left-0 top-1/2 md:transform-none transform -translate-y-1/2'
                }`}>
                  <div className={`w-4 h-4 md:w-6 md:h-6 rounded-full border-2 md:border-4 border-surface ${
                    step.color === 'text-secondary' ? 'bg-secondary' :
                    step.color === 'text-primary' ? 'bg-primary' :
                    'bg-accent'
                  }`}></div>
                </div>
                
                {/* Desktop spacer */}
                <div className="hidden md:block w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Works */}
        <div className="bg-gradient-to-br from-primary-light to-primary/5 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            რა ღირებულებები ამუშავებს ამ სისტემას?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">5+</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">წლები დავხარჯეთ მის შექმნასა და დახვეწაში</h4>
              <p className="text-text-secondary text-sm">მუდმივად ვავითარებთ სტუდენტებისგან მიღებული გამოცდილებების კვალდაკვალ</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">ჩვევა უპირველეს ყოვლისა</h4>
              <p className="text-text-secondary text-sm">ჩვევის ჩამოყალიბებაზე ზრუნვა გაცილებით მნიშვნელოვანია ვიდრე ნებისმიერი კურსი</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">დამოუკიდებლობა</h4>
              <p className="text-text-secondary text-sm">მხოლოდ დამოუკიდებელ ადამიანებს შეუძლიათ საკუთარი სამყაროს შეცვლა უკეთესობისკენ</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}