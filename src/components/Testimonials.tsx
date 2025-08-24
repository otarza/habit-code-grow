import { Card } from "@/components/ui/card";
import { Star, Calendar } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "David Chen",
      role: "Self-Taught Developer",
      avatar: "DC",
      quote: "After 100 days, coding feels as natural as brushing my teeth. The habit system completely changed my approach to learning.",
      streak: 127,
      challenge: "100-Day"
    },
    {
      name: "Sarah Rodriguez", 
      role: "Career Changer",
      avatar: "SR",
      quote: "Week two used to be my breaking point. This mentorship helped me push through and build real consistency.",
      streak: 45,
      challenge: "30-Day"
    },
    {
      name: "Mike Thompson",
      role: "Computer Science Student", 
      avatar: "MT",
      quote: "The Discord community and weekly sessions kept me accountable when motivation wasn't enough.",
      streak: 23,
      challenge: "21-Day"
    },
    {
      name: "Anna Kowalski",
      role: "Bootcamp Graduate",
      avatar: "AK", 
      quote: "Finally learned how to learn. The evidence-based techniques made everything click.",
      streak: 78,
      challenge: "100-Day"
    },
    {
      name: "James Park",
      role: "Working Professional",
      avatar: "JP",
      quote: "30-60 minutes daily was perfect for my schedule. Built the habit without burnout.",
      streak: 34,
      challenge: "30-Day"
    },
    {
      name: "Emma Wilson",
      role: "Complete Beginner",
      avatar: "EW",
      quote: "Started with zero experience. The personalized guidance helped me overcome every roadblock.", 
      streak: 21,
      challenge: "21-Day"
    }
  ];

  return (
    <section id="success" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Real students, real streaks, real transformations. See how our mentorship 
            system has helped others overcome week-two drop-off and build lasting habits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card card-hover relative overflow-hidden">
              {/* Challenge Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  testimonial.challenge === "21-Day" ? "bg-secondary-light text-secondary" :
                  testimonial.challenge === "30-Day" ? "bg-primary-light text-primary" :
                  "bg-accent-light text-accent"
                }`}>
                  {testimonial.challenge}
                </span>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-text-secondary mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Streak Counter */}
              <div className="streak-counter mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span className="font-semibold text-text-primary">
                    {testimonial.streak} Day Streak
                  </span>
                </div>
                <div className="progress-bar h-2 mt-2">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((testimonial.streak / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-text-inverse font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-text-primary">{testimonial.name}</div>
                  <div className="text-sm text-text-secondary">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-text-secondary mb-6">
            Ready to write your own success story?
          </p>
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="font-semibold text-secondary">Join hundreds of students building unstoppable habits</span>
          </div>
        </div>
      </div>
    </section>
  );
}