import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Briefcase, TrendingUp, Megaphone, Lightbulb } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  highlight: string;
  icon: any;
  badgeColor: string;
}

export function AITestimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "მანანა ჩართოლანი",
      role: "აქტიური მონაწილე",
      avatar: "მჩ",
      quote: "მადლობა თქვენ. მე კი ძალიან მომწონს თქვენი გადმოცემის მეთოდი.",
      highlight: "გადმოცემის მეთოდი",
      icon: Megaphone,
      badgeColor: "bg-gradient-to-r from-pink-500 to-rose-600"
    },
    {
      name: "ნიკა გოგოლაძე",
      role: "აქტიური მონაწილე",
      avatar: "ნგ",
      quote: "საინტერესო იყო",
      highlight: "საინტერესო კურსი",
      icon: Lightbulb,
      badgeColor: "bg-gradient-to-r from-orange-500 to-amber-600"
    },
    {
      name: "Jo Rjo",
      role: "აქტიური მონაწილე",
      avatar: "JR",
      quote: "მაგარი კურსია 👍👍👍",
      highlight: "მაგარი კურსი",
      icon: TrendingUp,
      badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-600"
    },
    {
      name: "მიხეილ ჯერიაშვილი",
      role: "აქტიური მონაწილე",
      avatar: "მჯ",
      quote: "დიდი მადლობა, ძალიან სასარგებლო კურსია.. მოვრჩით frameworks და ძალიან საინტერესო დასკვნა გამოვიტანე, ამ ყველაფერს ისედაც ვაკეთებდი (ხუთივე ნაბიჯს), ოღონდ ისე, რომ საერთოდ არც ვიცოდი თუ სახელებიც კი ერქვა და ამხელა თეორიული სწავლება არსებობს ამის შესახებ. ამის მერე სისტემურად და გააზრებულად ბევრად ეფექტურ შედეგს მივიღებ.",
      highlight: "სისტემური მიდგომა",
      icon: Briefcase,
      badgeColor: "bg-gradient-to-r from-purple-500 to-violet-600"
    },
    {
      name: "Lizi",
      role: "აქტიური მონაწილე",
      avatar: "L",
      quote: "მადლობა ძალიან საინტერესოდ და გასაგებად ხსნით.",
      highlight: "გასაგები ახსნა",
      icon: Lightbulb,
      badgeColor: "bg-gradient-to-r from-emerald-500 to-green-600"
    },
    {
      name: "Maia Pavliashvili",
      role: "აქტიური მონაწილე",
      avatar: "MP",
      quote: "დიდი მადლობა, ძალიან მომწონს კურსი, თანმიმდევრული და საინტერესოა და ასევე გადმოცემის ფორმა...",
      highlight: "თანმიმდევრული კურსი",
      icon: TrendingUp,
      badgeColor: "bg-gradient-to-r from-indigo-500 to-blue-600"
    },
    {
      name: "Aleqsandre Nucubidze",
      role: "აქტიური მონაწილე",
      avatar: "AN",
      quote: "დიდი მადლობა ბატონო ოთარ, სასიამოვნო და მეტად საინტერესოა თქვენი ლექციების მოსმენა.",
      highlight: "საინტერესო ლექციები",
      icon: Megaphone,
      badgeColor: "bg-gradient-to-r from-red-500 to-pink-600"
    },
    {
      name: "George Gegelia",
      role: "აქტიური მონაწილე",
      avatar: "GG",
      quote: "ნამდვილად კარგი ფორმატია მოკლე ვიდეოების. მე ოთოს სხვა ლექციებსაც ვუსმენ რომლებიც მინიმუმ საათი გრძელდება. თუ შევადარებთ ვინც ახლა იწყებს ახალი პროფესიის ათვისებას მოკლე ვიდეოებით დაწყება სჯობს. თუ საკითხი საინტერესო იქნება ის ადამიანი ნახავს სხვა გზებსაც რომ უფრო გრძელი ვიდეო გაკვეთილებით გაიღრმავოს ცოდნა. მადლობა ოთო",
      highlight: "მოკლე ვიდეოები",
      icon: Briefcase,
      badgeColor: "bg-gradient-to-r from-cyan-500 to-blue-600"
    },
    {
      name: "David Demetradze",
      role: "აქტიური მონაწილე",
      avatar: "DD",
      quote: "მე ძალიან მომწონს მოკლე ვიდეოების ფორმატი",
      highlight: "ეფექტური ფორმატი",
      icon: TrendingUp,
      badgeColor: "bg-gradient-to-r from-amber-500 to-orange-600"
    },
    {
      name: "Ia Kiknadze",
      role: "აქტიური მონაწილე",
      avatar: "IK",
      quote: "მოგესალმებით 🥰 დიდი მადლობა 🙏 ამ შესაძლებლობისთვის. ვიდეო გაკვეთილები ჩანაწერის სახით ჩემთვის როგორც ემიგრანტისთვის, რომელსაც ძალიან დატვირთული გრაფიკი აქვს, ძალიან მოსახერხებელია. წარმატებები ყველას, მასწავლებელსა და მოსწავლეებსაც🥰",
      highlight: "მოსახერხებელი გრაფიკი",
      icon: Briefcase,
      badgeColor: "bg-gradient-to-r from-teal-500 to-green-600"
    },
    {
      name: "TuKa",
      role: "აქტიური მონაწილე",
      avatar: "TK",
      quote: "დღეს შემოგიერთდით, დილას სქროლვისას გადავაწყდი თქვენს ვიდეოს და არც კი დავფიქრებულვარ ისე სასწრაფოდ დავრეგისტრირდი კურსზე.პირველი გაკვეთილის მოსმენისთანავე დიდი იმედი და სურვილი გაჩნდა და მადლობა თქვენ ამისთვის!",
      highlight: "დიდი იმედი",
      icon: Megaphone,
      badgeColor: "bg-gradient-to-r from-fuchsia-500 to-purple-600"
    },
    {
      name: "Keti Gabunia",
      role: "აქტიური მონაწილე",
      avatar: "KG",
      quote: "როგორც იქნა დავიწყე და თქვენი დამსახურებაა! ჩვენთვის აქ მოსვლა საწინდარი იყოს დიდი და კეთილი საქმეების !",
      highlight: "ახალი დასაწყისი",
      icon: Star,
      badgeColor: "bg-gradient-to-r from-yellow-500 to-orange-600"
    },
    {
      name: "Nana Nadaraia",
      role: "აქტიური მონაწილე",
      avatar: "NN",
      quote: "მადლობა დიდი, საოცრათ თბილი აურა გაქვთ. ძალიან დაინტერესებული ვარ და თანაც მეშინია რომ ვერ დავძლიო.",
      highlight: "თბილი გარემო",
      icon: Lightbulb,
      badgeColor: "bg-gradient-to-r from-pink-500 to-rose-600"
    },
    {
      name: "Lizi",
      role: "აქტიური მონაწილე",
      avatar: "L",
      quote: "მადლობა ამ გამოცდილების გაზიარებისთვის. საოცარი ადამიანი ხართ და პროფესიონალი ძალიან საინტერესოა",
      highlight: "პროფესიონალიზმი",
      icon: Star,
      badgeColor: "bg-gradient-to-r from-violet-500 to-purple-600"
    },
    {
      name: "Giorgi Toidze",
      role: "აქტიური მონაწილე",
      avatar: "GT",
      quote: "დიდი მადლობა ოთარ, რაღაც მინიმალურ დონეზე ვიცნობ მაგ სფეროს და მიუხედავად ჩემი საკმაოდ არასტაბილური გრაფიკისა, დიდი ყურადღებით გამოგყვები კურსის მსვლეობისას, გავხსენი პირველი ვიდეო ყველაფერი მუშაობს",
      highlight: "მოქნილი გრაფიკი",
      icon: TrendingUp,
      badgeColor: "bg-gradient-to-r from-emerald-500 to-teal-600"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm font-semibold">
            სტუდენტების შეფასებები
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            რას ამბობს ჩვენი{" "}
            <span className="text-secondary">400+ სტუდენტი</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            რეალური შედეგები რეალური ადამიანებისგან, რომლებმაც უკვე გაიარეს ეს პროგრამა.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => {
            const Icon = testimonial.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden p-6 sm:p-8 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl card-hover bg-card"
              >
                {/* Highlight Badge */}
                <div className="absolute top-6 right-6">
                  <div className={`${testimonial.badgeColor} text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5`}>
                    <Icon className="w-3 h-3" />
                    <span>{testimonial.highlight}</span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-text-secondary mb-8 leading-relaxed text-base min-h-[120px]">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${testimonial.badgeColor}`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-lg">{testimonial.name}</div>
                    <div className="text-sm text-text-secondary">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Social Proof Banner */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 bg-accent/10 border-2 border-accent/20 rounded-xl px-8 py-4">
            <div className="text-4xl font-bold text-accent">400+</div>
            <div className="text-left">
              <div className="font-semibold text-text-primary">სტუდენტი უკვე სწავლობს</div>
              <div className="text-sm text-text-secondary">და ეს რიცხვი იზრდება ყოველდღე</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
