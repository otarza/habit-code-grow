import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BookOpen, Users, Star } from "lucide-react";
import { PixelGrid } from "@/components/PixelBackground";
import { TallyModal, useTallyModal } from "@/components/TallyModal";
import { tracking } from "@/utils/tracking";

export function PricingSection() {
  const { isOpen: isChallengeModalOpen, openModal: openChallengeModal, closeModal: closeChallengeModal } = useTallyModal();
  const { isOpen: isMentorshipModalOpen, openModal: openMentorshipModal, closeModal: closeMentorshipModal } = useTallyModal();
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
      price: "0₾",
      originalPrice: null,
      priceLabel: "სრულიად უფასო",
      ctaText: "დაიწყე სწავლა ახლავე",
      ctaAction: "start-free",
      popular: false,
      cardClass: "course-free"
    },
    {
      id: "challenge-21-30",
      icon: Users,
      title: "21 და 30 დღიანი ჩელენჯები",
      description: "21 და 30 დღიანი სტრუქტურირებული ჩელენჯების პროგრამა, მენტორის დახმარებითა და ჩვევის ჩამოყალიბებით",
      features: [
        "21 ან 30 დღიანი ინტენსიური ჩელენჯი",
        "ყოველდღიური მუშაობა საკუთარ თავზე",
        "მენტორი გეხმიანება ყოველდღიურად",
        "Discord - ის დახურული საზოგადოება",
        "ყოველკვირეული სამეცადინო სესიები",
        "სერტიფიკატი დასრულებისას"
      ],
      price: "250₾",
      originalPrice: "333₾",
      priceLabel: "ერთჯერადი",
      duration: "21 ან 30 დღე",
      ctaText: "დაჯავშნე შენი ადგილი",
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
      price: "450₾",
      originalPrice: null,
      priceLabel: "დან თვეში*",
      duration: "*საბოლოო ფასი შეთანხმებადია კონსულტაციისას",
      ctaText: "მიიღე უფასო კონსულტაცია",
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
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {/* მხოლოდ 12 ადგილი დარჩა იანვრის ჯგუფში */}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            აირჩიე შენთვის სასურველი გეგმა
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            გამჭვირვალე ფასები, ღია პირობები. დაიწყე უფასოდ ან აირჩიე პროფესიონალური გზა.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              <span>პერსონალური მხარდაჭერა</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              <span>Discord საზოგადოება</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              <span>ღია კომუნიკაცია მენტორთან</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      {service.originalPrice && (
                        <span className="text-lg text-text-muted line-through">{service.originalPrice}</span>
                      )}
                      <span className="text-4xl font-bold text-text-primary">{service.price}</span>
                      {service.priceLabel && (
                        <span className="text-lg text-text-secondary">/{service.priceLabel}</span>
                      )}
                    </div>
                    {service.duration && (
                      <div className="text-sm text-text-muted">{service.duration}</div>
                    )}
                    {service.originalPrice && (
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                        <span>25% ფასდაკლება</span>
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-3 mb-8 text-left">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {service.id === "free-courses" ? (
                    <div className="space-y-3">
                      <a 
                        href="https://forms.gle/2e5mE5b3xaGb8g1U8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full bg-secondary hover:bg-secondary/90 text-white"
                        >
                          🐍 Python პროგრამირება
                        </Button>
                      </a>
                      <a 
                        href="https://forms.gle/iand6o4N2aRRBxoC6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full bg-accent hover:bg-accent/90 text-white"
                        >
                          🗄️ SQL მონაცემთა ბაზები
                        </Button>
                      </a>
                      <a 
                        href="https://www.bitcamp.ge/courses/java/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="default"
                          size="lg"
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          ♨️ Java პროგრამირება
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <Button
                      variant={
                        service.id === "mentorship" ? "premium" : 
                        service.popular ? "hero" : 
                        service.id === "challenges" ? "consultation" : "default"
                      }
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (service.ctaAction === "book-consultation" || service.ctaAction === "apply-mentorship") {
                          // Track the interaction
                          tracking.courseInterest(service.id);
                          tracking.formStart(service.ctaText);
                          
                          if (service.id === "mentorship") {
                            openMentorshipModal();
                          } else {
                            openChallengeModal();
                          }
                        }
                      }}
                    >
                      {service.ctaText}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
{/*         
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-green-800 mb-4">
              🛡️ 100% კმაყოფილების გარანტია
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold text-green-800">30 დღის გარანტია</div>
                <div className="text-green-600">მთლიანი თანხის დაბრუნება</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold text-green-800">2,847 კმაყოფილი კლიენტი</div>
                <div className="text-green-600">2019 წლიდან</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="font-semibold text-green-800">4.9/5 შეფასება</div>
                <div className="text-green-600">Google Reviews-ზე</div>
              </div>
            </div>
            <p className="text-green-700 mt-6 font-medium">
              შენ ოღონდ დაიწყე და აღარ გაჩერდე! თუ პირველი 30 დღის განმავლობაში არ იქნები კმაყოფილი - 
              <strong> მთლიანი თანხას დაბრუნება, ყოველგვარი კითხვის გარეშე.</strong>
            </p>
          </div>
        </div> */}

      {/* Tally Modals */}
      <TallyModal
        isOpen={isChallengeModalOpen}
        onClose={closeChallengeModal}
        formUrl="https://tally.so/embed/npQK01"
        title="დაჯავშნე შენი ადგილი"
      />
      
      <TallyModal
        isOpen={isMentorshipModalOpen}
        onClose={closeMentorshipModal}
        formUrl="https://tally.so/embed/mO6z8Y"
        title="მიიღე უფასო კონსულტაცია"
      />
      </div>
    </section>
  );
}