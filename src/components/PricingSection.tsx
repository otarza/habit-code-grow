import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Play, Users, Crown } from "lucide-react";

export function PricingSection() {
  const offerings = [
    {
      id: "free",
      icon: Play,
      title: "Free Courses",
      description: "Access our comprehensive video course library",
      features: [
        "Well-structured video lessons",
        "Programming fundamentals",
        "Practical coding exercises",
        "Self-paced learning",
        "Community forum access"
      ],
      cta: "Start Learning Free",
      type: "free"
    },
    {
      id: "challenges",
      icon: Users,
      title: "Coding Challenges",
      description: "21 → 30 → 100 day transformation program",
      features: [
        "Structured habit-building system",
        "Weekly live sessions",
        "Discord community support",
        "Personal progress tracking",
        "Mentorship guidance"
      ],
      cta: "Book Consultation",
      type: "consultation"
    },
    {
      id: "mentorship",
      icon: Crown,
      title: "1-on-1 Mentorship",
      description: "Premium individual coaching sessions",
      features: [
        "Private mentoring sessions",
        "Personalized learning path",
        "Code review & feedback",
        "Career guidance",
        "Direct mentor access"
      ],
      cta: "Apply for Mentorship",
      type: "premium"
    }
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-6">
            Choose Your Learning Path
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            From free courses to premium mentorship, we have the right solution for your coding journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {offerings.map((offering) => {
            const Icon = offering.icon;
            const isPremium = offering.type === "premium";
            
            return (
              <Card 
                key={offering.id} 
                className={`relative p-8 text-center card-hover ${
                  isPremium 
                    ? 'premium-card shadow-chrome' 
                    : 'bg-surface border-border shadow-medium'
                }`}
              >
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                    isPremium 
                      ? 'bg-gradient-premium shadow-premium' 
                      : offering.type === 'free' 
                        ? 'bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30'
                        : 'bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30'
                  }`}>
                    <Icon className={`w-8 h-8 ${
                      isPremium 
                        ? 'text-premium-foreground' 
                        : offering.type === 'free' 
                          ? 'text-secondary' 
                          : 'text-accent'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    {offering.title}
                  </h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    {offering.description}
                  </p>
                  
                  <ul className="space-y-4 mb-8 text-left">
                    {offering.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          isPremium ? 'text-premium' : 'text-accent'
                        }`} />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={isPremium ? "premium" : offering.type === "free" ? "secondary" : "default"}
                    size="lg"
                    className="w-full"
                  >
                    {offering.cta}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}