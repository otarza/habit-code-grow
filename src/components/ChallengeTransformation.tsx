import { Calendar, Dumbbell, Mountain, ArrowRight, CheckCircle, Target, Trophy } from "lucide-react";

export function ChallengeTransformation() {
  const transformationSteps = [
    {
      challenge: "21 Days",
      icon: Calendar,
      color: "secondary",
      title: "Build Foundation",
      subtitle: "From Zero to Habit",
      description: "Establish daily coding routine and overcome initial resistance",
      skills: ["Basic syntax mastery", "Problem-solving mindset", "Daily consistency"],
      outcome: "Coding becomes a natural part of your day",
      visual: "🌱"
    },
    {
      challenge: "30 Days",
      icon: Dumbbell,
      color: "accent",
      title: "Strengthen Core",
      subtitle: "From Habit to Skill",
      description: "Deepen understanding and tackle more complex challenges",
      skills: ["Advanced concepts", "Project building", "Code optimization"],
      outcome: "Confident in fundamental programming concepts",
      visual: "🌿"
    },
    {
      challenge: "100 Days",
      icon: Mountain,
      color: "premium",
      title: "Master Craft",
      subtitle: "From Skill to Expertise",
      description: "Develop expertise and independent problem-solving abilities",
      skills: ["Complex algorithms", "System design", "Independent learning"],
      outcome: "Self-sufficient programmer ready for real-world challenges",
      visual: "🌳"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "secondary":
        return {
          border: "border-secondary/30",
          bg: "bg-secondary/10",
          text: "text-secondary",
          glow: "shadow-glow"
        };
      case "accent":
        return {
          border: "border-accent/30",
          bg: "bg-accent/10",
          text: "text-accent",
          glow: "shadow-glow"
        };
      case "premium":
        return {
          border: "border-premium/30",
          bg: "bg-premium/10",
          text: "text-premium",
          glow: "shadow-premium"
        };
      default:
        return {
          border: "border-secondary/30",
          bg: "bg-secondary/10",
          text: "text-secondary",
          glow: "shadow-glow"
        };
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-text-primary mb-6">
            Your Transformation Journey
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-4">
            Watch yourself evolve from a beginner to an independent programmer through our proven challenge system
          </p>
          <div className="text-6xl mb-8">🌱 → 🌿 → 🌳</div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-secondary via-accent to-premium transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-3 gap-12 relative z-10">
            {transformationSteps.map((step, index) => {
              const Icon = step.icon;
              const colorClasses = getColorClasses(step.color);
              
              return (
                <div key={step.challenge} className="transformation-step">
                  <div className={`bg-surface border ${colorClasses.border} rounded-3xl p-8 card-hover ${colorClasses.glow} relative`}>
                    {/* Challenge Badge */}
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${colorClasses.bg} ${colorClasses.border} border rounded-full px-6 py-2`}>
                      <span className={`text-sm font-bold ${colorClasses.text}`}>
                        {step.challenge}
                      </span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${colorClasses.bg} ${colorClasses.border} border mb-6 mt-4`}>
                      <Icon className={`w-10 h-10 ${colorClasses.text}`} />
                    </div>
                    
                    {/* Content */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-text-primary mb-2">
                        {step.title}
                      </h3>
                      <p className={`text-lg font-semibold ${colorClasses.text} mb-3`}>
                        {step.subtitle}
                      </p>
                      <p className="text-text-secondary leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Skills Gained */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Skills You'll Gain
                      </h4>
                      <ul className="space-y-2">
                        {step.skills.map((skill, skillIndex) => (
                          <li key={skillIndex} className="flex items-center gap-2 text-sm text-text-secondary">
                            <CheckCircle className={`w-4 h-4 ${colorClasses.text}`} />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Outcome */}
                    <div className={`${colorClasses.bg} ${colorClasses.border} border rounded-xl p-4`}>
                      <div className="flex items-start gap-3">
                        <Trophy className={`w-5 h-5 ${colorClasses.text} mt-0.5 flex-shrink-0`} />
                        <div>
                          <h5 className="text-sm font-semibold text-text-primary mb-1">Outcome</h5>
                          <p className="text-sm text-text-secondary">{step.outcome}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow for mobile */}
                  {index < transformationSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-8 mb-4">
                      <ArrowRight className="w-8 h-8 text-accent" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-card rounded-3xl p-12 border border-border">
            <h3 className="text-3xl font-bold text-text-primary mb-4">
              Ready to Start Your Transformation?
            </h3>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their coding journey through our proven challenge system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-cta hover:shadow-glow text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Book Free Consultation
              </button>
              <button className="border border-secondary text-secondary hover:bg-secondary/10 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}