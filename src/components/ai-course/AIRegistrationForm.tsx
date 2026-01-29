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
  const manychatUrl = "https://m.me/bitcamp.ge?ref=%E1%83%A0%E1%83%94%E1%83%92%E1%83%98%E1%83%A1%E1%83%A2%E1%83%A0%E1%83%90%E1%83%AA%E1%83%98%E1%83%90%20AI%20%E1%83%99%E1%83%A3%E1%83%A0%E1%83%A1%E1%83%96%E1%83%94";

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
                დააჭირე სასურველ ღილაკს და დაიწყე რეგისტრაცია.
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
                <span>რეგისტრაცია Messenger-ში</span>
              </a>

              <a
                href="https://wa.me/995557151290?text=%E1%83%A0%E1%83%94%E1%83%92%E1%83%98%E1%83%A1%E1%83%A2%E1%83%A0%E1%83%90%E1%83%AA%E1%83%98%E1%83%90%20AI%20%E1%83%99%E1%83%A3%E1%83%A0%E1%83%A1%E1%83%96%E1%83%94"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-lg mt-4"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>რეგისტრაცია WhatsApp-ით</span>
              </a>

              {/* QR Code */}
              <div className="mt-8 flex flex-col items-center">
                <p className="text-sm text-text-secondary mb-3">
                  ან დაასკანერე QR კოდი:
                </p>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-border/50">
                  <img
                    src="/whatsapp-qr.svg"
                    alt="WhatsApp QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>

              <p className="text-center text-sm text-text-secondary mt-6">
                რეგისტრაცია მარტივია და ჩვენი ოპერატორები დაგეხმარებიან ყველა ნაბიჯზე ❤️
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
