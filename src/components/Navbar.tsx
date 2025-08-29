import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import bitcampLogo from "@/assets/bitcamp-logo.png";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "როგორ მუშაობს", href: "#how-it-works" },
    { name: "ჩელენჯების პროგრამა", href: "#21-day" },
    { name: "ფასები", href: "#pricing" },
    { name: "წარმატება", href: "#success" },
    { name: "კითხვები", href: "#faq" },
  ];

  return (
    <nav className="bg-surface/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img 
              className="h-8 w-auto" 
              src={bitcampLogo} 
              alt="Bitcamp" 
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="https://www.bitcamp.ge/dashboard/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                შესვლა
              </Button>
            </a>
            <a href="#pricing">
              <Button variant="hero" size="sm">
                დაიწყე 21 დღიანი ჩელენჯით
              </Button>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-text-primary p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-text-secondary hover:text-text-primary block px-3 py-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <a 
                  href="https://www.bitcamp.ge/dashboard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    შესვლა
                  </Button>
                </a>
                <a href="#pricing" onClick={() => setIsOpen(false)}>
                  <Button variant="hero" size="sm" className="w-full">
                    დაიწყე 21 დღიანი ჩელენჯით
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}