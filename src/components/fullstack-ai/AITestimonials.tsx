import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Briefcase } from "lucide-react";
import { PixelGrid } from "@/components/PixelBackground";

export function AITestimonials() {
  const testimonials = [
    {
      name: "გიორგი მ.",
      role: "AI Automation Specialist",
      previousRole: "ყოფილი: მარკეტინგის მენეჯერი",
      quote: "პროგრამირების აზრზე არ ვიყავი. CS50P-მ საფუძვლები მასწავლა, მენტორმა კი რეალური პრობლემების გადაჭრაში გამომაწრთო. ახლა უკვე დამოუკიდებლად ვაწყობ AI სისტემებს.",
      outcome: "დასაქმდა თბილისურ სტარტაპში",
      achievement: "Harvard CS50P + SQL",
      rating: 5,
      color: "blue"
    },
    {
      name: "თამარ ბ.",
      role: "Junior Python Developer",
      previousRole: "ყოფილი: გაყიდვების მენეჯერი",
      quote: "ყველაზე ძალიან 1-on-1 სესიები დამეხმარა. როცა ვიჭედებოდი, მენტორი ზუსტ მიმართულებას მაძლევდა. სერტიფიკატებმა კი გასაუბრებებზე დიდი უპირატესობა მომცა.",
      outcome: "კარიერული ცვლილება 5 თვეში",
      achievement: "პორტფოლიო: 4 AI პროექტი",
      rating: 5,
      color: "green"
    },
    {
      name: "ნიკა ს.",
      role: "Freelance AI Developer",
      previousRole: "ყოფილი: მასწავლებელი",
      quote: "n8n-ის მოდული იყო აღმოჩენა. სკოლაში ვასწავლიდი, ახლა კი უცხოელ კლიენტებს ვუწყობ ავტომატიზაციებს. შემოსავალი გაორმაგდა, დატვირთვა - განახევრდა.",
      outcome: "3 მუდმივი კლიენტი",
      achievement: "შემოსავალი: 2500₾+/თვეში",
      rating: 5,
      color: "purple"
    }
  ];

  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700"
  };

  return (
    <section className="relative py-20 bg-surface pixel-bg">
      <PixelGrid />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 px-4 py-2 text-sm font-semibold">
            წარმატების ისტორიები
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            მათ{" "}
            <span className="text-secondary">შეცვალეს</span> თავიანთი კარიერა
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ჩვენი კურსდამთავრებულები უკვე მუშაობენ AI და Tech სფეროში.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 sm:p-8 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl card-hover bg-surface/80 backdrop-blur-sm flex flex-col"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-text-secondary mb-6 leading-relaxed italic flex-1">
                "{testimonial.quote}"
              </p>

              {/* Divider */}
              <div className="border-t border-primary/10 pt-6">
                {/* Avatar and Name */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-text-secondary">{testimonial.role}</p>
                    <p className="text-xs text-text-muted italic">{testimonial.previousRole}</p>
                  </div>
                </div>

                {/* Achievement Badge */}
                <div className="space-y-2">
                  <Badge className={`${colorMap[testimonial.color as keyof typeof colorMap]} px-3 py-1 text-xs font-semibold flex items-center gap-1 w-fit`}>
                    <Award className="w-3 h-3" />
                    {testimonial.achievement}
                  </Badge>
                  <Badge className="bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold flex items-center gap-1 w-fit">
                    <Briefcase className="w-3 h-3" />
                    {testimonial.outcome}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-text-secondary">
            <strong className="text-text-primary">შემდეგი შეიძლება შენ იყო:</strong>{" "}
            დაიწყე დღეს, შედეგს ნახავ 6 თვეში.
          </p>
        </div>
      </div>
    </section>
  );
}
