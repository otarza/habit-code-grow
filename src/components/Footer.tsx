import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MessageSquare, Calendar } from "lucide-react";
import bitcampLogo from "@/assets/bitcamp-logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Final CTA Section */}
      <div className="border-b border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Future Coder Identity Starts Today
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Stop quitting courses. Start building coding habits for life.
            </p>
            <Button variant="hero" size="xl" className="group">
              Join the 21-Day Challenge
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
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
                src={bitcampLogo} 
                alt="Bitcamp" 
              />
              <span className="ml-3 text-xl font-bold">
                Programming Mentorship
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Building unstoppable coding habits through evidence-based mentorship. 
              Mentor since 2019 • 5+ years refining this system.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <MessageSquare className="w-4 h-4" />
                Discord
              </Button>
              <Button variant="outline" size="sm" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Calendar className="w-4 h-4" />
                Live Sessions
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Challenges</h3>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><a href="#21-day" className="hover:text-primary-foreground transition-colors">21-Day Challenge</a></li>
              <li><a href="#pricing" className="hover:text-primary-foreground transition-colors">30-Day Challenge</a></li>
              <li><a href="#pricing" className="hover:text-primary-foreground transition-colors">100-Day Challenge</a></li>
              <li><a href="#how-it-works" className="hover:text-primary-foreground transition-colors">How It Works</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-primary-foreground/80">
              <li><a href="#success" className="hover:text-primary-foreground transition-colors">Success Stories</a></li>
              <li><a href="#about" className="hover:text-primary-foreground transition-colors">About Mentor</a></li>
              <li><a href="/terms" className="hover:text-primary-foreground transition-colors">Terms</a></li>
              <li><a href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Bitcamp Programming Mentorship. All rights reserved.
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
          🔒 <strong>100% Money-Back Guarantee</strong> • Complete the challenge and don't feel progress? Full refund.
        </p>
      </div>
    </footer>
  );
}