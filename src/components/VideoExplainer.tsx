import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export function VideoExplainer() {

  return (
    <section className="py-20 bg-gradient-to-b from-surface to-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">3 წუთი რომელიც შეცვლის შენს კარიერას</span>
          </div>
          
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            ჩელენჯები უფრო ეფექტურია ვიდრე კურსები
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            მოისმინე პირადად ჩემგან, როგორ მუშაობს ჩვენი სისტემა და რატომ არის ეს ერთადერთი გზა რეალური ტრანსფორმაციისთვის
          </p>
        </div>

        <Card className="relative overflow-hidden shadow-2xl border-secondary/20 bg-surface">
          <div className="relative aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/LPgRR9TwGIA"
              title="BitCamp Challenges Program"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
            <div className="text-3xl font-bold text-secondary mb-2">97%</div>
            <p className="text-text-secondary">ამთავრებს პირველ ჩელენჯს</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <div className="text-3xl font-bold text-primary mb-2">21-100</div>
            <p className="text-text-secondary">დღე ტრანსფორმაციისთვის</p>
          </Card>
          
          <Card className="p-6 text-center bg-gradient-to-br from-accent/5 to-transparent border-accent/20">
            <div className="text-3xl font-bold text-accent mb-2">ყოველდღიური</div>
            <p className="text-text-secondary">მენტორის მხარდაჭერა</p>
          </Card>
        </div>

        <div className="mt-10 text-center px-4">
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary/90 text-base sm:text-lg px-4 sm:px-8 py-4 sm:py-6 shadow-xl w-full sm:w-auto max-w-md"
            onClick={() => {
              console.log('VideoExplainer button clicked!'); // Debug log
              const targetElement = document.getElementById('pricing');
              
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
              } else {
                console.log('Pricing element not found in VideoExplainer');
              }
            }}
          >
            დაიწყე შენი ტრანსფორმაცია ახლავე
          </Button>
          <p className="mt-4 text-sm text-text-secondary">
            ⚡ ადგილები შეზღუდულია • სექტემბრის ნაკადზე მიღება მალე დასრულდება
          </p>
        </div>
      </div>
    </section>
  );
}