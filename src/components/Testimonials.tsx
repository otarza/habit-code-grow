import { Card } from "@/components/ui/card";
import { Star, Calendar, Trophy, Target, Zap, Award, Crown, Gem } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  challenge: string;
  icon: any;
  badgeColor: string;
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "ვახტანგ გაგნიძე",
      role: "ინჟინერი sweeftdigital - ში",
      avatar: "ვგ",
      quote: "დაახლოებით 2020-ის ივნისში აღმოვაჩინე ბითქემფი. როგორც მენეჯმენტის სფეროდან გადმოსულს ძალიან ბევრი ჩელენჯი და სირთულე შემხვდა ამ პროცესში რაც ბუნებრივიცაა, მაგრამ მაგ დროს უკვე გადაწყვეტილი მქონდა რომ პროგრამისტი ვიქნებოდი და ბევრჯერ დამტკიცდა კიდეც, რომ მხოლოდ ერთი ჭეშმარიტებაა წარმატევის მისაღწევად, ის რომ არასდროს დანებდე.",
      challenge: "Warrior",
      icon: Crown,
      badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500"
    },
    {
      name: "გოჩა ბერულავა", 
      role: "დეველოპერი ავერსში",
      avatar: "გბ",
      quote: "ბიტკემფმა გზა მაჩვენა და დეპრესიიდან გამომიყვანა. წარმატებები წინ არის, თუმცა რაც ამ პლატფორმამ უკვე მომცა, შეუფასებელია.",
      challenge: "Champion",
      icon: Trophy,
      badgeColor: "bg-gradient-to-r from-blue-500 to-purple-600"
    },
    {
      name: "გიგი ჯანელიძე",
      role: "დეველოპერი Omedia - ში", 
      avatar: "გჯ",
      quote: "არაა გასაკვირი, რომ როდესაც რამე არ გამოგვდის, განსაკუთრებულად მგრძნობიარეები და დრამატულები ვხდებით და ვფიქრობთ, რომ ეს ჩვენთვის არარის, უნიჭოები ვართ, დავაგვიანეთ, და ასე შემდეგ. მოკლედ, ამ აზრებს რაც მალე დაუპირისპირდებით, როგორც პარაზიტს, მით უფრო სასიამოვნო იქნება განვითარების პროცესი და წარმატებაც უფრო მალე მიაღწევთ.",
      challenge: "Fighter",
      icon: Zap,
      badgeColor: "bg-gradient-to-r from-green-400 to-emerald-500"
    },
    {
      name: "თამუნა ოდიშარია",
      role: "დეველოპერი Omedia - ში",
      avatar: "თო", 
      quote: "ახალი თემების სწავლისას უმეტესი დრო დაუთმეთ გააზრებას და არა უბრალოდ დამახსოვრებას. დედლაინები არაფერს არ ნიშნავს, თუ არ გესმით რას აკეთებს კოდი რომელსაც წერთ. მთავარი მოტივაცია და მიზანი უნდა იყოს საბოლოო შედეგი, ანუ გახდეთ კარგი პროგრამისტები და არა ჩაეტიოთ რაღაც დროის შუალედში.",
      challenge: "Master",
      icon: Gem,
      badgeColor: "bg-gradient-to-r from-purple-500 to-pink-600"
    },
    {
      name: "ეკატერინე ჭონიშვილი",
      role: "დეველოპერი კრედო ბანკში",
      avatar: "ეჭ",
      quote: "ბითკემპელებს ვურჩევდი არასოდეს დაკარგონ მოტივაცია, აუცილებლად დაფასდება მათი შრომა და აუცილებლად მიაღწევენ სასურველ მიზანს",
      challenge: "Hero",
      icon: Award,
      badgeColor: "bg-gradient-to-r from-red-500 to-orange-600"
    },
    {
      name: "ანა ლეჟავა",
      role: "დეველოპერი Scandiweb - ში",
      avatar: "ალ",
      quote: "როცა დამოუკიდებლად ცდილობ სწავლას და ვერ ხედავ შენს ირგლივ სხვა დამწყებებს, ადვილია გეგონოს რომ მარტო შენ არ გამოგდის რამე. თუმცა ზუსტად ვიცოდი რომ ამ სფეროში მინდოდა ყოფნა და ჯავასკრიპტამდე როცა მივედი, ბითქემფს გადავწყდი. აქ უმრავლესობა ნულიდან იწყებს და ყველა ერთმანეთს ეხმარება; ვინც უკვე ოდნავ მეტი ისწავლა, ცდილობს ახლა სხვებს დაეხმაროს და აუხსნას მასალა, თანაც ახსნით და სხვის კოდში ბაგის ძებნით, შენსავე ცოდნას იმყარებ, ამიტომ ეს პროცესი ორივე მხარისთვის გამოსადეგია.", 
      challenge: "Guardian",
      icon: Target,
      badgeColor: "bg-gradient-to-r from-teal-400 to-cyan-500"
    }
  ];

  return (
    <section id="success" className="py-20 bg-muted/30 pixel-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          {/* Scarcity Alert */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            {/* <span>ბოლო 48 საათში 89 ადამიანმა დაიწყო ჩელენჯი</span> */}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            შეუპოვრობის ისტორიები
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ჩვენი სტუდენტების ნამდვილი ტრანსფორმაციის ისტორიები. ნახე რას ფიქრობენ შენნაირი ადამიანები.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon;
            return (
            <Card key={index} className="testimonial-card card-hover pixel-border relative overflow-hidden p-6 md:p-8 bg-card">
              {/* Beautiful Pixelart Badge */}
              <div className="absolute top-6 right-6">
                <div className={`${testimonial.badgeColor} text-white text-xs font-bold px-3 py-2 pixel-border flex items-center gap-2`}>
                  <Icon className="w-3 h-3" />
                  <span>{testimonial.challenge}</span>
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


              {/* Author - Enhanced with pixelart avatar */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 pixel-border flex items-center justify-center text-white font-bold text-lg ${testimonial.badgeColor.replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-text-primary text-lg">{testimonial.name}</div>
                  <div className="text-sm text-text-secondary font-medium">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          )})}
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