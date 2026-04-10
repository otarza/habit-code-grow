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
  const manychatUrl = "https://m.me/bitcamp.ge?ref=AI";

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
                    <div className="text-4xl font-bold text-text-primary">₾149</div>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200 text-lg px-4 py-2">
                    -81%
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
                href="https://wa.me/995557151290?text=AI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg shadow-lg mt-4"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>რეგისტრაცია WhatsApp-ით</span>
              </a>

              <a
                href="https://ig.me/m/bitcamp.ge?ref=ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full text-white font-bold py-4 px-6 rounded-xl transition-opacity hover:opacity-90 text-lg shadow-lg mt-4"
                style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>რეგისტრაცია Instagram-ით</span>
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
