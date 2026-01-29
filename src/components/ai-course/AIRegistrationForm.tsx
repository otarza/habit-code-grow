import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Shield,
  Zap,
  MessageSquare,
  Brain,
  Briefcase,
  Image,
  Bot,
  Workflow
} from "lucide-react";

export function AIRegistrationForm() {
  // ManyChat registration URL - temporary until n8n+Tally is set up
  const manychatUrl = "https://m.me/bitcamp.ge?ref=w49691316";

  const trustIndicators = [
    { icon: CheckCircle2, text: "მყისიერი წვდომა გადახდის შემდეგ" },
    { icon: Shield, text: "უსაფრთხო გადახდა" },
    { icon: Zap, text: "400+ სტუდენტი უკვე სწავლობს" },
  ];

  return (
    <section id="register" className="py-20 bg-gradient-to-b from-muted/30 to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm font-semibold">
            რეგისტრაცია
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            დაიწყე შენი{" "}
            <span className="text-secondary">AI მოგზაურობა</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            შეავსე ფორმა და მიიღე გადახდის ინსტრუქცია ელფოსტაზე
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Left: What You Get - Shows first on mobile */}
          <div className="order-1 lg:order-1">
            <div className="bg-card border-2 border-primary/10 rounded-2xl p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-6">
                რას მიიღებ:
              </h3>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-text-primary">მოდული 1:</strong>
                    <span className="text-text-secondary"> T.C.R.E.I. პრომპტინგის ჩარჩო</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-text-primary">მოდული 2:</strong>
                    <span className="text-text-secondary"> Chain of Thought & Advanced Prompting</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-text-primary">მოდული 3:</strong>
                    <span className="text-text-secondary"> ბიზნეს Use Cases</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <Image className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-text-primary">მოდული 4:</strong>
                    <span className="text-text-secondary"> DALL-E, Vision, მონაცემთა ანალიზი</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-text-primary">მოდული 5:</strong>
                    <span className="text-text-secondary"> Custom GPTs & Gems</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                    <Workflow className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <strong className="text-text-primary">მოდული 6:</strong>
                    <span className="text-text-secondary"> n8n ავტომატიზაცია & AI აგენტები</span>
                  </div>
                </li>
              </ul>

              {/* Price */}
              <div className="bg-gradient-to-r from-accent/10 to-green-500/10 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-text-secondary line-through text-lg">₾790</span>
                    <div className="text-4xl font-bold text-text-primary">₾99</div>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200 text-lg px-4 py-2">
                    -87%
                  </Badge>
                </div>
                <p className="text-accent font-medium mt-2">
                  სამუდამო წვდომა + ყველა განახლება
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3">
                {trustIndicators.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 text-text-secondary">
                      <Icon className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Registration CTA - Shows second on mobile */}
          <div className="order-2 lg:order-2">
            <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-text-primary mb-4 text-center">
                მზად ხარ დასაწყებად?
              </h3>

              <p className="text-text-secondary text-center mb-8">
                დააჭირე ღილაკს და დაიწყე რეგისტრაცია Messenger-ში. მიიღებ დეტალურ ინფორმაციას და გადახდის ინსტრუქციას.
              </p>

              {/* ManyChat CTA */}
              <a
                href={manychatUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#0099FF] hover:bg-[#0088ee] text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.936 1.444 5.544 3.7 7.254v3.503l3.258-1.822c.898.248 1.85.382 2.842.382h.2c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm1.016 12.441l-2.545-2.718-4.97 2.718 5.467-5.803 2.608 2.718 4.907-2.718-5.467 5.803z" />
                </svg>
                <span>გაგრძელება Messenger-ში</span>
              </a>

              <p className="text-center text-sm text-text-secondary mt-6">
                რეგისტრაცია მარტივია და რამდენიმე წუთს საჭიროებს
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
