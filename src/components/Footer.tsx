import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { ArrowRight, Mail, MessageSquare, Calendar } from "lucide-react";
import bitcampLogo from "@/assets/bitcamp-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isAIPage = location.pathname === '/ai';

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Final CTA Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              დღეს იწყება შენი თავგადასავალი ტექნოლოგიების სამყაროში
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              დააღწიე თავი მუდმივად გადადებული საქმისა და განუხორციელებელი გეგმების ციკლს. დაიწყე ნამდვილი ჩვევებისა და უნარების ათვისება - ისინი ხომ მთელი ცხოვრება გაგყვება.
            </p>
            <div className="flex justify-center w-full px-4">
              <a href="#pricing" className="w-full max-w-lg">
                <Button variant="hero" className="group w-full text-center px-3 sm:px-10 h-12 sm:h-16 text-sm sm:text-xl font-bold whitespace-nowrap">
                  {isAIPage ? "გახდი AI არქიტექტორი" : "დაიწყე 21 დღიანი ჩელენჯი"}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                className="h-8 w-auto invert"
                src={(bitcampLogo as any).src || bitcampLogo}
                alt="Bitcamp"
              />
              <span className="ml-3 text-xl font-bold">
                სწავლა და ბრძოლა
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              ვქმინთ უალტერნატივო ჩვევებს ტექნოლოგიების სამყაროში გზის გასაკვალად. ვქმნით დამოუკიდებელ და შეუპოვარ პროფესიონალებს.2018 წლიდან ვმუშაობთ ათასობით სტუდენტთან და საფუძველი ჩავუყარეთ თითოეული მათგანის ცხოვრებისა და კარიერის შეუჩერებელ ტრანსფორმაციას.
            </p>
            {/* <div className="flex gap-4">
              <Button variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <MessageSquare className="w-4 h-4" />
                Discord სერვერი
              </Button>
              <Button variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Calendar className="w-4 h-4" />
                ლაივ სესიები
              </Button>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">ჩელენჯები</h3>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><a href="#21-day" className="hover:text-primary-foreground transition-colors">21 დღიანი ჩელენჯი</a></li>
              <li><a href="#21-day" className="hover:text-primary-foreground transition-colors">30 დღიანი ჩელენჯი</a></li>
              <li><a href="#21-day" className="hover:text-primary-foreground transition-colors">100 დღიანი ჩელენჯი</a></li>
              <li><a href="#how-it-works" className="hover:text-primary-foreground transition-colors">როგორ მუშაობს?</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">ბმულები</h3>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><a href="https://www.youtube.com/@bitcampge" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">YouTube</a></li>
              <li><a href="https://www.facebook.com/bitcamp.ge" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">Facebook</a></li>
              <li><a href="https://www.linkedin.com/in/otarza/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Bitcamp - სწავლა და ბრძოლა. ყველა საავტორო უფლების თავზეც გავიარეთ.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Mail className="w-4 h-4 text-primary-foreground/60" />
            <span className="text-primary-foreground/60 text-sm">hello@bitcamp.ge</span>
          </div>
        </div>
      </div>

      {/* Trust Signal */}
      <div className="bg-primary-hover text-center py-4">
        <p className="text-primary-foreground/80 text-sm">
          🔒 <strong>ტრანსფორმაციის 100% - იანი გარანტია</strong> • დაასრულე ჩელენჯები და გახდი საკუთარი თავის საუკეთესო ვერსია.
        </p>
      </div>

      {/* Legal block */}
      <div className="bg-primary border-t border-primary-foreground/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Payment logos */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {["visa", "mastercard", "apple-pay", "google-pay"].map((name) => (
              <img
                key={name}
                src={`/assets/payment/${name}.svg`}
                alt={name}
                className="h-6 opacity-50"
                style={{ filter: "grayscale(1) brightness(2)" }}
              />
            ))}
          </div>
          {/* Legal text */}
          <p className="text-primary-foreground/40 text-xs leading-relaxed mb-2">
            ო. ზაკალაშვილი (ი/მ) · ს/კ: 01001071740 · მირიან მეფის ქუჩა, 11გ, ბინა #39 · ტელ: +995 557 15 12 90 · hello@bitcamp.ge
          </p>
          <div className="flex gap-4 text-xs">
            <a href="/terms" className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
              მომსახურების პირობები
            </a>
            <span className="text-primary-foreground/20">·</span>
            <a href="/privacy" className="text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors">
              კონფიდენციალურობა
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
