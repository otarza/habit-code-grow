import { Code, Database, Brain, Workflow, Award, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PixelGrid } from "@/components/PixelBackground";

export function AICurriculumTimeline() {
  const curriculum = [
    {
      phase: "თვე 1-2",
      icon: Code,
      title: "Python-ის საფუძვლები (CS50P)",
      topics: [
        "ფუნქციური და ობიექტზე ორიენტირებული პროგრამირება",
        "მონაცემთა სტრუქტურები და ალგორითმები",
        "ფაილური სისტემები და Error Handling",
        "Unit Testing და კოდის ხარისხი",
        "AI ინსტრუმენტების გამოყენება კოდირებისთვის"
      ],
      certificate: true,
      certificateName: "Harvard CS50P Certificate",
      color: "bg-blue-500",
      badgeColor: "bg-blue-100 text-blue-700"
    },
    {
      phase: "თვე 3",
      icon: Database,
      title: "მონაცემთა ბაზები & SQL (CS50 SQL)",
      topics: [
        "რელაციური ბაზების დიზაინი და არქიტექტურა",
        "რთული SQL Query-ების წერა და ოპტიმიზაცია",
        "მონაცემთა ანალიზი და მანიპულაცია",
        "ბაზების უსაფრთხოება და სკალირება",
        "Python-ისა და SQL-ის ინტეგრაცია"
      ],
      certificate: true,
      certificateName: "Harvard CS50 SQL Certificate",
      color: "bg-green-500",
      badgeColor: "bg-green-100 text-green-700"
    },
    {
      phase: "თვე 4",
      icon: Brain,
      title: "AI Prompt Engineering & LLMs",
      topics: [
        "ChatGPT და Claude: Advanced Prompting ტექნიკები",
        "Chain-of-Thought და Few-Shot Learning",
        "AI-ის ინტეგრაცია რეალურ სამუშაო გარემოში",
        "LLM API-ების გამოყენება (OpenAI, Anthropic)",
        "ავტონომიური აგენტების ძირითადი პრინციპები"
      ],
      certificate: false,
      color: "bg-purple-500",
      badgeColor: "bg-purple-100 text-purple-700"
    },
    {
      phase: "თვე 5-6",
      icon: Workflow,
      title: "AI ავტომატიზაციები (n8n & Agents)",
      topics: [
        "Advanced Workflow Automation (n8n)",
        "AI აგენტების შექმნა და დიპლოი",
        "API ინტეგრაციები (Stripe, Slack, Gmail, etc.)",
        "Captsone პროექტი: სრული AI სისტემის აწყობა",
        "კარიერული მომზადება: CV და პორტფოლიო"
      ],
      certificate: false,
      color: "bg-orange-500",
      badgeColor: "bg-orange-100 text-orange-700"
    }
  ];

  return (
    <section id="curriculum" className="relative py-20 bg-surface pixel-bg">
      <PixelGrid />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 px-4 py-2 text-sm font-semibold">
            სასწავლო პროგრამა
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            6 თვეში, ნაბიჯ-ნაბიჯ{" "}
            <span className="text-secondary">AI კარიერისკენ</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Harvard-ის ოქროს სტანდარტი + თანამედროვე AI უნარები = შენი კონკურენტული უპირატესობა.
          </p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {curriculum.map((phase, index) => {
            const IconComponent = phase.icon;
            return (
              <Card
                key={index}
                className="group relative p-6 sm:p-8 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl card-hover bg-surface/80 backdrop-blur-sm"
              >
                {/* Phase Badge */}
                <div className="absolute -top-4 left-6">
                  <Badge className={`${phase.badgeColor} px-4 py-1 text-sm font-bold border-2 border-white shadow-md`}>
                    {phase.phase}
                  </Badge>
                </div>

                {/* Weekly 1-on-1 Badge */}
                <div className="absolute -top-4 right-6">
                  <Badge className="bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold border-2 border-white shadow-md flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    + მენტორ სესია
                  </Badge>
                </div>

                {/* Icon and Title */}
                <div className="flex items-start gap-4 mb-6 mt-4">
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 ${phase.color} rounded-lg flex items-center justify-center shadow-lg`}>
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">
                      {phase.title}
                    </h3>
                    {phase.certificate && (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                        <Award className="w-4 h-4" />
                        <span>{phase.certificateName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Topics List */}
                <ul className="space-y-3">
                  {phase.topics.map((topic, topicIndex) => (
                    <li key={topicIndex} className="flex items-start gap-3 text-text-secondary">
                      <div className={`flex-shrink-0 w-2 h-2 ${phase.color} rounded-full mt-2`}></div>
                      <span className="text-sm sm:text-base leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>

                {/* Certificate Badge at Bottom */}
                {phase.certificate && (
                  <div className="mt-6 pt-6 border-t border-primary/10">
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-red-600">
                      <Award className="w-5 h-5" />
                      <span>Harvard Certificate Included</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg sm:text-xl text-text-secondary mb-6">
            + 24 კვირეული, პირადად შენზე მორგებული მენტორ-სესია
          </p>
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-6 py-3 rounded-full text-sm font-semibold border-2 border-accent/30">
            <Award className="w-5 h-5" />
            <span>Rolling Enrollment - დაიწყე დღესვე</span>
          </div>
        </div>
      </div>
    </section>
  );
}
