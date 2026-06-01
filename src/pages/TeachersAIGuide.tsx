import { FormEvent, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Download,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import bitcampLogo from "@/assets/bitcamp-logo-main.png";

const TEACHER_GUIDE_API_URL =
  import.meta.env.VITE_TEACHER_GUIDE_API_URL ||
  "https://us-central1-bitcamp-flitt.cloudfunctions.net/teacher-guide-api";

const guideBenefits = [
  "როგორ დაზოგო ყოველდღიურად 2-3 საათი რუტინულ დავალებებზე",
  "როგორ გამოიყენო AI გაკვეთილის დაგეგმვაში, შეფასებასა და უკუკავშირში",
  "როგორ შექმნა ინდივიდუალური მასალები მოსწავლეების სუსტი წერტილებისთვის",
];

const teacherPainPoints = [
  "ნაშრომების გასწორება",
  "გაკვეთილების დაგეგმვა",
  "სლაიდების მომზადება",
  "შეფასებები და უკუკავშირი",
];

type SubmitState = "idle" | "submitting" | "success" | "error";

function getTrackingParams() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || "facebook",
    utmMedium: params.get("utm_medium") || "organic",
    utmCampaign: params.get("utm_campaign") || "teacher-ai-guide",
    fbclid: params.get("fbclid") || "",
  };
}

