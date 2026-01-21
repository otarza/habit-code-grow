import { Bot, BarChart3, Workflow, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AIProjectShowcase() {
  const projects = [
    {
      icon: Bot,
      title: "ინტელექტუალური Chatbot",
      description: "ააშენე AI ასისტენტი, რომელიც პასუხობს მომხმარებლის კითხვებს შენი კომპანიის დოკუმენტაციაზე დაყრდნობით (RAG).",
      tech: ["Python", "OpenAI API", "LangChain"],
      useCase: "Customer Support Automation",
      color: "bg-blue-500"
    },
    {
      icon: BarChart3,
      title: "მონაცემთა ანალიზის Dashboard",
      description: "შექმენი სისტემა, რომელიც ავტომატურად ამუშავებს Excel/CSV ფაილებს და ვიზუალურ რეპორტებს აგენერირებს.",
      tech: ["Python", "SQL", "Pandas"],
      useCase: "Business Intelligence",
      color: "bg-green-500"
    },
    {
      icon: Workflow,
      title: "ბიზნეს პროცესების ავტომატიზაცია",
      description: "დააკავშირე Gmail, Slack და CRM ერთმანეთთან. შექმენი სისტემა, რომელიც მუშაობს შენს გარეშე.",
      tech: ["n8n", "APIs", "Webhooks"],
      useCase: "Operations Automation",
      color: "bg-purple-500"
    },
    {
      icon: Cpu,
      title: "პერსონალური AI აგენტი",
      description: "Capstone პროექტი: შექმენი ციფრული თანამშრომელი, რომელიც ასრულებს კონკრეტულ დავალებას ავტონომიურად.",
      tech: ["Full Stack", "All Technologies"],
      useCase: "Advanced AI Solution",
      color: "bg-orange-500"
    }
  ];

  return (
    <section id="projects" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/30 px-4 py-2 text-sm font-semibold">
            პრაქტიკული პროექტები
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            რას <span className="text-secondary">შექმნი</span> პროგრამის განმავლობაში?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            მხოლოდ თეორია არაფერია. შენ შეავსებ პორტფოლიოს 4 რეალური პროექტით, რითაც დამსაქმებელს შენს უნარებს დაუმტკიცებ.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <Card
                key={index}
                className="group relative p-8 border-2 border-gray-200 hover:border-primary/40 transition-all duration-300 hover:shadow-xl bg-white"
              >
                {/* Project Number Badge */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${project.color} rounded-xl mb-6 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                    ტექნოლოგიები:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Use Case */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-1 uppercase">
                    გამოყენება:
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    {project.useCase}
                  </p>
                </div>

                {/* Hover Effect Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`w-3 h-3 ${project.color} rounded-full animate-pulse`}></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-lg p-6">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              + შენი საკუთარი Capstone პროექტი
            </p>
            <p className="text-sm text-gray-600">
              პროგრამის ბოლოს, მენტორის დახმარებით, შექმნი შენთვის სასურველ ნებისმიერ AI სისტემას.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
