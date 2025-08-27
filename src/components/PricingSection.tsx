import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BookOpen, Users, Star } from "lucide-react";
import { PixelGrid } from "@/components/PixelBackground";

export function PricingSection() {
  const services = [
    {
      id: "free-courses",
      icon: BookOpen,
      title: "უფასო კურსები",
      description: "კარგად ორგანიზებული ვიდეო კურსები თუ გინდა რომ შენით ისწავლო, მენტორის და მხარდაჭერის გარეშე",
      features: [
        "დამწყებებზე მორგებული კურსები",
        "ვიდეო გაკვეთილები", 
        "სავარჯიშოები და პროექტები",
        "მოხვდი BitCamp - ის მრავალათასიან ჯგუფში",
        "საკუთარი თავის იმედად"
      ],
      price: "მიიღე",
      ctaText: "დაიწყე სწავლა",
      ctaAction: "start-free",
      popular: false,
      cardClass: "course-free"
    },
    {
      id: "challenges",
      icon: Users,
      title: "ჩელენჯების პროგრამა",
      description: "21, 30, და 100 დღიანი სტრუქტურირებული ჩელენჯების პროგრამა, მენტორის დახმარებითა და ჩვევის ჩამოყალიბებით",
      features: [
        "ყოველდღიური მუშაობა საკუთარ თავზე",
        "მენტორი გეხმიანება ყოველდღიურად",
        "Discord - ის დახურული საზოგადოება",
        "ყოველკვირეული სამეცადინო სესიები",
        "პროგრესის შეფასება",
        "სერტიფიკატები"
      ],
      price: "დაიწყე ტრანსფორმაცია",
      ctaText: "ჩაეწერე კონსულტაციაზე",
      ctaAction: "book-consultation",
      popular: true,
      cardClass: "course-challenge"
    },
    {
      id: "mentorship",
      icon: Star,
      title: "ინდივიდუალური მენტორი",
      description: "პრემიუმ მომსახურება მათთვის ვისაც სურს მიიღოს მაქსიმალური ეფექტი, უმოკლეს დროში. პირადი სესიები, 1-1 - ზე. მენტორი მხოლოდ შენზე ზრუნავს",
      features: [
        "ყოველდღიური სამეცადინო სესიები მენტორთან ერთად",
        "პირადად შენთვის შედგენილი სასწავლო პროგრამა",
        "დავალებების დეტალური შემოწმება და მენტორთან ერთად მუშაობა",
        "ემოციური და ფსიქოლოგიური მხარდაჭერა",
        "წვდომა მენტორის პირად ტელეფონის ნომერზე",
        "კომპლექსურ პროექტებზე კოლაბორაცია"
      ],
      price: "მხოლოდ რჩეულთათვის",
      ctaText: "ჩანიშნე გასაუბრება",
      ctaAction: "apply-mentorship",
      popular: false,
      cardClass: "course-premium premium-chrome"
    }
  ];

  return (
    <section id="pricing" className="relative py-20 bg-surface pixel-bg">
      <PixelGrid />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            გადაწყვიტე რა გზას დაადგე
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            უფასო კურსებიდან პრემიუმ სამენტორო მომსახურებამდე - ყველაფერს გთავაზობთ, სულო და გულო!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.id} 
                className={`relative p-8 card-hover ${service.popular ? 'ring-2 ring-primary shadow-glow' : 'shadow-soft'} ${service.cardClass}`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-cta text-text-inverse px-4 py-1 rounded-full text-sm font-semibold">
                      პოპულარული
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-text-primary mb-3">{service.title}</h3>
                  <p className="text-text-secondary mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-text-primary">{service.price}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={
                      service.id === "mentorship" ? "premium" : 
                      service.popular ? "hero" : 
                      service.id === "challenges" ? "consultation" : "default"
                    }
                    size="lg"
                    className="w-full"
                  >
                    {service.ctaText}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-text-secondary">
            <strong>100% კმაყოფილების გარანტია:</strong> შენ ოღონდ დაიწყე და აღარ გაჩერდე! გპირდებით გამოგივა.
          </p>
        </div>
      </div>
    </section>
  );
}