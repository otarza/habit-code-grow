import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ABTestProvider } from "@/components/ABTestTracker";
import { RetargetingProvider } from "@/components/RetargetingPixels";
import { ScarcityProvider } from "@/components/ScarcityManager";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Award, Video, Users, Wrench, Flame, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

const PythonSQL = () => {
  const retargetingConfig = {
    facebookPixelId: undefined,
    googleAdsId: undefined,
    tiktokPixelId: undefined,
    customPixelEndpoints: []
  };

  useEffect(() => {
    // Load Tally embed script
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Python + SQL მასტერკლასი | 4-თვიანი ინტენსიური კურსი | BitCamp"
        description="ნულიდან დაეუფლე Python-ს და SQL მონაცემთა ბაზებს. 2 Harvard CS50 სერტიფიკატი, მენტორის მხარდაჭერა და რეალური პროექტები. მხოლოდ 199₾/თვეში."
        image="https://www.bitcamp.ge/python-sql-meta.png"
        url="https://www.bitcamp.ge/python-sql"
      />
      <RetargetingProvider config={retargetingConfig}>
        <ABTestProvider>
          <ScarcityProvider>
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary/5 via-surface to-secondary/5 pt-20 pb-16 sm:pt-28 sm:pb-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Flame className="w-4 h-4" />
                    4-თვიანი ინტენსიური მასტერკლასი
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6 leading-tight">
                    გახდი მოთხოვნადი სპეციალისტი{" "}
                    <span className="text-primary">ტექნოლოგიურ სფეროში</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
                    გინდა ისწავლო პროგრამირება, მაგრამ არ იცი საიდან დაიწყო? ეს 4-თვიანი ინტენსიური მასტერკლასი ზუსტად შენთვისაა. ნულიდან, რეალურ პროექტებზე მუშაობით დაეუფლები <strong>Python</strong>-ს და <strong>SQL</strong> მონაცემთა ბაზებს.
                  </p>
                  <Button
                    variant="hero"
                    size="xl"
                    className="group"
                    onClick={() => {
                      document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    დაიწყე დღესვე
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-16 sm:py-24 bg-surface">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-text-primary mb-12">
                  რას მიიღებ ამ კურსში?
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {[
                    {
                      icon: BookOpen,
                      title: "2 სრული კურსი ერთში",
                      description: "Python + SQL — ორივე ყველაზე მოთხოვნადი ტექნოლოგია ერთ პაკეტში.",
                    },
                    {
                      icon: Award,
                      title: "2 საერთაშორისო სერტიფიკატი",
                      description: "Harvard CS50 სერტიფიკატები, რომლებიც მთელ მსოფლიოში აღიარებულია.",
                    },
                    {
                      icon: Video,
                      title: "ონლაინ ლექციები + ჩანაწერები",
                      description: "ინტერაქტიული ონლაინ ლექციები და მათი ჩანაწერები — უყურე როცა გინდა.",
                    },
                    {
                      icon: Users,
                      title: "მენტორის მხარდაჭერა",
                      description: "არცერთი შენი კითხვა არ დარჩება პასუხგაუცემელი — მუდმივი მხარდაჭერა.",
                    },
                    {
                      icon: Wrench,
                      title: "პრაქტიკული გამოცდილება",
                      description: "საკუთარი ხელით კეთება და რეალური პროექტები შენი პორტფოლიოსთვის.",
                    },
                    {
                      icon: Flame,
                      title: "ფასდაუდებელი ინვესტიცია",
                      description: "4000₾+ ღირებულების სასწავლო პროცესი — ახლა მხოლოდ 199₾ / თვეში.",
                    },
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-6 sm:p-8 shadow-soft border border-border hover:shadow-medium transition-shadow"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">{benefit.title}</h3>
                      <p className="text-text-secondary">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pricing Highlight */}
            <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-surface to-secondary/5">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-strong border border-primary/20">
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Flame className="w-4 h-4" />
                    შეზღუდული ადგილები
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                    <span className="line-through text-text-muted">4000₾+</span> ღირებულება
                  </h2>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl sm:text-6xl font-bold text-primary">199₾</span>
                    <span className="text-xl text-text-secondary">/ თვეში</span>
                  </div>
                  <p className="text-text-secondary mb-6 max-w-lg mx-auto">
                    სასწავლო პროცესი, ონლაინ შეხვედრები, ქართული ვიდეო მასალები, მენტორის მომსახურება, ჯგუფური აქტივობები და უამრავი სხვა სარგებელი — ყველაფერი ერთ ფასში.
                  </p>

                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>ყურადღება:</strong> ადგილები ძალიან შეზღუდულია, რადგან სასწავლო პროცესში თითოეულ სტუდენტთან ინდივიდუალურ დროსა და ენერგიას ვხარჯავთ.
                    </p>
                  </div>

                  <Button
                    variant="hero"
                    size="xl"
                    className="group w-full sm:w-auto"
                    onClick={() => {
                      document.getElementById("registration")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    დარეგისტრირდი ახლავე
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Registration Form - Tally Embed */}
            <section id="registration" className="py-16 sm:py-24 bg-surface">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                    დარეგისტრირდი ახლავე
                  </h2>
                  <p className="text-text-secondary text-lg">
                    შეავსე ფორმა და პირადად დაგიკავშირდებით დეტალების სათქმელად.
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-medium border border-border overflow-hidden">
                  <iframe
                    data-tally-src="https://tally.so/embed/0QxaVy?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                    loading="lazy"
                    width="100%"
                    height="400"
                    frameBorder={0}
                    marginHeight={0}
                    marginWidth={0}
                    title="რეგისტრაცია"
                    className="w-full"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
            </section>

            <Footer />
          </ScarcityProvider>
        </ABTestProvider>
      </RetargetingProvider>
    </div>
  );
};

export default PythonSQL;
