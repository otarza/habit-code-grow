import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, Dumbbell, Mountain, TrendingUp, Award, Target } from "lucide-react";
import { PixelBackground } from "@/components/PixelBackground";

export function ChallengeTransformation() {
  const transformationStages = [
    {
      day: "Day 1-7",
      phase: "Foundation Building",
      icon: Calendar,
      color: "text-secondary",
      bgColor: "from-secondary/20 to-secondary/10",
      borderColor: "border-secondary/30",
      description: "Getting started and building the daily habit",
      skills: ["Basic syntax understanding", "Setting up development environment", "First simple programs"],
      mindset: "Excited but overwhelmed",
      confidence: 20,
      timeInvested: "3-5 hours",
      challenges: ["Information overload", "Setup frustrations", "Imposter syndrome"],
      progress: 20
    },
    {
      day: "Day 8-21",
      phase: "Habit Formation",
      icon: Target,
      color: "text-secondary",
      bgColor: "from-secondary/20 to-secondary/10",
      borderColor: "border-secondary/30",
      description: "Solidifying daily practice and core concepts",
      skills: ["Control flow mastery", "Function creation", "Problem-solving patterns"],
      mindset: "Building momentum",
      confidence: 45,
      timeInvested: "20-30 hours",
      challenges: ["Maintaining consistency", "Complex problem solving", "Debugging skills"],
      progress: 45
    },
    {
      day: "Day 22-30",
      phase: "Skill Development",
      icon: Dumbbell,
      color: "text-primary",
      bgColor: "from-primary/20 to-primary/10",
      borderColor: "border-primary/30",
      description: "Advanced concepts and real-world applications",
      skills: ["Data structures", "Object-oriented programming", "API integration"],
      mindset: "Confident and curious",
      confidence: 70,
      timeInvested: "40-50 hours",
      challenges: ["Complex algorithms", "Code organization", "Performance optimization"],
      progress: 70
    },
    {
      day: "Day 31-100",
      phase: "Mastery & Identity",
      icon: Mountain,
      color: "text-accent",
      bgColor: "from-accent/20 to-accent/10",
      borderColor: "border-accent/30",
      description: "Building projects and developing programmer identity",
      skills: ["Full-stack applications", "Version control", "Testing and deployment"],
      mindset: "I am a programmer",
      confidence: 90,
      timeInvested: "120+ hours",
      challenges: ["Architecture decisions", "Code quality", "Continuous learning"],
      progress: 90
    }
  ];

  return (
    <section className="relative py-20 bg-background pixel-bg">
      <PixelBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Your Transformation Journey
          </h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
            Watch yourself evolve from complete beginner to confident programmer through our structured challenges. 
            Each stage builds upon the previous, creating lasting habits and real skills.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-secondary via-primary to-accent rounded-full opacity-30"></div>
          
          <div className="space-y-16">
            {transformationStages.map((stage, index) => {
              const Icon = stage.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={stage.day} className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Content Card */}
                  <div className={`w-5/12 ${isEven ? 'pr-8' : 'pl-8'}`}>
                    <Card className={`p-6 bg-gradient-to-br ${stage.bgColor} border ${stage.borderColor} shadow-soft card-hover`}>
                      <div className={`flex items-start gap-4 ${isEven ? '' : 'flex-row-reverse text-right'}`}>
                        <div className={`w-12 h-12 bg-gradient-to-br ${stage.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${stage.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-text-secondary">{stage.day}</span>
                            <div className="flex-1 h-px bg-border"></div>
                          </div>
                          <h3 className="text-xl font-bold text-text-primary mb-2">{stage.phase}</h3>
                          <p className="text-text-secondary mb-4">{stage.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-text-secondary">Confidence Level</span>
                              <span className={`font-semibold ${stage.color}`}>{stage.confidence}%</span>
                            </div>
                            <Progress value={stage.confidence} className="h-2" />
                          </div>
                          
                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-text-muted">Time Invested:</span>
                              <p className="font-semibold text-text-primary">{stage.timeInvested}</p>
                            </div>
                            <div>
                              <span className="text-text-muted">Mindset:</span>
                              <p className="font-semibold text-text-primary">{stage.mindset}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  {/* Center Timeline Node */}
                  <div className="w-2/12 flex justify-center">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${stage.bgColor} border-2 ${stage.borderColor} shadow-medium z-10`}>
                      <div className={`w-full h-full rounded-full bg-gradient-to-r ${stage.bgColor}`}></div>
                    </div>
                  </div>
                  
                  {/* Skills & Challenges */}
                  <div className={`w-5/12 ${isEven ? 'pl-8' : 'pr-8'}`}>
                    <div className="space-y-4">
                      <div className={`${isEven ? 'text-left' : 'text-right'}`}>
                        <h4 className="font-semibold text-text-primary mb-2">Key Skills Developed</h4>
                        <ul className="space-y-1">
                          {stage.skills.map((skill, skillIndex) => (
                            <li key={skillIndex} className="text-sm text-text-secondary flex items-center gap-2">
                              {isEven ? (
                                <>
                                  <div className={`w-1.5 h-1.5 rounded-full ${stage.color.replace('text-', 'bg-')}`}></div>
                                  {skill}
                                </>
                              ) : (
                                <>
                                  {skill}
                                  <div className={`w-1.5 h-1.5 rounded-full ${stage.color.replace('text-', 'bg-')}`}></div>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className={`${isEven ? 'text-left' : 'text-right'}`}>
                        <h4 className="font-semibold text-text-primary mb-2">Common Challenges</h4>
                        <ul className="space-y-1">
                          {stage.challenges.map((challenge, challengeIndex) => (
                            <li key={challengeIndex} className="text-sm text-text-muted flex items-center gap-2">
                              {isEven ? (
                                <>
                                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted"></div>
                                  {challenge}
                                </>
                              ) : (
                                <>
                                  {challenge}
                                  <div className="w-1.5 h-1.5 rounded-full bg-text-muted"></div>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="text-center mt-16">
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 max-w-2xl mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl mx-auto mb-6">
              <Award className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-text-primary mb-4">Ready to Start Your Transformation?</h3>
            <p className="text-text-secondary mb-6">
              Join hundreds of students who have successfully built sustainable programming habits and launched their tech careers.
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <span className="text-sm text-text-secondary">94% completion rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="text-sm text-text-secondary">500+ graduates</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}