import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Users, Code, Database, Facebook, Zap } from "lucide-react";
import { tracking } from "@/utils/tracking";
import { TallyModal, useTallyModal } from "@/components/TallyModal";

export function FreeCoursesSection() {
  const { isOpen: isFreeCoursesModalOpen, openModal: openFreeCoursesModal, closeModal: closeFreeCoursesModal } = useTallyModal();

  const courses = [
    {
      title: "Python პროგრამირება",
      icon: "🐍",
      description: "დაიწყე პროგრამირების სწავლა Python-ით",
      color: "bg-secondary"
    },
    {
      title: "SQL მონაცემთა ბაზები",
      icon: "🗄️",
      description: "ისწავლე მონაცემთა ბაზების საფუძვლები",
      color: "bg-accent"
    },
    {
      title: "HTML/CSS & JavaScript",
      icon: "🌐",
      description: "ისწავლე ვებ-გვერდების შექმნის საფუძვლები",
      color: "bg-blue-500"
    },
    {
      title: "კომპიუტერული მეცნიერება",
      icon: "💻",
      description: "გაეცანი CS-ის ფუნდამენტურ ცნებებს",
      color: "bg-purple-500"
    },
    {
      title: "React",
      icon: "⚛️",
      description: "ისწავლე React ბიბლიოთეკა UI შესაქმნელად",
      color: "bg-cyan-500"
    },
    {
      title: "Java პროგრამირება",
      icon: "♨️",
      description: "შეისწავლე Java პროგრამირების ენა",
      color: "bg-orange-500"
    },
    {
      title: "Angular",
      icon: "🅰️",
      description: "ისწავლე თანამედროვე Front-End აპლიკაციების შექმნა Angular - ით",
      color: "bg-red-500"
    }
  ];

  return (
    <section id="free-courses" className="py-20 bg-gradient-to-b from-background to-surface overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-12 px-2 sm:px-0">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-6 max-w-full">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">დაიწყე რისკის გარეშე - 100% უფასოდ</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4 flex items-center justify-center gap-3">
            BitCamp - ის უფასო კურსები პროგრამირებაში
            <span className="text-3xl">🎁</span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-2 sm:px-0">
            გაეცანი ჩვენს სასწავლო მეთოდს და მიიღე ღირებული ცოდნა სრულიად უფასოდ.
            ამ კურსებით 50K+ ადამიანმა დაიწყო გზა ტექნოლოგიურ კარიერაში.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12">
          {courses.map((course, index) => (
            <Card key={index} className="relative p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
              {/* Free Badge */}
              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                უფასო
              </div>

              <div className={`w-16 h-16 ${course.color} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
                {course.icon}
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2 break-words">
                {course.title}
              </h3>
              <p className="text-text-secondary mb-4 flex-grow">
                {course.description}
              </p>
              <Button
                variant="outline"
                className="w-full mt-auto"
                onClick={() => {
                  tracking.courseInterest(`free-course-${course.title}`);
                  openFreeCoursesModal();
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                დაიწყე სწავლა
              </Button>
            </Card>
          ))}

          {/* Premium Training Card */}
          <Card className="relative p-4 sm:p-6 h-full flex flex-col overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => {
              tracking.courseInterest('premium-training-consultation');
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {/* Paid Badge */}
            <div className="absolute top-3 right-3 z-20 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              ფასიანი
            </div>

            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-accent opacity-90 animate-gradient-xy"></div>

            {/* Animated particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute w-32 h-32 bg-white/10 rounded-full -top-10 -left-10 animate-pulse"></div>
              <div className="absolute w-24 h-24 bg-white/10 rounded-full top-20 -right-8 animate-pulse delay-300"></div>
              <div className="absolute w-16 h-16 bg-white/10 rounded-full bottom-10 left-1/2 animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 break-words">
                პირადი სამენტორო 🚀
              </h3>
              <p className="text-white/90 mb-4 flex-grow">
                მიიღე პერსონალური მხარდაჭერა და ისწავლე გაცილებით ეფექტურად
              </p>
              <Button variant="secondary" className="w-full mt-auto bg-white text-primary hover:bg-white/90 font-bold group-hover:shadow-xl transition-all">
                <Zap className="w-4 h-4 mr-2" />
                კონსულტაცია
              </Button>
            </div>
          </Card>
        </div>

        {/* Tally Modal for Free Courses */}
        <TallyModal
          isOpen={isFreeCoursesModalOpen}
          onClose={closeFreeCoursesModal}
          formUrl="https://tally.so/embed/wQ6DPk"
          title="მიიღე წვდომა უფასო კურსებზე"
        />

        <Card className="p-4 sm:p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 max-w-3xl mx-auto">
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

        <div className="text-center mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-2xl p-4 sm:p-8 max-w-3xl mx-auto">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-3">
            მოგეწონა ჩვენი უფასო კურსები?
          </h3>
          <p className="text-sm sm:text-base text-text-secondary mb-6">
            შემოგვიერთდი ჩვენს სამენტორო პროგრამაზე სადაც ვიზრუნებთ შენს სწრაფ ზრდასა და განვითარებაზე.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="group w-full sm:w-auto"
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-sm sm:text-base">იხილე სამენტორო პროგრამები</span>
            <Code className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </Button>
        </div>
      </div>
    </section>
  );
}