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
      subtitle: "T.C.R.E.I. ჩარჩო",
      icon: MessageSquare,
      color: "bg-green-500",
      badgeColor: "bg-green-100 text-green-700",
      borderColor: "border-green-500/30 hover:border-green-500/60",
      goal: "AI-სთან ეფექტური კომუნიკაციის ბაზის შექმნა და ხარისხიანი პასუხების მიღება.",
      topics: [
        { title: "შესავალი: LLM-ების მუშაობის პრინციპი", description: "როგორ მუშაობენ ენობრივი მოდელები, მათი შესაძლებლობების ზღვარი და რატომ არის პრომპტინგი 21-ე საუკუნის უმნიშვნელოვანესი უნარი." },
        { title: "დავალება (Task)", description: "როგორ ჩამოვაყალიბოთ კონკრეტული ქმედება და მივანიჭოთ AI-ს ექსპერტული როლი." },
        { title: "კონტექსტი (Context)", description: "დამატებითი ინფორმაციის მიწოდება — ვისთვის იწერება ტექსტი, რა არის მიზანი და გარემოებები." },
        { title: "წყაროები (References)", description: "მაგალითების მიწოდების ტექნიკა (Few-shot); როგორ ვასწავლოთ AI-ს ჩვენი წერის სტილი." },
        { title: "შეფასება და იტერაცია (Evaluate & Iterate)", description: "მიღებული პასუხის კრიტიკული ანალიზი და მისი დახვეწა სასურველ შედეგამდე." }
      ]
    },
    {
      id: 2,
      emoji: "🔵",
      title: "გაფართოებული ტექნიკები",
      subtitle: "Advanced Prompt Engineering",
      icon: Brain,
      color: "bg-blue-500",
      badgeColor: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-500/30 hover:border-blue-500/60",
      goal: "AI-ს ლოგიკური აზროვნების გახსნა და კომპლექსური ამოცანების მართვა.",
      topics: [
        { title: "აზროვნების ჯაჭვი (Chain of Thought)", description: "სპეციალური ინსტრუქციები, რომლებიც AI-ს აიძულებს ჯერ ლოგიკურად იმსჯელოს და მხოლოდ ამის შემდეგ მოგვცეს საბოლოო პასუხი." },
        { title: "პრომპტების ჯაჭვი (Prompt Chaining)", description: "დიდი პროექტების დაყოფა პატარა ნაბიჯებად, სადაც ერთი პრომპტის პასუხი ხდება მეორეს საფუძველი." },
        { title: "სტრუქტურირებული მონაცემები", description: "როგორ მივიღოთ პასუხი პროგრამული ფორმატით (JSON, CSV, Markdown) სხვა ხელსაწყოებთან ინტეგრაციისთვის." },
        { title: "ქართული ენის ოპტიმიზაცია", description: "ტექნიკები, რომლებიც AI-ს ეხმარება აირიდოს პირდაპირი თარგმანები და მოგვცეს ბუნებრივი ქართული ტექსტი." }
      ]
    },
    {
      id: 3,
      emoji: "🟠",
      title: "AI პროდუქტიულობაში",
      subtitle: "Business Use Cases",
      icon: Briefcase,
      color: "bg-orange-500",
      badgeColor: "bg-orange-100 text-orange-700",
      borderColor: "border-orange-500/30 hover:border-orange-500/60",
      goal: "AI-ს პრაქტიკული გამოყენება ბიზნეს პროცესების დასაჩქარებლად.",
      topics: [
        { title: "კონტენტ-მარკეტინგი", description: "ბლოგ-პოსტების, სოციალური მედიის კალენდრისა და SEO-ზე ოპტიმიზებული სტატიების ავტომატური გენერირება." },
        { title: "ბიზნეს ანალიტიკა", description: "ვრცელი PDF ანგარიშების სწრაფი შეჯამება, SWOT ანალიზის მომზადება და კონკურენტული გარემოს კვლევა." },
        { title: "კორპორატიული კომუნიკაცია", description: "პროფესიული იმეილების შედგენა სხვადასხვა ტონალობით და რთული მოლაპარაკებების სცენარების სიმულაცია." }
      ]
    },
    {
      id: 4,
      emoji: "🟣",
      title: "მულტიმოდალური AI",
      subtitle: "Vision & Creativity",
      icon: Image,
      color: "bg-purple-500",
      badgeColor: "bg-purple-100 text-purple-700",
      borderColor: "border-purple-500/30 hover:border-purple-500/60",
      goal: "მუშაობა ვიზუალებთან და მონაცემთა ფაილებთან.",
      topics: [
        { title: "სურათების გენერაცია", description: "მუშაობა DALL-E 3-სა და Midjourney-სთან — როგორ ავაგოთ ვიზუალური პრომპტი (კომპოზიცია, განათება, სტილი)." },
        { title: "AI მხედველობა (Vision)", description: "სურათებიდან ინფორმაციის ამოღება, ხელნაწერი ტექსტის გაციფრულება და გრაფიკების ვიზუალური ანალიზი." },
        { title: "მონაცემებთან საუბარი", description: "Excel და CSV ფაილების ატვირთვა, მონაცემთა გაწმენდა და რთული ფორმულების გარეშე მათი სტატისტიკური დამუშავება." }
      ]
    },
    {
      id: 5,
      emoji: "🔴",
      title: "პერსონალიზებული აგენტები",
      subtitle: "Custom GPTs & Gems",
      icon: Bot,
      color: "bg-red-500",
      badgeColor: "bg-red-100 text-red-700",
      borderColor: "border-red-500/30 hover:border-red-500/60",
      goal: "საკუთარი, სპეციალიზებული AI თანამშრომლების შექმნა.",
      topics: [
        { title: "Custom Instructions", description: "სისტემური პარამეტრების დაყენება, რათა AI-მ ყოველთვის იცოდეს თქვენი პრეფერენციები და სამუშაო სტილი." },
        { title: "საკუთარი GPT-ის შექმნა", description: "ნაბიჯ-ნაბიჯ ინსტრუქცია პერსონალური ბოტის ასაწყობად, რომელსაც ექნება წვდომა თქვენს პირად დოკუმენტაციაზე." },
        { title: "Action-ების საფუძვლები", description: "შესავალი იმაში, თუ როგორ დავაკავშიროთ Custom GPT სხვა აპლიკაციებთან API-ს მეშვეობით." }
      ]
    },
    {
      id: 6,
      emoji: "🔥",
      title: "AI ავტომატიზაცია და აგენტები",
      subtitle: "n8n-ით (AI Ops Architect)",
      icon: Workflow,
      color: "bg-gradient-to-r from-orange-500 to-red-600",
      badgeColor: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700",
      borderColor: "border-orange-500/30 hover:border-orange-500/60",
      goal: "ავტონომიური სისტემების/აგენტების აწყობა, რომლებიც ადამიანის ჩარევის გარეშე მუშაობენ.",
      topics: [
        { title: "n8n-ის საფუძვლები", description: "ვიზუალური დაპროგრამება, ნოუდების დაკავშირება, Cloud vs Self-hosted განსხვავებები." },
        { title: "JSON და Webhooks", description: "მონაცემთა გაცვლის ენა აპლიკაციებს შორის, If/Else ლოგიკა, მოსმენის რეჟიმი გარე მოვლენებზე." },
        { title: "RAG სისტემა & ვექტორული ბაზები", description: "AI აგენტის შექმნა თქვენს დოკუმენტებში ძიებით, Pinecone/Supabase, Embeddings." },
        { title: "Human-in-the-Loop & უსაფრთხოება", description: "დასტურის სისტემა, Error Handling, HTTP Request უნივერსალური ინტეგრაციებისთვის." },
        { title: "Master სცენარები", description: "ჭკვიანი კონტენტ-მენეჯერი, Support აგენტი, შეხვედრების ასისტენტი — პრაქტიკული ვორქშოპები." }
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
