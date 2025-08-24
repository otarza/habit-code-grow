import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Do I need prior coding experience?",
      answer: "Not at all! Beginners are welcome. We focus on building the habit first, which is often harder than learning syntax. Many students start with zero experience and successfully complete their challenges."
    },
    {
      question: "How much time do I need per day?",
      answer: "Just 30-60 minutes daily. Consistency beats intensity. We'd rather you code for 30 minutes every day than 4 hours once a week. The system is designed to fit into busy schedules."
    },
    {
      question: "What if I get stuck or have questions?",
      answer: "You get personalized support through weekly live Q&A sessions on Google Meet, 24/7 Discord community help, and direct mentor guidance for your specific roadblocks. You're never learning alone."
    },
    {
      question: "What happens if I miss a day?",
      answer: "Life happens! We help you recover and maintain momentum. The goal isn't perfection, it's building a sustainable long-term habit. We have specific strategies for getting back on track."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "Yes! If you complete your chosen challenge and don't feel you've made meaningful progress, we'll provide a full refund. We're confident in our system because we've seen it work for hundreds of students."
    },
    {
      question: "How is this different from other coding courses?",
      answer: "Most courses focus on content. We focus on building the habit of daily practice first. We use evidence-based learning techniques, provide live mentorship, and our goal is your independence - not dependency on us."
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-text-secondary">
            Everything you need to know about building unstoppable coding habits
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
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:hello@bitcamp.ge"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors"
            >
              Email Us
            </a>
            <a 
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary-hover rounded-lg transition-colors"
            >
              Join Discord Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}