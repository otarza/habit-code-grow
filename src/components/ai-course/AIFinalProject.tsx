import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Workflow,
  MessageSquare,
  Database,
  Zap,
  ArrowRight,
  CheckCircle2,
  Trophy
} from "lucide-react";

export function AIFinalProject() {
  const projectExamples = [
    {
      title: "ჭკვიანი კონტენტ-მენეჯერი",
      description: "სიახლეების ავტომატური სკანირება, AI-ით დამუშავება და სოციალურ ქსელებში პუბლიკაცია.",
      modules: ["მოდული 2", "მოდული 3", "მოდული 6"]
    },
    {
      title: "Support აგენტი",
      description: "იმეილების კატეგორიზაცია, Knowledge Base-ში პასუხის მოძებნა და დრაფტის მომზადება.",
      modules: ["მოდული 5", "მოდული 6"]
    },
    {
      title: "შეხვედრების ასისტენტი",
      description: "აუდიო ჩანაწერის ტექსტად ქცევა, შეჯამება და დავალებების Trello-ში გაწერა.",
      modules: ["მოდული 4", "მოდული 6"]
    }
  ];

  const moduleFlow = [
    { icon: MessageSquare, label: "პრომპტინგი", color: "bg-green-500" },
    { icon: Database, label: "Knowledge Base", color: "bg-purple-500" },
    { icon: Workflow, label: "ავტომატიზაცია", color: "bg-orange-500" },
    { icon: Zap, label: "AI აგენტი", color: "bg-red-500" }
  ];

  return (
    <section id="final-project" className="py-20 bg-gradient-to-b from-muted/30 to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-premium/20 text-premium border-premium/30 px-4 py-2 text-sm font-semibold">
            ფინალური პროექტი
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            შექმენი შენი{" "}
            <span className="text-secondary">ავტონომიური AI სისტემა</span>
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            პროგრამის ბოლოს გექნება რეალური პროექტი, რომელიც აერთიანებს ყველა მოდულს და აგვარებს შენი ბიზნესის კონკრეტულ პრობლემას.
          </p>
        </div>

        {/* Module Flow Visualization */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-2">
            {moduleFlow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 ${step.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="mt-2 text-sm font-medium text-text-secondary">{step.label}</span>
                  </div>
                  {index < moduleFlow.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-text-secondary/50 mx-2 hidden sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Requirements */}
        <Card className="max-w-3xl mx-auto p-6 sm:p-8 border-2 border-premium/30 bg-gradient-to-br from-premium/5 to-transparent mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-premium" />
            <h3 className="text-2xl font-bold text-text-primary">პროექტის მოთხოვნები</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-text-secondary">
                <strong className="text-text-primary">n8n ავტომატიზაცია</strong> — მინიმუმ 5 ნოუდიანი workflow, რომელიც Webhook-ით იწყება
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-text-secondary">
                <strong className="text-text-primary">AI ინტეგრაცია</strong> — OpenAI ან Claude API-ს გამოყენება დახვეწილი პრომპტით
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-text-secondary">
                <strong className="text-text-primary">Knowledge Base</strong> — Custom GPT ან RAG სისტემა შენი დოკუმენტაციით
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-text-secondary">
                <strong className="text-text-primary">ბიზნეს პრობლემის გადაჭრა</strong> — რეალური use case, რომელიც დროს ზოგავს
              </span>
            </li>
          </ul>
        </Card>

        {/* Project Examples */}
        <div className="grid md:grid-cols-3 gap-6">
          {projectExamples.map((project, index) => (
            <Card
              key={index}
              className="p-6 border-2 border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <span className="text-secondary font-bold">{index + 1}</span>
                </div>
                <h4 className="font-bold text-text-primary">{project.title}</h4>
              </div>
              <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.modules.map((module, moduleIndex) => (
                  <Badge
                    key={moduleIndex}
                    variant="outline"
                    className="text-xs"
                  >
                    {module}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
