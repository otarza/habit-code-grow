import { ChallengeCard } from "./ChallengeCard";

export function ChallengeSection() {
  const challenges = [
    {
      type: "21" as const,
      title: "Start Your Streak",
      description: "Build the habit with daily 30-60 minute sessions, check-ins, and a simple tracker.",
      features: [
        "Daily structure & habit tracker",
        "Discord accountability community", 
        "Weekly Saturday live sessions",
        "Personalized mentor check-ins",
        "Simple milestone celebrations",
        "Evidence-based learning techniques"
      ],
      price: "$97",
      ctaText: "Start the 21-Day Challenge",
      popular: true
    },
    {
      type: "30" as const,
      title: "Lock It In", 
      description: "Stabilize your habit and make consistency feel natural with advanced tactics.",
      features: [
        "Everything from 21-Day",
        "Advanced consistency strategies",
        "Deeper code reviews & feedback",
        "Momentum milestone tracking",
        "Problem-solving workshops",
        "Habit psychology deep-dives"
      ],
      price: "$197",
      ctaText: "Upgrade to 30-Day"
    },
    {
      type: "100" as const,
      title: "Make It Your Identity",
      description: "Integrate coding + self-development into everyday life permanently.",
      features: [
        "Everything from 30-Day",
        "Long-term streak strategies",
        "Structured project guidance",
        "Alumni network access",
        "Completion certificate",
        "Lifetime habit mastery"
      ],
      price: "$497",
      ctaText: "Commit to 100-Day"
    }
  ];

  return (
    <section id="21-day" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Choose Your Challenge
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Start with 21 days to build the foundation, then level up to 30 and 100 days 
            to maintain momentum and make coding a permanent part of your identity.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-text-secondary">Beginner Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-text-secondary">Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-text-secondary">Live Support</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.type}
              {...challenge}
              onCtaClick={() => {
                // Scroll to pricing or handle checkout
                document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
        
        {/* Urgency & Guarantee */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-6 py-3 mb-4">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span className="font-semibold text-accent">New cohort starts Monday • Limited seats for personal attention</span>
          </div>
          
          <p className="text-text-secondary">
            <strong>100% Guarantee:</strong> Complete the challenge and don't feel progress? Full refund.
          </p>
        </div>
      </div>
    </section>
  );
}