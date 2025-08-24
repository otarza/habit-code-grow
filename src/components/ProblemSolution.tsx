import { Card } from "@/components/ui/card";
import { AlertTriangle, Target, TrendingUp } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Problem Side */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-3xl font-bold text-text-primary">The Real Problem</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                Most learners quit around week two. The issue isn't with the courses, tutorials, or your intelligence.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Missing Daily Structure</h4>
                    <p className="text-text-secondary">No system for consistent practice and growth</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Overwhelm & Isolation</h4>
                    <p className="text-text-secondary">Learning alone without guidance or accountability</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">No Habit Foundation</h4>
                    <p className="text-text-secondary">Motivation fades without sustainable daily practices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Solution Side */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-3xl font-bold text-text-primary">Our Solution</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                A 3-stage mentorship system that installs daily coding through structured challenges, live guidance, and community accountability.
              </p>
              
              <div className="space-y-4">
                <Card className="p-6 bg-gradient-to-br from-secondary-light to-secondary/5 border-secondary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary-foreground font-bold text-sm">21</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Build the Foundation</h4>
                      <p className="text-text-secondary">Daily 30-60 minute sessions with simple tracking and accountability</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-primary-light to-primary/5 border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">30</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Lock It In</h4>
                      <p className="text-text-secondary">Stabilize your habit and make consistency feel natural</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-accent-light to-accent/5 border-accent/20">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-foreground font-bold text-sm">100</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Make It Your Identity</h4>
                      <p className="text-text-secondary">Integrate coding into everyday life permanently</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary" />
                <p className="font-semibold text-text-primary">
                  Goal: You become independent — no mentor dependency
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}