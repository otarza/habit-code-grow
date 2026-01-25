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
      question: "პროგრამირება საჭიროა ამ კურსის გასავლელად?",
      answer: "არა, ეს კურსი სპეციალურად შექმნილია არა-პროგრამისტებისთვის. ყველა ინსტრუმენტი, რომელსაც ვიყენებთ (ChatGPT, Claude, n8n) ვიზუალურია და არ საჭიროებს კოდის წერას. მე-6 მოდულში ვიყენებთ n8n-ს, რომელიც არის drag-and-drop ავტომატიზაციის პლატფორმა."
    },
    {
      question: "რა ხანგრძლივობისაა კურსი?",
      answer: "კურსი შედგება 6 მოდულისგან და 30+ თემისგან. თვითნაბიჯი სწავლის რეჟიმშია, ასე რომ შენ თვითონ განსაზღვრავ ტემპს. საშუალოდ, სტუდენტები კურსს ასრულებენ 4-6 კვირაში, მაგრამ წვდომა სამუდამოა და შეგიძლია ნებისმიერ დროს დაბრუნდე."
    },
    {
      question: "რა ინსტრუმენტებს ვისწავლი?",
      answer: "კურსის განმავლობაში ისწავლი: ChatGPT (GPT-4), Claude, DALL-E 3, Midjourney (მიმოხილვა), n8n (ავტომატიზაცია), Custom GPTs, და ვექტორული ბაზების საფუძვლებს (Pinecone/Supabase). ყველა ეს ინსტრუმენტი ერთად გაძლევს AI არქიტექტორის უნარებს."
    },
    {
      question: "რა მივიღებ კურსის დასრულების შემდეგ?",
      answer: "კურსის დასრულების შემდეგ გექნება: 1) პრომპტინგის პროფესიონალური უნარები, 2) შენი პერსონალური Custom GPT, 3) მინიმუმ ერთი მუშა n8n ავტომატიზაცია, 4) ფინალური პროექტი პორტფოლიოსთვის, და 5) Discord საზოგადოების მუდმივი წვდომა."
    },
    {
      question: "ChatGPT Plus საჭიროა?",
      answer: "კურსის უმეტესი ნაწილი შესაძლებელია უფასო ChatGPT-ით, თუმცა მე-4 და მე-5 მოდულისთვის (Vision, Custom GPTs) რეკომენდებულია ChatGPT Plus ($20/თვე). n8n-ს აქვს უფასო ვერსია, რომელიც კურსისთვის საკმარისია."
    },
    {
      question: "რა ენაზეა კურსი?",
      answer: "კურსი სრულად ქართულ ენაზეა. ასევე გვაქვს სპეციალური თემა (2.4) ქართული ენის ოპტიმიზაციაზე — როგორ მივიღოთ AI-სგან ბუნებრივი ქართული ტექსტი და არა პირდაპირი თარგმანი."
    },
    {
      question: "შემიძლია გუნდთან ერთად ვისწავლო?",
      answer: "დიახ! თუ გინდა კორპორატიული ლიცენზია (3+ ადამიანი), დაგვიკავშირდი hello@bitcamp.ge მისამართზე და შემოგთავაზებთ სპეციალურ პირობებს."
    },
    {
      question: "რა ხდება თუ კითხვა მექნება სწავლის დროს?",
      answer: "გაქვს წვდომა Discord საზოგადოებაზე, სადაც შეგიძლია დასვა კითხვები. ასევე, კურსის მასალა რეგულარულად განახლდება სტუდენტების feedback-ის საფუძველზე."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-semibold">
            ხშირად დასმული კითხვები
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            კითხვები და პასუხები
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            ყველაფერი, რაც უნდა იცოდე კურსზე ჩაწერამდე
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
              <AccordionContent className="text-text-secondary leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-6 bg-card border-2 border-primary/10 rounded-xl">
          <p className="text-text-secondary mb-4">
            ვერ იპოვე პასუხი შენს კითხვაზე?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://discord.gg/AGAW3xmGPr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-medium"
            >
              შემოგვიერთდი Discord-ზე
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
