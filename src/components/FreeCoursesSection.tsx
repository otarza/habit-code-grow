import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Users, Code, Database, Facebook } from "lucide-react";
import { tracking } from "@/utils/tracking";

export function FreeCoursesSection() {
  const courses = [
    {
      title: "Python პროგრამირება",
      icon: "🐍",
      description: "დაიწყე პროგრამირების სწავლა Python-ით",
      link: "https://forms.gle/2e5mE5b3xaGb8g1U8",
      color: "bg-secondary"
    },
    {
      title: "SQL მონაცემთა ბაზები",
      icon: "🗄️",
      description: "ისწავლე მონაცემთა ბაზების საფუძვლები",
      link: "https://forms.gle/iand6o4N2aRRBxoC6",
      color: "bg-accent"
    },
    {
      title: "Java პროგრამირება",
      icon: "♨️",
      description: "შეისწავლე Java პროგრამირების ენა",
      link: "https://www.bitcamp.ge/courses/java/",
      color: "bg-orange-500"
    },
    {
      title: "Angular",
      icon: "🅰️",
      description: "ისწავლე თანამედროვე Front-End აპლიკაციების შექმნა Angular - ით",
      link: "https://www.bitcamp.ge/courses/angular/",
      color: "bg-red-500"
    }
  ];

  return (
    <section id="free-courses" className="py-20 bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>დაიწყე რისკის გარეშე - 100% უფასოდ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            აირჩიე შენი პირველი უფასო კურსი
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            გაეცანი ჩვენს სასწავლო მეთოდს და მიიღე ღირებული ცოდნა სრულიად უფასოდ.
            ამ კურსებით 5000+ ადამიანმა დაიწყო გზა ტექნოლოგიურ კარიერაში.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {courses.map((course, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              <div className={`w-16 h-16 ${course.color} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
                {course.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {course.title}
              </h3>
              <p className="text-text-secondary mb-4 flex-grow">
                {course.description}
              </p>
              <a 
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => tracking.courseInterest(`free-course-${course.title}`)}
                className="mt-auto"
              >
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  დაიწყე სწავლა
                </Button>
              </a>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                შემოუერთდი BitCamp საზოგადოებას
              </h3>
              <p className="text-text-secondary mb-4">
                უფასო კურსების დაწყებით ავტომატურად ხდები BitCamp - ის საზოგადოების წევრი.
                მიიღე წვდომა Discord სერვერზე, სადაც შეგიძლია დახმარება სთხოვო საზოგადოების სხვა წევრებს.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>55k აქტიური წევრი Facebook ჯგუფში</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.facebook.com/groups/bitcamp.ge"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => tracking.courseInterest('facebook-group')}
                  className="flex-1"
                >
                  <Button variant="default" className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook ჯგუფი
                  </Button>
                </a>
                <a
                  href="https://discord.gg/AGAW3xmGPr"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => tracking.courseInterest('discord-community')}
                  className="flex-1"
                >
                  <Button variant="default" className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Discord სერვერი
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
            მოგეწონა რასაც ნახე?
          </h3>
          <p className="text-text-secondary mb-6">
            როცა მზად იქნები სერიოზული ტრანსფორმაციისთვის და გინდა პირადი მენტორის მხარდაჭერა,
            გაეცანი ჩვენს სამენტორო პროგრამებს სადაც 0-დან ვიწყებთ და გიწევთ მხარს ყოველ ნაბიჯზე.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="group"
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            იხილე სამენტორო პროგრამები
            <Code className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}