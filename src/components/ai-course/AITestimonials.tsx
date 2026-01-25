import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Briefcase, TrendingUp, Megaphone, Users, Lightbulb, Code } from "lucide-react";

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
      name: "ნინო მაისურაძე",
      role: "მარკეტინგის მენეჯერი",
      avatar: "ნმ",
      quote: "ვერც წარმოვიდგენდი, რომ პროგრამირების გარეშე შევძლებდი ავტომატიზაციების აწყობას. ახლა ჩემი კონტენტ-კალენდარი თავისით ივსება და სოციალურ ქსელებში პოსტები ავტომატურად იდება.",
      highlight: "კონტენტ ავტომატიზაცია",
      icon: Megaphone,
      badgeColor: "bg-gradient-to-r from-pink-500 to-rose-600"
    },
    {
      name: "გიორგი ბერიძე",
      role: "სტარტაპის დამფუძნებელი",
      avatar: "გბ",
      quote: "n8n-ის მოდულმა სრულიად შემიცვალა ბიზნესის მართვის ხედვა. Support-ის ავტომატიზაცია, იმეილების კატეგორიზაცია — ყველაფერი ავტომატურად ხდება. დროის დანაზოგი უზარმაზარია.",
      highlight: "ბიზნეს ავტომატიზაცია",
      icon: TrendingUp,
      badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-600"
    },
    {
      name: "მარიამ კვარაცხელია",
      role: "HR მენეჯერი",
      avatar: "მკ",
      quote: "Custom GPT-ის შექმნა იმდენად მარტივი აღმოჩნდა! ახლა ჩემი პერსონალური ასისტენტი მეხმარება CV-ების გადარჩევაში, შეხვედრების შეჯამებაში და კანდიდატებთან კომუნიკაციაში.",
      highlight: "Custom GPT",
      icon: Users,
      badgeColor: "bg-gradient-to-r from-green-500 to-emerald-600"
    },
    {
      name: "დავით ჩხეიძე",
      role: "ფინანსური ანალიტიკოსი",
      avatar: "დჩ",
      quote: "PDF რეპორტების ანალიზი, რომელსაც მთელი დღე მჭირდებოდა, ახლა წუთებში კეთდება. Chain of Thought ტექნიკამ მასწავლა, როგორ მივიღო AI-სგან ნამდვილად გააზრებული პასუხები.",
      highlight: "მონაცემთა ანალიზი",
      icon: Briefcase,
      badgeColor: "bg-gradient-to-r from-purple-500 to-violet-600"
    },
    {
      name: "ანა გელაშვილი",
      role: "კონტენტ-კრეატორი",
      avatar: "აგ",
      quote: "DALL-E და Midjourney-ს ვიყენებდი, მაგრამ შედეგები შემთხვევითი იყო. პრომპტინგის სწორი ტექნიკებით ახლა ზუსტად ისეთ ვიზუალებს ვქმნი, როგორიც მინდა.",
      highlight: "ვიზუალური AI",
      icon: Lightbulb,
      badgeColor: "bg-gradient-to-r from-orange-500 to-amber-600"
    },
    {
      name: "ლევან თოფურია",
      role: "ოპერაციების მენეჯერი",
      avatar: "ლთ",
      quote: "RAG სისტემის აწყობა ჩვენი შიდა დოკუმენტაციისთვის — ეს იყო game-changer. ახლა ახალი თანამშრომლები თავად პოულობენ პასუხებს ჩვენს Knowledge Base-ში.",
      highlight: "RAG სისტემა",
      icon: Code,
      badgeColor: "bg-gradient-to-r from-red-500 to-rose-600"
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
            რას ამბობენ ჩვენი{" "}
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
              <div className="text-sm text-text-secondary">და რიცხვი იზრდება ყოველდღე</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
