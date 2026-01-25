import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function AIFAQ() {
  const faqs = [
    {
      question: "კურსი დასრულებულია თუ ახლა იწერება?",
      answer: "კურსი არის 'Living Course' რეჟიმში. ეს ნიშნავს, რომ ძირითად მასალას ყოველკვირეულად ემატება ახალი თემები და პრაქტიკული მაგალითები. სულ იგეგმება 200+ ვიდეოს ჩაწერა. ვინც ახლა ყიდულობს, იხდის ნაკლებს და ყველა მომავალ განახლებას იღებს უფასოდ."
    },
    {
      question: "ტექნიკური ცოდნა ან გამოცდილება მჭირდება?",
      answer: "არა. ეს არის ზუსტად ამ კურსის მთავარი ღირებულება. ჩვენ არ ვასწავლით პითონს ან ჯავასკრიპტს. ჩვენ ვასწავლით, როგორ გამოიყენო უკვე არსებული, მძლავრი ინსტრუმენტები (ChatGPT, n8n) ვიზუალურად, ყოველგვარი კოდის წერის გარეშე. თუ კომპიუტერის ჩართვა იცი, ეს კურსი შენთვისაა."
    },
    {
      question: "ინგლისური ენა აუცილებელია?",
      answer: "სასურველია საბაზისო დონე, რომ ინტერფეისში გაერკვიოთ, თუმცა კურსი სრულად ქართულ ენაზეა. უფრო მეტიც, ერთ-ერთი მოდული მთლიანად ეთმობა იმას, თუ როგორ ვათარგმნინოთ AI-ს ტექსტები გამართულ ქართულ ენაზე ისე, რომ \"Google Translate\"-ს არ ჰგავდეს."
    },
    {
      question: "რამდენ ხანში შევძლებ შედეგის მიღებას?",
      answer: "პირველივე მოდულის გავლის შემდეგ. ჩვენ არ გვაქვს \"მშრალი თეორია\". პირველივე გაკვეთილებიდან ვიწყებთ პრაქტიკულ სავარჯიშოებს. სტუდენტების უმეტესობა პირველ მარტივ ავტომატიზაციას 1 კვირაში აწყობს."
    },
    {
      question: "რა ღირს ინსტრუმენტები, რომელსაც ვიყენებთ?",
      answer: "ChatGPT-ს აქვს უფასო ვერსიაც, რაც დასაწყისისთვის საკმარისია. n8n-ს ასევე აქვს უფასო/სატესტო რეჟიმი. თუ გადაწყვეტთ, რომ პროფესიონალურად გინდათ მუშაობა, თვეში დაახლოებით $20-ის ინვესტიცია დაგჭირდებათ (რაც ერთ საათში ანაზღაურდება)."
    },
    {
      question: "სამსახურის/სწავლის პარალელურად თუ მოვასწრებ?",
      answer: "თავისუფლად. კურსი ჩაწერილია, რაც ნიშნავს რომ როცა გინდათ, მაშინ უყურებთ. არ ხართ მიბმული კონკრეტულ დროს. დღეში 20-30 წუთიც რომ გამოყოთ, ერთ თვეში სრულად დაეუფლებით მასალას."
    },
    {
      question: "თუ ვერ გავიგე რამე, ვინმე დამეხმარება?",
      answer: "რა თქმა უნდა! გაქვთ წვდომა დახურულ Discord ქომიუნითიში, სადაც მე და სხვა სტუდენტები მუდმივად ვპასუხობთ კითხვებს. მარტო არასდროს დარჩებით პრობლემასთან."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-semibold">
            ყველაფერი დეტალებში
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            ხშირად დასმული კითხვები
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            პასუხები ყველაზე მნიშვნელოვან კითხვებზე
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border-2 border-primary/10 rounded-xl px-6 data-[state=open]:border-primary/30 transition-colors"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-text-primary hover:text-secondary transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary leading-relaxed pb-6 text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-6 bg-card border-2 border-primary/10 rounded-xl">
          <p className="text-text-secondary mb-4">
            კიდევ გაქვს კითხვები? მოგვწერე პირადად.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://m.me/bitcamp.ge?ref=w49324136"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-medium"
            >
              მოგვწერე Facebook-ზე
            </a>
            <span className="text-text-secondary hidden sm:inline">ან</span>
            <a
              href="mailto:hello@bitcamp.ge"
              className="text-secondary hover:underline font-medium"
            >
              მოგვწერე hello@bitcamp.ge
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
