import { Shield, Award, Users, Star, Zap, CheckCircle } from "lucide-react";

export function TrustIndicators() {
  const trustMetrics = [
    {
      icon: Users,
      number: "5,247",
      label: "კმაყოფილი სტუდენტი",
      subtitle: "2019 წლიდან"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "საშუალო შეფასება",
      subtitle: "Google Reviews-ზე"
    },
    {
      icon: Award,
      number: "98%",
      label: "კურსის დამთავრება",
      subtitle: "იმათგან ვინც დაიწყო"
    },
    {
      icon: Zap,
      number: "30 დღე",
      label: "გარანტია",
      subtitle: "100% თანხის დაბრუნება"
    }
  ];

  const certifications = [
    { name: "ISO 27001", description: "უსაფრთხოების სერტიფიკატი" },
    { name: "GDPR", description: "მონაცემთა დაცვა" },
    { name: "SSL", description: "დაცული კავშირი" }
  ];

  const mediaLogos = [
    { name: "Forbes Georgia", width: "120px" },
    { name: "Business Media", width: "100px" }, 
    { name: "Startup Georgia", width: "110px" },
    { name: "Tech.ge", width: "80px" }
  ];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Trust Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md mb-3 group-hover:shadow-lg transition-shadow">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-text-primary mb-1">{metric.number}</div>
                <div className="text-sm font-semibold text-text-secondary mb-1">{metric.label}</div>
                <div className="text-xs text-text-muted">{metric.subtitle}</div>
              </div>
            );
          })}
        </div>

        {/* Security & Certification Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {certifications.map((cert, index) => (
            <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="text-center">
                <div className="text-sm font-bold text-text-primary">{cert.name}</div>
                <div className="text-xs text-text-muted">{cert.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Media Mentions */}
        <div className="text-center mb-8">
          <div className="text-sm font-semibold text-text-secondary mb-6">
            რას ამბობენ ჩვენ შესახებ მედიაში
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {mediaLogos.map((logo, index) => (
              <div 
                key={index} 
                className="h-8 bg-text-muted rounded flex items-center justify-center px-4 text-white text-xs font-bold"
                style={{ width: logo.width }}
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>

        {/* Final Trust Statement */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">
              5+ წლის გამოცდილება • 100% უსაფრთხო გადახდა • 24/7 მხარდაჭერა
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}