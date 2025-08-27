import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "0 - დან დაწყებას შევძლებ?",
      answer: " რა თქმა უნდა! პირველ რიგში ვფოკუსირდებით ჩვევის ჩამოყალიბებაზე, რაც ხშირად უფრო ძნელია ვიდრე პროგრამირების სწავლა. სტუდენტების უმეტესობა იწყებს 0 ცოდნით და წარმატებით ამთავრებს ჩელენჯებს."
    },
    {
      question: "რა დრო დამჭირდება ყოველდღიურად?",
      answer: "დასაწყებად მხოლოდ 30-60 წუთიც საკმარისია. მთავარია ყოველდღიურობა. სჯობს ყოველდღე იმეცადინო 1 საათი ვიდრე რომელიმე დღეები გამოტოვო და შემდეგ ერთიანად იმეცადინო 4 საათი. ჩვენი ჩელენჯების სისტემა იდეალურად ერგება საქმიანი ადამიანების ცხოვრებას და გრაფიკს."
    },
    {
      question: "რა მოხდება მაშინ როცა შეკითხვები გამიჩნდება?",
      answer: "შეგიძლია მიიღო ყოველდღიური მხარდაჭერა ჩვენი მენტორებისგან. ესწრები სამეცადინო სესიებს სადაც მენტორი გეხმარება ნებისმიერი პრობლემის გადაჭრაში, გიხსნის და გამეცადინებს კომპლექსური საკითხების გააზრებაში, შენთან ერთად აკეთებს დავალებებს."
    },
    {
      question: "რა მოხდება თუ რომელიმე დღე ჩავაგდე?",
      answer: "ცხოვრებაში ყველაფერი ხდება! ჩვენ დაგეხმარებით რომ აღიდგინო წარმატებისთვის საჭირო ტემპი და მომენტუმი. პერფექციონიზმი არ არის ჩვენი მიზანი. ჩვენ გვჭირდება გრძელვადიანი ჩვევების ჩამოყალიბება. ამიტომ გვაქვს სპეციალურად ასეთი სიტუაციებისთვის შემუშავებული სტრატეგიები."
    },
    {
      question: "რით განსხვავდებით სხვა კურსებისგან?",
      answer: "სხვა კურსების უმეტესობა გთავაზობთ წინასწარ დაწერილ ლექციებსა და გაკვეთილებს სადაც ლექტორი მოვალეობის მოხდის მიზნით გიხსნით რაღაცას და გემშვიდობებათ. ჩვენ ვიყენებთ შენგან მიღებულ ინფორმაციას იმისთვის რომ დაგიგეგმოთ სასწავლო პროცესი და თან შენი გეგმა მუდმივად ახლდება იმის მიხედვით თუ რაზე დაგჭირდება აქცენტის გაკეთება და ყურადღების მიქცევა. ჩვენ ვფოკუსირდებით ყოველდღიური ჩვევების ჩამოყალიბებაზე. შედეგად ჩვენთან მიღებული ცოდნა, გამოცდილება და უნარები გაგყვებათ მთელი ცხოვრების განმავლობაში. ლაივ სამენტორო სესიბზე გასწავლით როგორ უნდა გადაჭრა პრობლემები და შემდეგ შენი ხელით აკეთებ ყველაფერს - რაც საბოლოოდ გაქცევს დამოუკიდებელ პროფესიონალად."
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            ხშირად დასმული კითხვები
          </h2>
          <p className="text-xl text-text-secondary">
            ყველაფერი რაც უნდა იცოდე შეუჩერებელი ჩვევების ჩამოსაყალიბებლად
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
              <button
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-text-primary pr-4">
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
                    <p className="text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">
            კიდევ გაქვს კითხვები? სიამოვნებით გაგიწევთ კონსულტაციას.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:hello@bitcamp.ge"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
            >
              მოგვწერე
            </a>
            <a 
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary-hover rounded-lg transition-colors"
            >
              ეწვიე ჩვენს Facebook გვერდს
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}