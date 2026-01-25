import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Brain,
  Briefcase,
  Image,
  Bot,
  Workflow,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { PixelGrid } from "@/components/PixelBackground";

interface ModuleData {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  badgeColor: string;
  borderColor: string;
  goal: string;
  topics: {
    title: string;
    description: string;
  }[];
}

export function AICurriculumModules() {
  const [expandedModule, setExpandedModule] = useState<number | null>(1);

  const modules: ModuleData[] = [
    {
      id: 1,
      emoji: "🟢",
      title: "ფუნდამენტური პრომპტინგი",
      subtitle: "AI-სთან საუბრის ხელოვნება",
      icon: MessageSquare,
      color: "bg-green-500",
      badgeColor: "bg-green-100 text-green-700",
      borderColor: "border-green-500/30 hover:border-green-500/60",
      goal: "ისწავლი, როგორ გააგებინო AI-ს ზუსტად ის, რაც გინდა — პირველივე ცდაზე.",
      topics: [
        { title: "LLM-ების ფსიქოლოგია", description: "როგორ 'აზროვნებს' მანქანა და რატომ არ პასუხობს ზოგჯერ ისე, როგორც გვინდა." },
        { title: "T.C.R.E.I. ფორმულა", description: "ჩვენი უნიკალური ჩარჩო იდეალური პრომპტის შესადგენად, რომელიც ყოველთვის მუშაობს." },
        { title: "კონტექსტის მიცემა", description: "როგორ ავუხსნათ AI-ს სიტუაცია ისე, როგორც ახალ თანამშრომელს." },
        { title: "Few-Shot Prompting", description: "მაგალითების მიცემის ტექნიკა, რითაც AI ზუსტად იმეორებს შენს სტილს და ტონალობას." },
        { title: "ჰალუცინაციების მართვა", description: "როგორ ამოვიცნოთ და შევამციროთ AI-ს მიერ გამოგონილი ფაქტები." }
      ]
    },
    {
      id: 2,
      emoji: "🔵",
      title: "Advanced Prompting",
      subtitle: "აზროვნების მოდელები & ლოგიკა",
      icon: Brain,
      color: "bg-blue-500",
      badgeColor: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-500/30 hover:border-blue-500/60",
      goal: "გადააქციე AI უბრალო ჩატბოტიდან ლოგიკურად მოაზროვნე პარტნიორად.",
      topics: [
        { title: "Chain of Thought (CoT)", description: "როგორ ვაიძულოთ AI, ჯერ იფიქროს და შემდეგ გვიპასუხოს (რაც რადიკალურად ზრდის სიზუსტეს)." },
        { title: "Prompt Chaining", description: "რთული დავალებების დაშლა ნაბიჯებად, სადაც ერთი პასუხი მეორეს კვებავს." },
        { title: "სტრუქტურირებული პასუხები", description: "პასუხების მიღება ცხრილებში, JSON-ში ან CSV-ში პირდაპირი გამოყენებისთვის." },
        { title: "ქართული ენის 'ჰაკები'", description: "სპეციალური ტექნიკები, რომ AI-მ წეროს გამართული, ბუნებრივი ქართულით (და არა 'რობოტულად')." }
      ]
    },
    {
      id: 3,
      emoji: "🟠",
      title: "პროდუქტიულობა & ბიზნესი",
      subtitle: "10x შედეგი ნაკლებ დროში",
      icon: Briefcase,
      color: "bg-orange-500",
      badgeColor: "bg-orange-100 text-orange-700",
      borderColor: "border-orange-500/30 hover:border-orange-500/60",
      goal: "კონკრეტული ბიზნეს-ამოცანების გადაჭრა წამებში და არა საათებში.",
      topics: [
        { title: "კონტენტ-მენეჯერი", description: "ბლოგების, პოსტებისა და სტატიების გენერაცია SEO-ს სრული დაცვით." },
        { title: "დოკუმენტების ანალიზი", description: "ასობით გვერდიანი PDF-ების და რეპორტების წაკითხვა/შეჯამება წამებში." },
        { title: "კორპორატიული მიმოწერა", description: "რთული იმეილებისა და მოლაპარაკებების სცენარების სიმულაცია." }
      ]
    },
    {
      id: 4,
      emoji: "🟣",
      title: "ვიზუალური AI (Multimodal)",
      subtitle: "DALL-E, Midjourney & Vision",
      icon: Image,
      color: "bg-purple-500",
      badgeColor: "bg-purple-100 text-purple-700",
      borderColor: "border-purple-500/30 hover:border-purple-500/60",
      goal: "ისწავლე სურათების შექმნა და ვიზუალური ინფორმაციის დამუშავება.",
      topics: [
        { title: "სურათების გენერაცია", description: "როგორ შევქმნათ ფოტო-რეალისტური სურათები DALL-E 3-ით და Midjourney-ით." },
        { title: "ვიზუალური ანალიზი (Vision)", description: "სურათიდან ტექსტის, ცხრილების და ემოციების წაკითხვა." },
        { title: "მონაცემთა ვიზუალიზაცია", description: "Excel-ის ფაილების ატვირთვა და გრაფიკების აგება პირდაპირ ჩატში." }
      ]
    },
    {
      id: 5,
      emoji: "🔴",
      title: "პერსონალური აგენტები",
      subtitle: "Custom GPTs",
      icon: Bot,
      color: "bg-red-500",
      badgeColor: "bg-red-100 text-red-700",
      borderColor: "border-red-500/30 hover:border-red-500/60",
      goal: "შექმენი შენი პირადი 'თანამშრომლები', რომლებმაც იციან შენი საქმე.",
      topics: [
        { title: "Custom Instructions", description: "როგორ მოვარგოთ ChatGPT შენს პიროვნებას და მოთხოვნებს." },
        { title: "საკუთარი GPT-ის შექმნა", description: "პერსონალური ბოტის აწყობა, რომელსაც აქვს წვდომა შენს ფაილებზე (Knowledge Base)." },
        { title: "აგენტის გაზიარება", description: "როგორ გავხადოთ ჩვენი შექმნილი ბოტი ხელმისაწვდომი გუნდისთვის ან კლიენტებისთვის." }
      ]
    },
    {
      id: 6,
      emoji: "🔥",
      title: "ავტომატიზაცია (n8n)",
      subtitle: "რეალური ავტონომია",
      icon: Workflow,
      color: "bg-gradient-to-r from-orange-500 to-red-600",
      badgeColor: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700",
      borderColor: "border-orange-500/30 hover:border-orange-500/60",
      goal: "კურსის გვირგვინი — სისტემები, რომლებიც მუშაობენ მაშინაც, როცა გძინავს.",
      topics: [
        { title: "რა არის n8n?", description: "შესავალი ვიზუალურ ავტომატიზაციაში — კოდის წერის გარეშე." },
        { title: "Webhooks & API", description: "როგორ დავაკავშიროთ Facebook, Google Sheets, Gmail და Telegram ერთმანეთს." },
        { title: "ჭკვიანი AI აგენტი", description: "სისტემა, რომელიც იღებს იმეილს, აანალიზებს, პოულობს პასუხს და გიგზავნის დრაფტს." },
        { title: "Human-in-the-Loop", description: "როგორ დავტოვოთ კონტროლის მექანიზმები ავტომატურ სისტემებში." },
        { title: "ფინალური პროექტი", description: "შენი საკუთარი, მუშა ავტომატიზაციის სისტემის აწყობა ნოლიდან." }
      ]
    }
  ];

  const toggleModule = (moduleId: number) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <section id="curriculum" className="relative py-20 bg-muted/30 pixel-bg">
      <PixelGrid />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 px-4 py-2 text-sm font-semibold">
            სრული სასწავლო პროგრამა
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            6 მოდული:{" "}
            <span className="text-secondary">ნულიდან AI არქიტექტორამდე</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            ყოველი მოდული აგებულია წინაზე. დაიწყე საფუძვლებით და დაამთავრე ავტონომიური AI სისტემების აწყობით.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="space-y-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const isExpanded = expandedModule === module.id;

            return (
              <Card
                key={module.id}
                className={`overflow-hidden border-2 transition-all duration-300 ${module.borderColor} ${isExpanded ? 'shadow-xl' : 'shadow-md'}`}
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-6 sm:p-8 flex items-start sm:items-center gap-4 sm:gap-6 text-left hover:bg-muted/50 transition-colors"
                >
                  {/* Module Number & Icon */}
                  <div className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 ${module.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={`${module.badgeColor} text-xs font-bold`}>
                        მოდული {module.id}
                      </Badge>
                      <span className="text-lg">{module.emoji}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-1">
                      {module.title}
                    </h3>
                    <p className="text-text-secondary text-sm sm:text-base">
                      {module.subtitle}
                    </p>
                  </div>

                  {/* Expand/Collapse Icon */}
                  <div className="flex-shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-text-secondary" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-text-secondary" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 sm:px-8 pb-6 sm:pb-8 border-t border-primary/10">
                    {/* Goal */}
                    <div className="mt-6 mb-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-accent">მოდულის მიზანი:</span>
                      </div>
                      <p className="text-text-secondary">{module.goal}</p>
                    </div>

                    {/* Topics */}
                    <div className="space-y-4">
                      {module.topics.map((topic, topicIndex) => (
                        <div
                          key={topicIndex}
                          className="flex items-start gap-4 p-4 bg-card rounded-lg border border-primary/10 hover:border-primary/20 transition-colors"
                        >
                          <div className={`flex-shrink-0 w-8 h-8 ${module.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                            {topicIndex + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-text-primary mb-1">
                              {topic.title}
                            </h4>
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Topics Count */}
                    <div className="mt-6 flex items-center gap-2 text-sm text-text-secondary">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>{module.topics.length} თემა ამ მოდულში</span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button
            variant="hero"
            size="lg"
            className="pixel-btn"
            onClick={() => {
              const pricingElement = document.getElementById('pricing');
              if (pricingElement) {
                pricingElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Sparkles className="w-5 h-5" />
            <span>ჩაეწერე პროგრამაზე</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
