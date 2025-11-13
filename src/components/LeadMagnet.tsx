import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Download, Play, Users, Gift, Sparkles } from "lucide-react";
import { PixelBackground } from "@/components/PixelBackground";
import { ProgressiveForm } from "@/components/ProgressiveForm";

export function LeadMagnet() {
  const [showProgressiveForm, setShowProgressiveForm] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFormComplete = (data: any) => {
    console.log('Lead captured:', data);
    setIsCompleted(true);
    // Here you would send data to your backend/CRM
  };

  const bonuses = [
    {
      icon: Play,
      title: "5 დღიანი მინი-ჩელენჯი",
      description: "ვიდეო-სერია პროგრამირების ფუნდამენტებზე",
      value: "150₾ ღირებულება"
    },
    {
      icon: Download,
      title: "კოდირების ჩვევების გაიდი",
      description: "40 გვერდიანი PDF წიგნი წარმატებული ჩვევების შესახებ",
      value: "80₾ ღირებულება"
    },
    {
      icon: Users,
      title: "Discord კომუნიტი",
      description: "დაუყოვნებლივი წვდომა 50K+ დეველოპერის ჯგუფში",
      value: "უფასო"
    }
  ];

  return (
    <section className="relative py-16 bg-gradient-to-br from-yellow-50 via-yellow-100 to-orange-100 overflow-hidden">
      <PixelBackground />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with urgency */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            <Gift className="w-4 h-4" />
            მხოლოდ დღეს - სპეციალური შეთავაზება!
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            მიიღე <span className="text-yellow-600">სრულიად უფასოდ</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            230₾ ღირებულების პაკეტი - დაიწყე შენი პროგრამირების მოგზაურობა ყოველგვარი რისკის გარეშე
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Benefits */}
          <div>
            <div className="space-y-6">
              {bonuses.map((bonus, index) => {
                const Icon = bonus.icon;
                return (
                  <Card key={index} className="p-6 border-2 border-yellow-200 shadow-lg card-hover">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">{bonus.title}</h3>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                            {bonus.value}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{bonus.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Social Proof */}
            <div className="mt-8 p-4 bg-white/80 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="font-semibold">1,247 ადამიანმა ჩამოტვირთა ამ კვირაში</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - CTA Form */}
          <div>
            {isCompleted ? (
              <Card className="p-8 border-4 border-green-400 shadow-2xl bg-gradient-to-br from-green-50 to-green-100 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  🎉 გილოცავთ!
                </h3>
                <p className="text-green-700 mb-6">
                  თქვენი 230₾ ღირებულების პაკეტი გაიგზავნა ელ. ფოსტაზე! 
                  შეამოწმეთ inbox და spam ფოლდერიც.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  📧 ელ. ფოსტის შემოწმება
                </Button>
              </Card>
            ) : showProgressiveForm ? (
              <ProgressiveForm onComplete={handleFormComplete} />
            ) : (
              <Card className="p-8 border-4 border-yellow-400 shadow-2xl bg-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-400 rounded-full translate-y-8 -translate-x-8 opacity-20"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ჩამოტვირთე ახლავე!
                    </h3>
                    <p className="text-gray-600">
                      მხოლოდ ორი ბიჯი თქვენს წარმატებასთან
                    </p>
                  </div>

                  {/* Quick Start Button */}
                  <div className="space-y-4">
                    <Button 
                      onClick={() => setShowProgressiveForm(true)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg text-base md:text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      🎯 მომისმინე 230₾ ღირებულების პაკეტი
                    </Button>
                    
                    <div className="text-center">
                      <div className="text-xs text-gray-500">
                        💡 სმარტ ფორმა - მხოლოდ 4 მარტივი ნაბიჯი
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>მყისვეივე ხელმისაწვდომია</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>არანაირი დამალული ღირებულება</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>ნებისმიერ დროს გამოწერის გაუქმება</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    ჩვენ ვპატივისცემთ შენს პირადულობას. არასოდეს გავუზიარებთ შენს მონაცემებს მესამე პირებს.
                  </p>
                </div>
              </Card>
            )}

          </div>
        </div>

        {/* Bottom CTA reinforcement */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-4">
            <strong>რატომ ველოდები?</strong> ათასობით სტუდენტი უკვე დაიწყო თავისი ტრანსფორმაცია
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">ახლა 127 ადამიანი ათვალიერებს ამ გვერდს</span>
          </div>
        </div>
      </div>
    </section>
  );
}