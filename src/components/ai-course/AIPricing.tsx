import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  BookOpen,
  MessageSquare,
  Bot,
  Workflow
} from "lucide-react";
import { tracking } from "@/utils/tracking";

export function AIPricing() {
  const features = [
    { icon: BookOpen, text: "6 სრული მოდული (30+ თემა)" },
    { icon: MessageSquare, text: "T.C.R.E.I. პრომპტინგის ჩარჩო" },
    { icon: Bot, text: "Custom GPT-ების შექმნა" },
    { icon: Workflow, text: "n8n ავტომატიზაციის კურსი" },
    { icon: Zap, text: "RAG და AI აგენტების აწყობა" },
    { icon: Users, text: "Discord საზოგადოების წვდომა" }
  ];

  const bonuses = [
    "პრომპტების ბიბლიოთეკა (50+ მზა პრომპტი)",
    "n8n workflow შაბლონები",
    "ქართული ენის ოპტიმიზაციის გაიდი",
    "ფინალური პროექტის feedback"
  ];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-surface to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-premium/20 text-premium border-premium/30 px-4 py-2 text-sm font-semibold">
            შეუერთდი პროგრამას
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            საუკეთესო ინვესტიცია{" "}
            <span className="text-secondary">შენს მომავალში</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            ერთჯერადი გადახდა — სამუდამო წვდომა, განახლებები და მხარდაჭერა.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="relative overflow-hidden border-2 border-premium/50 shadow-xl">
            {/* Popular Badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-premium text-white text-sm font-bold px-4 py-2 rounded-bl-xl">
                პოპულარული არჩევანი
              </div>
            </div>

            <div className="p-8 sm:p-10">
              {/* Title */}
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                  AI პრომპტ-ინჟინერია & ავტომატიზაცია
                </h3>
                <p className="text-text-secondary">
                  სრული გზამკვლევი დამწყებიდან პროფესიონალამდე
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl text-text-secondary line-through">₾790</span>
                  <Badge className="bg-red-100 text-red-700 border-red-200">დაზოგე 87%</Badge>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl sm:text-6xl font-bold text-text-primary">₾99</span>
                  <span className="text-text-secondary text-lg">სულ</span>
                </div>
                <p className="text-accent font-medium mt-2">
                  ფასი მალე გაიზრდება
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h4 className="font-semibold text-text-primary mb-4">რას მიიღებ კურსში:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-text-secondary">6 სრული მოდული (30+ პრაქტიკული გაკვეთილი)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-text-secondary">უნიკალური T.C.R.E.I. პრომპტინგის სისტემა</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-text-secondary">შენი პირადი AI აგენტების (Custom GPTs) შექმნა</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Workflow className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-text-secondary">n8n ავტომატიზაციის მასტერკლასი</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-text-secondary">RAG სისტემების აწყობა (Chat with Data)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-text-secondary">დახურული Discord ქომიუნითი & მხარდაჭერა</span>
                  </li>
                </ul>
              </div>

              {/* Bonuses */}
              <div className="mb-8 p-4 bg-premium/10 rounded-lg border border-premium/20">
                <h4 className="font-semibold text-premium mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  უფასო ბონუსები:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-text-secondary text-sm">
                    <CheckCircle2 className="w-4 h-4 text-premium flex-shrink-0" />
                    <span>50+ მზა პრომპტის ბიბლიოთეკა (Copy-Paste)</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary text-sm">
                    <CheckCircle2 className="w-4 h-4 text-premium flex-shrink-0" />
                    <span>n8n workflow შაბლონები</span>
                  </li>
                  <li className="flex items-center gap-2 text-text-secondary text-sm">
                    <CheckCircle2 className="w-4 h-4 text-premium flex-shrink-0" />
                    <span>სერთიფიკატი კურსის დასრულების შემდეგ</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                variant="hero"
                size="lg"
                className="w-full pixel-btn text-lg py-6"
                onClick={() => {
                  tracking.buttonClick('ჩაეწერე ახლავე - Pricing', 'ai-pricing-cta');
                  const registerElement = document.getElementById('register');
                  if (registerElement) {
                    registerElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <Sparkles className="w-5 h-5" />
                <span>დიახ, მინდა კურსზე ჩაწერა</span>
                <ArrowRight className="w-5 h-5" />
              </Button>

              {/* Trust Elements */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>უსაფრთხო გადახდა</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>სამუდამო წვდომა</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Money Back Note */}
        <div className="mt-12 text-center">
          <p className="text-text-secondary max-w-2xl mx-auto">
            კითხვები გაქვს? დაგვიკავშირდი{" "}
            <a
              href="https://discord.gg/AGAW3xmGPr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-medium"
            >
              Discord-ზე
            </a>
            {" "}ან მოგვწერე{" "}
            <a
              href="mailto:hello@bitcamp.ge"
              className="text-secondary hover:underline font-medium"
            >
              hello@bitcamp.ge
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
