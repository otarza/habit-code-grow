import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FullStackAIFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "მჭირდება თუ არა კოდირების გამოცდილება?",
      answer: "არა. პროგრამა იწყება აბსოლუტური ნულიდან (CS50P). ჩვენ გასწავლით პროგრამირების ლოგიკას, სინტაქსს და ინსტრუმენტებს. მთავარია გქონდეს სწავლის მოტივაცია."
    },
    {
      question: "რამდენი დრო დამჭირდება კვირაში?",
      answer: "დაახლოებით 10-15 საათი (დღეში 2 საათი). გრაფიკი მოქნილია - შეგიძლია ისწავლო საღამოობით ან შაბათ-კვირას. მენტორთან შეხვედრებსაც შენზე მორგებულ დროს დავგეგმავთ."
    },
    {
      question: "რას ნიშნავს Rolling Enrollment?",
      answer: "ეს ნიშნავს, რომ არ ველოდებით 'ჯგუფის შეკრებას'. როგორც კი დარეგისტრირდები, იმავე დღეს მიიღებ წვდომას მასალებზე და დაგინიშნავთ პირველ შეხვედრას მენტორთან."
    },
    {
      question: "მართლა ავიღებ Harvard-ის სერტიფიკატს?",
      answer: "დიახ. ჩვენ დაგეხმარებით შეასრულო Harvard-ის CS50 კურსების ყველა დავალება და ფინალური პროექტი. ამის შემდეგ, ოფიციალურად მიიღებ სერტიფიკატს Harvard University-სგან (edX პლატფორმის მეშვეობით)."
    },
    {
      question: "როგორია გადახდის პირობები?",
      answer: "გვაქვს ორი ვარიანტი: სრული გადახდა 2990₾ (ზოგავ 910₾-ს) ან 3-თვიანი განვადება (თვეში 1099₾). ადგილი იჯავშნება პირველი შენატანის გაკეთებისთანავე."
    },
    {
      question: "დამეხმარებით დასაქმებაში?",
      answer: "დიახ. პროგრამის ბოლო ეტაპი ეთმობა კარიერულ მომზადებას: CV-ის გამართვა, LinkedIn-ის ოპტიმიზაცია, იმიტირებული გასაუბრებები და პორტფოლიოს შექმნა. ჩვენ ასევე გაგიზიარებთ ჩვენი პარტნიორი კომპანიების ვაკანსიებს."
    },
    {
      question: "რა მოხდება თუ ვერ დავასრულებ პროგრამას 6 თვეში?",
      answer: "ჩვენი მიზანია დაგეხმაროთ ბოლომდე. თუ ობიექტური მიზეზების გამო ჩამორჩები, მენტორი შეგიდგენს ინდივიდუალურ გეგმას, რომ აანაზღაურო დრო. მასალებზე წვდომა კი სამუდამოდ გრჩება."
    },
    {
      question: "რით განსხვავდება ეს სხვა კურსებისგან?",
      answer: "უმეტესობა გვთავაზობს მხოლოდ ვიდეო ლექციებს. ჩვენთან მთავარი ღირებულებაა: (1) პირადი მენტორი (და არა უბრალოდ ლექტორი), (2) საერთაშორისო Harvard-ის სერტიფიკატი და (3) რეალური, მუშა პროექტების შექმნა პორტფოლიოსთვის."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            <span>გაქვს კითხვები?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            ხშირად დასმული კითხვები
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary">
            ყველაფერი, რაც უნდა იცოდე გადაწყვეტილების მისაღებად
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <button
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary pr-4">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-secondary flex-shrink-0" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="border-t border-border pt-4">
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
          <p className="text-lg font-semibold text-text-primary mb-2">
            ვერ იპოვე პასუხი?
          </p>
          <p className="text-sm text-text-secondary">
            დაჯავშნე უფასო 15-წუთიანი ზარი და პირადად აგიხსნით დეტალებს
          </p>
        </div>
      </div>
    </section>
  );
}
