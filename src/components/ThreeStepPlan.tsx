import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, ClipboardCheck, Rocket } from "lucide-react";
import { tracking } from "@/utils/tracking";

export function ThreeStepPlan() {
  const steps = [
    {
      number: "1",
      icon: MessageSquare,
      title: "დაჯავშნე უფასო კონსულტაცია",
      description: "გაგესაუბრებით, ერთად გავარკვევთ რაში გჭირდება დახმარება, მოგიმზადებთ პირადად შენზე მორგებულ სასწავლო გეგმას",
      color: "bg-secondary",
      iconColor: "text-secondary"
    },
    {
      number: "2", 
      icon: ClipboardCheck,
      title: "აირჩიე ჯგუფური ან პირადი მენტორის მომსახურება",
      description: "ერთად გადავწყვიტოთ რა ტიპის მომსახურება გჭირდება - ჯგუფური სამეცადინო სესიები თუ პირადი მენტორის ჩართულობა შენს განვითარებაში",
      color: "bg-primary",
      iconColor: "text-primary"
    },
    {
      number: "3",
      icon: Rocket,
      title: "დაიწყებ შეუქცევად ტრანსფორმაციას",
      description: "ჩვენი ყოველდღიური ჩართულობითა და პერსონალური თანადგომით - შენ შეძლებ!",
      color: "bg-accent",
      iconColor: "text-accent"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-surface to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-6 px-4 break-words">
            როგორ დაიწყებ?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed px-6 break-words">
            სამი მარტივი ნაბიჯი შენი ტექნოლოგიური კარიერის დასაწყებად
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-text-muted/30" />
                  </div>
                )}
                
                <Card className="p-6 sm:p-8 text-center hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 relative`}>
                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 text-white`} />
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="font-bold text-text-primary text-sm sm:text-base">{step.number}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-3 px-2 break-words">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed px-2 break-words">
                    {step.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="text-center px-4">
          <Card className="inline-block p-6 sm:p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 w-full max-w-md">
            <p className="text-base sm:text-lg font-semibold text-text-primary mb-6 break-words">
              მზად ხარ დაიწყო? პირველი ნაბიჯი უფასოა!
            </p>
            <Button 
              variant="hero" 
              size="lg"
              className="group w-full"
              onClick={() => {
                tracking.buttonClick('დაჯავშნე კონსულტაცია', 'three-step-plan');
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="text-sm sm:text-base break-words">დაჯავშნე უფასო კონსულტაცია</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}