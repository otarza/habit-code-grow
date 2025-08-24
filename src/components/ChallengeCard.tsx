import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Calendar, Dumbbell, Mountain } from "lucide-react";

interface ChallengeCardProps {
  type: "21" | "30" | "100";
  title: string;
  description: string;
  features: string[];
  price?: string;
  popular?: boolean;
  ctaText: string;
  onCtaClick?: () => void;
}

const challengeIcons = {
  "21": Calendar,
  "30": Dumbbell,
  "100": Mountain,
};

const challengeColors = {
  "21": "challenge-21",
  "30": "challenge-30", 
  "100": "challenge-100",
};

export function ChallengeCard({
  type,
  title,
  description,
  features,
  price,
  popular,
  ctaText,
  onCtaClick,
}: ChallengeCardProps) {
  const Icon = challengeIcons[type];
  const colorClass = challengeColors[type];

  return (
    <Card className={`relative p-8 card-hover ${popular ? 'ring-2 ring-accent shadow-strong' : 'shadow-soft'}`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-cta text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${
          type === "21" ? "from-secondary-light to-secondary/20" : 
          type === "30" ? "from-primary-light to-primary/20" :
          "from-accent-light to-accent/20"
        } mb-6`}>
          <Icon className={`w-8 h-8 ${colorClass}`} />
        </div>
        
        <div className="mb-2">
          <span className={`text-2xl font-bold ${colorClass}`}>{type}</span>
          <span className="text-lg text-text-secondary ml-1">Days</span>
        </div>
        
        <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
        <p className="text-text-secondary mb-6 leading-relaxed">{description}</p>
        
        {price && (
          <div className="mb-6">
            <span className="text-3xl font-bold text-text-primary">{price}</span>
          </div>
        )}
        
        <ul className="space-y-3 mb-8 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <span className="text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button
          variant={popular ? "hero" : type === "21" ? "secondary" : "default"}
          size="lg"
          className="w-full"
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </div>
    </Card>
  );
}