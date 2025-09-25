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
              <h2 className="text-3xl font-bold text-text-primary">რა გაფერხებს?</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                ყოველდღიურად მუშაობა გიჭირს და მარტო ხარ სწავლაში. შენ არც ზარმაცი ხარ და არც ინტელექტი გაკლია:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">არ გაქვს დისციპლინა</h4>
                    <p className="text-text-secondary">კარგავ მოტივაციას პირველივე სირთულესთან შეჯახებისას</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">მარტო ხარ</h4>
                    <p className="text-text-secondary">არავისთან ხარ პასუხიმგებელი და არავინ გაძალიერებს ყოველდღე</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">არავინ გეხმარება ჩვევების ჩამოყალიბებაში</h4>
                    <p className="text-text-secondary">არ გყავს ადამიანი ვინც გვერდში დაგიდება რთული მომენტების გადალახვისას</p>
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
              <h2 className="text-3xl font-bold text-text-primary">ჩვენ ვიქნებით შენი მეგზური</h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-lg text-text-secondary leading-relaxed">
                <strong>5 წელია ვეხმარებით ადამიანებს ამ პრობლემის გადაჭრაში.</strong> 5000+ ქართველს დავეხმარეთ დეველოპერად ქცევაში, კარიერის ცვლილებასა თუ პიროვნულ ტრანსფორმაციაში.
              </p>
              
              <div className="space-y-4">
                <Card className="p-6 bg-gradient-to-br from-secondary-light to-secondary/5 border-secondary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary-foreground font-bold text-sm">21</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">შექმენი ფუნდამენტი</h4>
                      <p className="text-text-secondary">21 დღის განმაბლობაში, ყოველდღიური, 30-60 წუთიანი სასწავლო სესიებით ჩამოგიყალიბდება ჩვევა - ის რაც ასე ძალიან გჭირდება წარმატებისთვის</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-primary-light to-primary/5 border-primary/20">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold text-sm">30</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">ჩაუჯექი</h4>
                      <p className="text-text-secondary">30 დღიან ჩელენჯში უკვე გამომუშავებული ჩვევის გამყარება ხდება ისე რომ კოდის წერა და AI - იარაღების გამოყენება ბუნებრივი პროცესია შენთვის</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-6 bg-gradient-to-br from-accent-light to-accent/5 border-accent/20">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-foreground font-bold text-sm">100</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">ჩააჭირე</h4>
                      <p className="text-text-secondary">100 დღიან ჩელენჯში შენი სამყარო იცვლება და ახალი უნარები შენი ყოველდღიურობის განუყოფელი ნაწილი ხდება</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-secondary/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary" />
                <p className="font-semibold text-text-primary">
                  მიზანი: გახდე დამოუკიდებელი თანამედროვე ტექნოლოგიების ათვისებაში
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}