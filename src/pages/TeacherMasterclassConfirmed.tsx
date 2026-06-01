import { FormEvent, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CalendarDays, CalendarPlus, CheckCircle2, Clock3, Mail, Phone, User, Video } from "lucide-react";
import bitcampLogo from "@/assets/bitcamp-logo-main.png";

const TEACHER_GUIDE_API_URL =
  import.meta.env.VITE_TEACHER_GUIDE_API_URL ||
  "https://us-central1-bitcamp-flitt.cloudfunctions.net/teacher-guide-api";

const masterclassDetails = {
  title: "AI მასტერკლასი მასწავლებლებისთვის",
  date: "შაბათი, 6 ივნისი, 2026",
  time: "13:00 - 14:00 (საქართველოს დრო)",
  platform: "Google Meet",
  meetUrl: "https://meet.google.com/cjg-qjwi-cmm",
};

type SubmitState = "idle" | "submitting" | "success" | "error";

function getRegistrationToken() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("token") || "";
}

export default function TeacherMasterclassConfirmed() {
  const initialToken = useMemo(getRegistrationToken, []);
  const [activeToken, setActiveToken] = useState(initialToken);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const calendarUrl = activeToken
    ? `${TEACHER_GUIDE_API_URL}/calendar?token=${encodeURIComponent(activeToken)}`
    : "";

  useEffect(() => {
    if (!activeToken) return;

    let isCancelled = false;

    async function loadRegistration() {
      try {
        const response = await fetch(`${TEACHER_GUIDE_API_URL}/registration?token=${encodeURIComponent(activeToken)}`);
        const result = await response.json().catch(() => ({}));
        if (!isCancelled && response.ok && result.ok && result.email) {
          setRegisteredEmail(result.email);
          setEmail(result.email);
        }
      } catch {
        // The page remains useful even if the reassurance email lookup fails.
      }
    }

    loadRegistration();

    return () => {
      isCancelled = true;
    };
  }, [activeToken]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setError("");

    try {
      const response = await fetch(`${TEACHER_GUIDE_API_URL}/masterclass-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: activeToken, email, name, phone, subject }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Details submission failed");
      }

      if (result.token) {
        setActiveToken(result.token);
      }
      if (result.email) {
        setRegisteredEmail(result.email);
        setEmail(result.email);
      }
      setSubmitState("success");
    } catch {
      setSubmitState("error");
      setError(activeToken ? "დეტალები ვერ შეინახა. სცადე თავიდან." : "რეგისტრაცია ვერ დასრულდა. გადაამოწმე ელფოსტა და სცადე თავიდან.");
    }
  };

  return (
    <main className="w-full overflow-x-hidden bg-[#05091d] px-4 py-8 text-[#fff4e8] sm:px-6 lg:min-h-screen lg:px-8">
      <Helmet>
        <title>მასტერკლასზე რეგისტრაცია დადასტურდა | BitCamp</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto mb-6 w-full max-w-6xl lg:hidden">
        <div className="inline-block bg-[#fff4e8] p-2 shadow-[3px_3px_0_#df3342]">
          <img src={bitcampLogo} alt="BitCamp" className="h-auto w-28" />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="order-2 min-w-0 lg:order-1">
          <div className="mb-10 hidden self-start bg-[#fff4e8] p-3 shadow-[4px_4px_0_#df3342] lg:inline-block">
            <img src={bitcampLogo} alt="BitCamp" className="h-auto w-40 sm:w-48" />
          </div>

          <section className="min-w-0 border border-[#293a52] bg-[#071025] p-6 shadow-[4px_4px_0_#df3342] sm:p-10 sm:shadow-[8px_8px_0_#df3342]">
            <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#1f8f56] text-white">
              <CheckCircle2 size={34} aria-hidden="true" />
            </div>

            <p className="mb-3 font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
              {registeredEmail
                ? `რეგისტრაცია დადასტურდა თქვენს მისამართზე: ${registeredEmail}`
                : activeToken
                  ? "რეგისტრაცია დადასტურდა"
                  : "მასტერკლასზე რეგისტრაცია"}
            </p>
            <h1 className="break-words text-3xl font-black leading-tight sm:text-4xl">{masterclassDetails.title}</h1>
            <div className="mt-5 border border-[#df3342] bg-[#df3342]/10 p-4">
              <p className="flex items-start gap-3 text-base font-black leading-7 text-[#fff4e8]">
                <CalendarDays className="mt-1 h-5 w-5 flex-none text-[#ffb3ad]" aria-hidden="true" />
                <span>
                  {masterclassDetails.date} · {masterclassDetails.time}
                </span>
              </p>
            </div>
            <p className="mt-4 text-base leading-7 text-[#c7d3df]">
              {activeToken
                ? "შენი ადგილი უფასო მასტერკლასზე უკვე შენახულია. ქვემოთ შეგიძლია დაამატო დეტალები, რომ მასტერკლასი შენს რეალურ საჭიროებებს უკეთ მოვარგოთ."
                : "შეიყვანე ელფოსტა და დაგარეგისტრირებთ მასტერკლასზე. თუ გზამკვლევი ჯერ არ მიგიღია, მასაც გამოგიგზავნით."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="border border-[#293a52] p-4">
                <CalendarDays className="mb-3 h-5 w-5 text-[#df3342]" aria-hidden="true" />
                <strong className="block text-sm text-[#fff4e8]">{masterclassDetails.date}</strong>
              </div>
              <div className="border border-[#293a52] p-4">
                <Clock3 className="mb-3 h-5 w-5 text-[#df3342]" aria-hidden="true" />
                <strong className="block text-sm text-[#fff4e8]">{masterclassDetails.time}</strong>
              </div>
              <div className="border border-[#293a52] p-4">
                <Video className="mb-3 h-5 w-5 text-[#df3342]" aria-hidden="true" />
                <strong className="block text-sm text-[#fff4e8]">{masterclassDetails.platform}</strong>
              </div>
            </div>

            <p className="mt-8 flex items-start gap-3 border border-[#293a52] bg-[#05091d] p-4 text-sm leading-6 text-[#c7d3df]">
              <Mail className="mt-0.5 h-5 w-5 flex-none text-[#df3342]" aria-hidden="true" />
              Google Meet-ის ბმულს ელფოსტითაც მიიღებ და კალენდრის ჩანაწერშიც დაემატება: {masterclassDetails.meetUrl}
            </p>
          </section>
        </div>

        <section className="teacher-guide-panel order-1 min-w-0 max-w-full lg:order-2">
          <div className="teacher-guide-panel__cap" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="font-mono text-xs font-bold uppercase tracking-normal text-[#ffb3ad]">
                ვეპატიჟებით მასწავლებლებს
              </p>
              <span className="inline-flex items-center border border-[#df3342] bg-[#fff4e8] px-3 py-1 font-mono text-xs font-black uppercase tracking-normal text-[#df3342] shadow-[3px_3px_0_rgba(223,51,66,0.55)]">
                უფასო
              </span>
            </div>
            <h2 className="break-words text-2xl font-black leading-tight text-[#fff4e8]">
              რეგისტრაცია მასწავლებლების AI მასტერკლასზე
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#c7d3df]">
              მოგვაწოდე დამატებითი დეტალები შენზე - რათა უკეთ გავიგოთ რას ასწავლი და რა მაგალითები იქნება
              შენთვის ყველაზე სასარგებლო მასტერკლასზე დასწრებისას.
            </p>
          </div>

          {submitState === "success" ? (
            <div className="relative z-10 mt-6 border border-[#1f8f56] bg-[#1f8f56]/10 p-4">
              <h3 className="font-black text-[#fff4e8]">დეტალები შენახულია</h3>
              <p className="mt-2 text-sm leading-6 text-[#c7d3df]">
                მადლობა. ახლა უკვე უფრო ზუსტად შევძლებთ მასტერკლასის მაგალითების მორგებას.
              </p>
              {calendarUrl && (
                <a href={calendarUrl} className="mt-5 inline-flex items-center gap-2 bg-[#df3342] px-5 py-3 font-black text-[#fff4e8] transition-colors hover:bg-[#c62a39]">
                  <CalendarPlus size={18} aria-hidden="true" />
                  Add to calendar
                </a>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
              {!activeToken && (
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
              )}

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#fff4e8]">
                  <User size={16} aria-hidden="true" />
                  სახელი
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  placeholder="შენი სახელი"
                  className="teacher-guide-input"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#fff4e8]">
                  <Phone size={16} aria-hidden="true" />
                  ტელეფონის ნომერი
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  autoComplete="tel"
                  placeholder="+995 5XX XX XX XX"
                  className="teacher-guide-input"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-bold text-[#fff4e8]">
                  <Mail size={16} aria-hidden="true" />
                  საგანი / მიმართულება
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  placeholder="მაგ. მათემატიკა, ინგლისური, დაწყებითი კლასები"
                  className="teacher-guide-input"
                />
              </label>

              {submitState === "error" && (
                <p className="border border-[#df3342] bg-[#df3342]/10 p-3 text-sm font-semibold text-[#ffb3ad]">
                  {error}
                </p>
              )}

              <button type="submit" disabled={submitState === "submitting"} className="teacher-guide-submit">
                {submitState === "submitting"
                  ? "ინახება..."
                  : activeToken
                    ? "დეტალების შენახვა"
                    : "რეგისტრაცია და დეტალების შენახვა"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
