import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Users, Star, Globe } from "lucide-react";
import { PixelGrid } from "@/components/PixelBackground";
import { TallyModal, useTallyModal } from "@/components/TallyModal";
import { tracking } from "@/utils/tracking";

export function PricingSection() {
  const { isOpen: isChallengeModalOpen, openModal: openChallengeModal, closeModal: closeChallengeModal } = useTallyModal();
  const { isOpen: isMentorshipModalOpen, openModal: openMentorshipModal, closeModal: closeMentorshipModal } = useTallyModal();
  const services = [
    {
      id: "group-mentorship",
      icon: Users,
      title: "ჯგუფური სამენტორო",
      description: "21 დღიანი ინტენსიური ჩელენჯი ჯგუფურ გარემოში, სადაც გადადგამ აუცილებელ პირველ ნაბიჯებს",
      features: [
        "21 დღიანი ინტენსიური ჩელენჯი",
        "ყოველკვირეული ჯგუფური სამეცადინო სესიები",
        "10-15 კაციანი ჯგუფები მაქსიმალური ეფექტისთვის",
        "Discord - ის დახურული საზოგადოება",
        "მხარდაჭერა და მოტივაცია",
        "სერტიფიკატი დასრულებისას"
      ],
      price: "350₾",
      originalPrice: "433₾",
      priceLabel: "ერთჯერადი",
      duration: "21 დღე ჯგუფურ გარემოში",
      ctaText: "დაიწყე ტრანსფორმაცია",
      ctaAction: "book-consultation",
      popular: true,
      cardClass: "course-challenge"
    },
    {
      id: "personal-mentorship",
      icon: Star,
      title: "პირადი მენტორი",
      description: "პრემიუმ მომსახურება. აიყვანე პირადი მენტორი თუ გსურს მაქსიმალური შედეგი უმოკლეს დროში. პირადად შენთვის შექმნილ სამეცადინო სესიებზე მენტორი მთლიანად შენზეა ფოკუსირებული",
      features: [
        "1-1 - ზე ყოველდღიური სესიები მხოლოდ შენთვის",
        "100% - ით შენთვის შექმნილი სასწავლო პროგრამა",
        "დავალებების დეტალური განხილვა და კოდის რევიუ",
        "მენტორის სრული ყურადღება და ფოკუსი შენზე",
        "პირდაპირი კომუნიკაცია მენტორთან ნებისმიერ დროს",
        "სწრაფი პროგრესი და ინდივიდუალური მიდგომა"
      ],
      price: "650₾",
      originalPrice: null,
      priceLabel: "დან თვეში*",
      duration: "*საბოლოო ფასი შეთანხმებადია კონსულტაციისას",
      ctaText: "მიიღე უფასო კონსულტაცია",
      ctaAction: "apply-mentorship",
      popular: false,
      cardClass: "course-premium premium-chrome"
    },
    {
      id: "emigrant-mentorship",
      icon: Globe,
      title: "ემიგრანტებისთვის",
      description: "ემიგრანტი ხარ? მიიღე განსაკუთრებული პრიობები და ისწავლე პირად მენტორთან 1-1 - ზე შენთვის მოსახერხებელ დროებში",
      features: [
        "მოქნილი გრაფიკი ნებისმიერი სასაათო სარტყელისთვის",
        "პირადი მენტორი გამეცადინებს 1-1 - ზე",
        "სასწავლო პროგრამას მოვარგებთ შენს მიზნებს",
        "სურვილის შემთხვევაში ჩაგრთავთ ჯგუფურ პროექტებში",
        "კვირაში 3-4 სესია შენთვის მოსახერხებელ დროს",
        "კარიერული მხარდაჭერა საზღვარგარეთ"
      ],
      price: "ფასი შეთანხმებადია",
      originalPrice: null,
      priceLabel: "",
      duration: "განსაკუთრებული პირობები ემიგრანტებისთვის",
      ctaText: "ჩაეწერე კონსულტაციაზე",
      ctaAction: "emigrant-consultation",
      popular: false,
      cardClass: "course-emigrant emigrant-special"
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
            აირჩიე სასურველი სამენტორო მომსახურება
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ჩვენი სამენტორო ერთადერთი ფორმატია საქართველოში სადაც შენ ხარ მთავარი და არა ლექტორი
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6 text-sm text-text-muted px-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-2 h-2 text-white" />
              </div>
              <span>პერსონალური მხარდაჭერა</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-2 h-2 text-white" />
              </div>
              <span>Discord საზოგადოება</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-2 h-2 text-white" />
              </div>
              <span>ღია კომუნიკაცია მენტორთან</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.id} 
                id={service.id}
                className={`relative p-8 card-hover ${service.popular ? 'ring-2 ring-primary shadow-glow' : 'shadow-soft'} ${service.cardClass} h-full flex flex-col`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-cta text-text-inverse px-4 py-1 rounded-full text-sm font-semibold">
                      პოპულარული
                    </span>
                  </div>
                )}
                
                <div className="text-center flex-1 flex flex-col">
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
                  
                  <ul className="space-y-3 mb-8 text-left flex-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto">
                    <Button
                      variant={
                        service.id === "mentorship" ? "premium" : 
                        service.popular ? "hero" : 
                        service.id === "challenges" ? "consultation" : "default"
                      }
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        if (service.ctaAction === "book-consultation" || service.ctaAction === "apply-mentorship" || service.ctaAction === "emigrant-consultation") {
                          // Track the interaction
                          tracking.courseInterest(service.id);
                          tracking.formStart(service.ctaText);
                          
                          if (service.id === "personal-mentorship") {
                            openMentorshipModal();
                          } else if (service.id === "emigrant-mentorship") {
                            openMentorshipModal();
                          } else {
                            openChallengeModal();
                          }
                        }
                      }}
                    >
                      {service.ctaText}
                    </Button>
                  </div>
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