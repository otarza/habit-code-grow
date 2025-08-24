import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BookOpen, Users, Star } from "lucide-react";

export function PricingSection() {
  const services = [
    {
      id: "free-courses",
      icon: BookOpen,
      title: "Free Courses",
      description: "Well-structured video courses for anyone to start their programming journey",
      features: [
        "Complete beginner-friendly curriculum",
        "Step-by-step video tutorials", 
        "Practice exercises and projects",
        "Community forum access",
        "Lifetime access to all content"
      ],
      price: "Free",
      ctaText: "Start Learning",
      ctaAction: "start-free",
      popular: false,
      cardClass: "course-free"
    },
    {
      id: "challenges",
      icon: Users,
      title: "Challenge Programs",
      description: "21, 30, and 100-day structured challenges with mentorship and accountability",
      features: [
        "Daily structured learning sessions",
        "Personal mentor check-ins",
        "Discord community support",
        "Live weekly sessions",
        "Progress tracking and milestones",
        "Certificate of completion"
      ],
      price: "Book Consultation",
      ctaText: "Schedule Consultation",
      ctaAction: "book-consultation",
      popular: true,
      cardClass: "course-challenge"
    },
    {
      id: "mentorship",
      icon: Star,
      title: "Individual Mentorship",
      description: "Premium 1-on-1 study sessions with personalized guidance and advanced techniques",
      features: [
        "Weekly 1-on-1 video sessions",
        "Personalized learning roadmap",
        "Code review and feedback",
        "Career guidance and planning",
        "Priority support and access",
        "Advanced project collaboration"
      ],
      price: "Premium",
      ctaText: "Apply for Mentorship",
      ctaAction: "apply-mentorship",
      popular: false,
      cardClass: "course-premium premium-chrome"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Choose Your Learning Path
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            From free courses to premium mentorship, we have options for every stage of your programming journey.
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
                      Most Popular
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
            <strong>100% Satisfaction Guarantee:</strong> Not satisfied with your progress? Full refund within 30 days.
          </p>
        </div>
      </div>
    </section>
  );
}