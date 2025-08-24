import { Card } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Target, Brain, Trophy } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Calendar,
      title: "Daily Structure",
      description: "30-60 minute focused coding sessions with clear goals and progress tracking",
      color: "text-secondary"
    },
    {
      icon: Users,
      title: "Weekly Live Sessions",
      description: "Saturday Google Meet calls for mini-lessons, Q&A, and community connection",
      color: "text-primary"
    },
    {
      icon: MessageSquare,
      title: "Discord Community",
      description: "24/7 support, daily accountability check-ins, and peer encouragement",
      color: "text-accent"
    },
    {
      icon: Target,
      title: "Personalized Guidance",
      description: "Individual help for your specific roadblocks - not one-size-fits-all",
      color: "text-secondary"
    },
    {
      icon: Brain,
      title: "Evidence-Based Learning",
      description: "Techniques inspired by 'A Mind for Numbers' - spacing, interleaving, retrieval practice",
      color: "text-primary"
    },
    {
      icon: Trophy,
      title: "Independence Goal",
      description: "Success is when you don't need the mentor anymore - lifelong learning habits",
      color: "text-accent"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            How It Works
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            A proven 4-pillar system that transforms scattered learning into 
            consistent daily progress through structure, community, and mentorship.
          </p>
        </div>

        {/* Timeline Visual */}
        <div className="relative max-w-4xl mx-auto mb-16">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-secondary via-primary to-accent rounded-full"></div>
          
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="p-6 shadow-soft hover:shadow-medium transition-all duration-300">
                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        step.color === 'text-secondary' ? 'bg-secondary/10' :
                        step.color === 'text-primary' ? 'bg-primary/10' :
                        'bg-accent/10'
                      }`}>
                        <step.icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{step.description}</p>
                  </Card>
                </div>
                
                {/* Center Circle */}
                <div className="relative z-10">
                  <div className={`w-6 h-6 rounded-full border-4 border-surface ${
                    step.color === 'text-secondary' ? 'bg-secondary' :
                    step.color === 'text-primary' ? 'bg-primary' :
                    'bg-accent'
                  }`}></div>
                </div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Why This Works */}
        <div className="bg-gradient-to-br from-primary-light to-primary/5 rounded-2xl p-8 border border-primary/20">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            Why This System Works
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">5+</span>
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Years Refined</h4>
              <p className="text-text-secondary text-sm">Continuously improved through real student feedback</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Habit First</h4>
              <p className="text-text-secondary text-sm">Consistency beats intensity - build sustainable practices</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h4 className="font-semibold text-text-primary mb-2">Independence</h4>
              <p className="text-text-secondary text-sm">Goal is your self-sufficiency, not dependency</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}