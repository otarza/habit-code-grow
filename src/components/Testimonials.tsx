import { Card } from "@/components/ui/card";
import { Star, Calendar } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "ვახტანგ გაგნიძე",
      role: "გადმოვედი მენეჯმენტიდან",
      avatar: "ვგ",
      quote: "დაახლოებით 2020-ის ივნისში აღმოვაჩინე ბითქემფი. როგორც მენეჯმენტის სფეროდან გადმოსულს ძალიან ბევრი ჩელენჯი და სირთულე შემხვდა ამ პროცესში რაც ბუნებრივიცაა, მაგრამ მაგ დროს უკვე გადაწყვეტილი მქონდა რომ პროგრამისტი ვიქნებოდი და ბევრჯერ დამტკიცდა კიდეც, რომ მხოლოდ ერთი ჭეშმარიტებაა წარმატევის მისაღწევად, ის რომ არასდროს დანებდე.",
      streak: 127,
      challenge: "100-Day"
    },
    {
      name: "გოჩა ბერულავა", 
      role: "ყოფილი ფინანსისთი",
      avatar: "გბ",
      quote: "ბიტკემფმა გზა მაჩვენა და დეპრესიიდან გამომიყვანა. წარმატებები წინ არის, თუმცა რაც ამ პლატფორმამ უკვე მომცა, შეუფასებელია.",
      streak: 45,
      challenge: "30-Day"
    },
    {
      name: "გიგი ჯანელიძე",
      role: "არ დაგავიწყდეთ დასვენება", 
      avatar: "გჯ",
      quote: "არაა გასაკვირი, რომ როდესაც რამე არ გამოგვდის, განსაკუთრებულად მგრძნობიარეები და დრამატულები ვხდებით და ვფიქრობთ, რომ ეს ჩვენთვის არარის, უნიჭოები ვართ, დავაგვიანეთ, და ასე შემდეგ. მოკლედ, ამ აზრებს რაც მალე დაუპირისპირდებით, როგორც პარაზიტს, მით უფრო სასიამოვნო იქნება განვითარების პროცესი და წარმატებაც უფრო მალე მიაღწევთ.",
      streak: 23,
      challenge: "21-Day"
    },
    {
      name: "თამუნა ოდიშარია",
      role: "Omedia",
      avatar: "თო", 
      quote: "ახალი თემების სწავლისას უმეტესი დრო დაუთმეთ გააზრებას და არა უბრალოდ დამახსოვრებას. დედლაინები არაფერს არ ნიშნავს, თუ არ გესმით რას აკეთებს კოდი რომელსაც წერთ. მთავარი მოტივაცია და მიზანი უნდა იყოს საბოლოო შედეგი, ანუ გახდეთ კარგი პროგრამისტები და არა ჩაეტიოთ რაღაც დროის შუალედში.",
      streak: 78,
      challenge: "100-Day"
    },
    {
      name: "ეკატერინე ჭონიშვილი",
      role: "დეველოპერი კრედო ბანკში",
      avatar: "ეჭ",
      quote: "ბითკემპელებს ვურჩევდი არასოდეს დაკარგონ მოტივაცია, აუცილებლად დაფასდება მათი შრომა და აუცილებლად მიაღწევენ სასურველ მიზანს",
      streak: 34,
      challenge: "30-Day"
    },
    {
      name: "ანა ლეჟავა",
      role: "დეველოპერი Scandiweb - ში",
      avatar: "ალ",
      quote: "როცა დამოუკიდებლად ცდილობ სწავლას და ვერ ხედავ შენს ირგლივ სხვა დამწყებებს, ადვილია გეგონოს რომ მარტო შენ არ გამოგდის რამე. თუმცა ზუსტად ვიცოდი რომ ამ სფეროში მინდოდა ყოფნა და ჯავასკრიპტამდე როცა მივედი, ბითქემფს გადავწყდი. აქ უმრავლესობა ნულიდან იწყებს და ყველა ერთმანეთს ეხმარება; ვინც უკვე ოდნავ მეტი ისწავლა, ცდილობს ახლა სხვებს დაეხმაროს და აუხსნას მასალა, თანაც ახსნით და სხვის კოდში ბაგის ძებნით, შენსავე ცოდნას იმყარებ, ამიტომ ეს პროცესი ორივე მხარისთვის გამოსადეგია.", 
      streak: 21,
      challenge: "21-Day"
    }
  ];

  return (
    <section id="success" className="py-20 bg-muted/30 pixel-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            შეუპოვრობის ისტორიები
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ჩვენი სტუდენტების ნამდვილი ტრანსფორმაციის ისტორიები. ნახე რას ფიქრობენ შენნაირი ადამიანები.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className={`testimonial-card card-hover pixel-border relative overflow-hidden p-6 md:p-8 ${
              testimonial.challenge === "21-Day" ? "course-free" :
              testimonial.challenge === "30-Day" ? "course-challenge" :
              "course-premium"
            }`}>
              {/* Challenge Badge - Pixelart Style */}
              <div className="absolute top-6 right-6">
                <div className={`text-xs font-bold px-3 py-2 pixel-border ${
                  testimonial.challenge === "21-Day" ? 
                    "bg-secondary text-secondary-foreground challenge-21" :
                  testimonial.challenge === "30-Day" ? 
                    "bg-primary text-primary-foreground challenge-30" :
                    "bg-accent text-accent-foreground challenge-100"
                }`}>
                  {testimonial.challenge}
                </div>
              </div>

              {/* Stars - Enhanced with pixel shadow */}
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="w-5 h-5 fill-accent text-accent pixel-shadow" 
                    style={{ filter: 'drop-shadow(1px 1px 0px hsl(var(--accent) / 0.3))' }}
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-text-secondary mb-8 leading-relaxed text-base">
                "{testimonial.quote}"
              </blockquote>

              {/* Streak Counter - Enhanced Pixelart Style */}
              <div className="streak-counter mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-secondary pixel-shadow" />
                  <span className="font-bold text-text-primary text-lg">
                    {testimonial.streak} Day Streak
                  </span>
                </div>
                <div className="progress-bar h-3 bg-muted rounded-none pixel-border overflow-hidden">
                  <div 
                    className={`progress-fill h-full transition-all duration-500 ${
                      testimonial.challenge === "21-Day" ? "bg-secondary" :
                      testimonial.challenge === "30-Day" ? "bg-primary" :
                      "bg-accent"
                    }`}
                    style={{ width: `${Math.min((testimonial.streak / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Author - Enhanced with pixelart avatar */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 pixel-border flex items-center justify-center text-text-inverse font-bold text-lg ${
                  testimonial.challenge === "21-Day" ? "bg-secondary" :
                  testimonial.challenge === "30-Day" ? "bg-primary" :
                  "bg-accent"
                }`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-text-primary text-lg">{testimonial.name}</div>
                  <div className="text-sm text-text-secondary font-medium">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action - Enhanced Pixelart Style */}
        <div className="text-center mt-16">
          <p className="text-xl text-text-secondary mb-8 font-medium">
            მზად ხარ დაწერო შენი თავგადასავალი?
          </p>
          <div className="inline-flex items-center gap-3 bg-secondary/10 pixel-border px-8 py-4 card-hover">
            <div className="w-3 h-3 bg-secondary pixel-border animate-pulse"></div>
            <span className="font-bold text-secondary text-lg">შეუერთდი ათასობით სტუდენტის შეუპოვრობის ბილიკს შეუჩერებელი ჩვევების ჩამოყალიბებაში</span>
          </div>
        </div>
      </div>
    </section>
  );
}