export default function TeachersAIGuide() {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const tracking = useMemo(getTrackingParams, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setError("");

    try {
      const response = await fetch(`${TEACHER_GUIDE_API_URL}/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "teacher-ai-guide-page",
          ...tracking,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Form submission failed");
      }

      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setError("ვერ გაიგზავნა. გადაამოწმე მონაცემები და სცადე თავიდან.");
    }
  };

  return (
    <div className="teacher-guide-page">
      <Helmet>
        <title>უფასო AI გზამკვლევი მასწავლებლებისთვის | BitCamp</title>
        <meta
          name="description"
          content="მიიღე უფასო გზამკვლევი მასწავლებლებისთვის: როგორ დაზოგო დრო AI ინსტრუმენტებით და გადახვიდე სწავლების ახალ ეტაპზე."
        />
        <meta property="og:title" content="უფასო AI გზამკვლევი მასწავლებლებისთვის | BitCamp" />
        <meta
          property="og:description"
          content="გადატვირთული მასწავლებლიდან — AI-ით აღჭურვილ პროფესიონალამდე."
        />
        <meta property="og:image" content="https://www.bitcamp.ge/favicon.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main className="relative min-h-screen overflow-hidden bg-[#05091d] text-[#fff4e8]">
        <div className="absolute inset-0 teacher-guide-grid" aria-hidden="true" />
        <div className="absolute left-0 right-0 top-0 h-1 bg-[#df3342]" aria-hidden="true" />

        <section className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="pb-2 pt-4 lg:py-12">
            <div className="mb-8 inline-block bg-[#fff4e8] p-3 shadow-[4px_4px_0_#df3342]">
              <img src={bitcampLogo} alt="BitCamp" className="h-auto w-32 sm:w-52" />
            </div>

            <p className="mb-4 inline-flex items-center gap-2 border border-[#df3342]/60 bg-[#df3342]/10 px-3 py-2 font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
              <Sparkles size={15} aria-hidden="true" />
              უფასო PDF გზამკვლევი მასწავლებლებისთვის
            </p>

            <h1 className="max-w-4xl text-3xl font-black leading-tight text-[#fff4e8] sm:text-5xl lg:text-6xl">
              გადატვირთული მასწავლებლიდან AI-ით აღჭურვილ პროფესიონალამდე
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-[#c7d3df] sm:mt-6 sm:text-xl sm:leading-8">
              მიიღე პრაქტიკული გზამკვლევი, რომელიც გაჩვენებს როგორ გადააბარო AI-ს რუტინული საქმეები და
              დაიბრუნო დრო მოსწავლეებთან ცოცხალი, შემოქმედებითი მუშაობისთვის.
            </p>

            <div className="mt-8 hidden max-w-2xl gap-3 sm:grid sm:grid-cols-2">
              {teacherPainPoints.map((item) => (
                <div key={item} className="flex items-center gap-3 border border-[#293a52] bg-[#0d1730] p-3">
                  <CheckCircle2 className="h-5 w-5 flex-none text-[#df3342]" aria-hidden="true" />
                  <span className="text-sm font-semibold text-[#fff4e8]">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 hidden flex-wrap gap-3 text-sm text-[#c7d3df] sm:flex">
              <span className="inline-flex items-center gap-2 border border-[#293a52] px-3 py-2">
                <Clock3 size={16} aria-hidden="true" />
                2-3 საათის დაზოგვის ჩარჩო
              </span>
              <span className="inline-flex items-center gap-2 border border-[#293a52] px-3 py-2">
                <BookOpenCheck size={16} aria-hidden="true" />
                პრაქტიკული მაგალითები
              </span>
              <span className="inline-flex items-center gap-2 border border-[#293a52] px-3 py-2">
                <Video size={16} aria-hidden="true" />
                უფასო მასტერკლასის მოწვევა
              </span>
            </div>
          </div>

          <div className="relative lg:py-12">
            <div className="teacher-guide-panel">
              <div className="teacher-guide-panel__cap" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              {submitState === "success" ? (
                <div className="relative z-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-[#1f8f56] text-white">
                    <Mail size={30} aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-black text-[#fff4e8]">გზამკვლევი გამოგზავნილია</h2>
                  <p className="mt-4 text-base leading-7 text-[#c7d3df]">
                    შეამოწმე ელფოსტა. წერილში დაგხვდება PDF-ის ჩამოსატვირთი ბმული და უფასო
                    მასტერკლასზე ერთი კლიკით რეგისტრაციის ღილაკი.
                  </p>
                  <p className="mt-4 border border-[#293a52] bg-[#071025] p-3 text-sm text-[#9fb0c3]">
                    თუ წერილი არ ჩანს, გადაამოწმე Promotions ან Spam ფოლდერი.
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative z-10">
                    <p className="mb-3 font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
                      ჩამოტვირთე ახლავე
                    </p>
                    <h2 className="text-2xl font-black text-[#fff4e8]">მიიღე უფასო გზამკვლევი ელფოსტაზე</h2>
                    <p className="mt-3 text-sm leading-6 text-[#c7d3df]">
                      ჩაწერე ელფოსტა და გზამკვლევის ბმულს მაშინვე გამოგიგზავნით.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
                    <label className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#fff4e8]">
                        <Mail size={16} aria-hidden="true" />
                        ელფოსტა
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        autoComplete="email"
                        placeholder="name@example.com"
                        className="teacher-guide-input"
                      />
                    </label>

                    {submitState === "error" && (
                      <p className="border border-[#df3342] bg-[#df3342]/10 p-3 text-sm font-semibold text-[#ffb3ad]">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitState === "submitting"}
                      className="teacher-guide-submit"
                    >
                      <span>{submitState === "submitting" ? "იგზავნება..." : "მომეცი უფასო გზამკვლევი"}</span>
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>

                    <p className="flex items-start gap-2 text-xs leading-5 text-[#9fb0c3]">
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-[#1f8f56]" aria-hidden="true" />
                      ელფოსტას გამოვიყენებთ გზამკვლევის და მასტერკლასის მოწვევის გამოსაგზავნად.
                    </p>
                  </form>
                </>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {guideBenefits.map((benefit, index) => (
                <div key={benefit} className="border border-[#293a52] bg-[#071025] p-4">
                  <span className="font-mono text-xs font-bold text-[#df3342]">0{index + 1}</span>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#fff4e8]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-t border-[#293a52] bg-[#071025] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-1 h-6 w-6 flex-none text-[#df3342]" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black text-[#fff4e8]">მასწავლებლის გამოცდილება რჩება მთავარ ძალად</h2>
                <p className="mt-2 text-sm leading-6 text-[#c7d3df]">
                  AI არ ცვლის პედაგოგს. ის აძლიერებს დაგეგმვას, შეფასებას და პერსონალიზაციას.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="mt-1 h-6 w-6 flex-none text-[#df3342]" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black text-[#fff4e8]">ბმული გაზომვადია</h2>
                <p className="mt-2 text-sm leading-6 text-[#c7d3df]">
                  ჩამოტვირთვები ითვლება, რომ დავინახოთ რამდენმა ადამიანმა მიიღო რეალური სარგებელი.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Video className="mt-1 h-6 w-6 flex-none text-[#df3342]" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-black text-[#fff4e8]">შემდეგი ნაბიჯი მასტერკლასია</h2>
                <p className="mt-2 text-sm leading-6 text-[#c7d3df]">
                  წერილიდან ერთი კლიკით დარეგისტრირდები უფასო მასტერკლასზე დამატებითი ფორმის გარეშე.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
