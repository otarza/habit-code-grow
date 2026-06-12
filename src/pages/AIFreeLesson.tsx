import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { FreeLessonEmailGate } from "@/components/FreeLessonEmailGate";
import { PRODUCTS } from "@/lib/checkout";
import bitcampLogo from "@/assets/bitcamp-logo.png";

// Same video as the gated lesson at /learn/ai-pro/customer-profile/notebooklm-central-hub
// (public/learn-content/ai-pro/customer-profile/notebooklm-central-hub.md).
const LESSON_VIDEO_ID = "PqYK-h3eiPA";
const NOTEBOOK_URL =
  "https://notebooklm.google.com/notebook/a0564db3-4ed4-4708-9137-26003c68380c";

const CHECKOUT_URL = "/ai?ref=free-lesson#purchase";
const PRICE_LABEL = `₾${PRODUCTS.pro.value}`;

const bullets = [
  "6-მოდულიანი AI პროგრამა მენტორშიფით",
  "NotebookLM, ბიზნეს ამოცანები, Custom GPTs და n8n ავტომატიზაცია",
  "Python და SQL სრული კურსები ბონუსად",
];

const testimonials = [
  {
    quote: "მადლობა ძალიან საინტერესოდ და გასაგებად ხსნით.",
    name: "Lizi",
    note: "აქტიური მონაწილე · გასაგები ახსნა",
  },
  {
    quote: "დიდი მადლობა, ძალიან მომწონს კურსი, თანმიმდევრული და საინტერესოა და ასევე გადმოცემის ფორმა...",
    name: "Maia Pavliashvili",
    note: "აქტიური მონაწილე · თანმიმდევრული კურსი",
  },
  {
    quote: "დიდი მადლობა ბატონო ოთარ, სასიამოვნო და მეტად საინტერესოა თქვენი ლექციების მოსმენა.",
    name: "Aleqsandre Nucubidze",
    note: "აქტიური მონაწილე · საინტერესო ლექციები",
  },
];

type AnalyticsWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

function fireFreeLessonEvent(event: "FreeLessonView" | "FreeLessonCTAClick") {
  if (typeof window === "undefined") return;
  const win = window as AnalyticsWindow;
  win.fbq?.("trackCustom", event, { product: "ai-pro" });
  win.gtag?.("event", event, { product: "ai-pro" });
}

function goToCheckout() {
  fireFreeLessonEvent("FreeLessonCTAClick");
  window.location.href = CHECKOUT_URL;
}

function CtaButton({ label }: { label: string }) {
  return (
    <button type="button" className="campaign-cta" onClick={goToCheckout}>
      <span>{label}</span>
      <ArrowRight aria-hidden="true" size={18} />
    </button>
  );
}

function FreeLessonVideo() {
  return (
    <div className="campaign-hero-video free-lesson__video" aria-label="უფასო გაკვეთილის ვიდეო">
      <div className="free-lesson__video-frame">
        <iframe
          src={`https://www.youtube.com/embed/${LESSON_VIDEO_ID}?rel=0&modestbranding=1&controls=1`}
          title="NotebookLM - ის გამოყენება ცენტრალური ჰაბის შესაქმნელად"
          loading="lazy"
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default function AIFreeLesson() {
  return (
    <div className="campaign-page free-lesson">
      <Helmet>
        <meta name="robots" content="noindex" />
        <title>უფასო გაკვეთილი — NotebookLM ცენტრალური ჰაბი | BitCamp</title>
        <meta
          name="description"
          content="ნახე ერთი სრული გაკვეთილი BitCamp-ის AI Pro პროგრამიდან: NotebookLM-ის გამოყენება ცენტრალური ჰაბის შესაქმნელად."
        />
        <meta property="og:title" content="უფასო გაკვეთილი — NotebookLM ცენტრალური ჰაბი | BitCamp" />
        <meta
          property="og:description"
          content="ერთი სრული გაკვეთილი AI Pro პროგრამიდან: როგორ გამოიყენო NotebookLM ცენტრალური ცოდნის ჰაბის შესაქმნელად."
        />
        <meta property="og:image" content="https://www.bitcamp.ge/ai-meta.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <header className="campaign-header">
        <div className="campaign-shell campaign-header__inner">
          <img src={bitcampLogo} alt="BitCamp" />
        </div>
      </header>

      <main>
        <section className="free-lesson__top">
          <div className="free-lesson-shell">
            <p className="campaign-eyebrow">უფასო გაკვეთილი AI Pro პროგრამიდან</p>
            <h1 className="free-lesson__title">NotebookLM — შექმენი შენი ცენტრალური AI ჰაბი</h1>
            <p className="free-lesson__sub">
              ნახე ერთი სრული გაკვეთილი მენტორული AI Pro პროგრამიდან და გაიგე, როგორ გამოიყენო
              NotebookLM ცოდნის, წყაროებისა და სამუშაო მასალის ერთ სივრცეში მოსაწყობად.
            </p>

            <FreeLessonVideo />

            <div className="free-lesson__cta-card">
              <p className="free-lesson__bridge">
                გაკვეთილში შექმნილი Notebook-ის მისამართი:{" "}
                <a href={NOTEBOOK_URL} target="_blank" rel="noreferrer" className="campaign-text-link">
                  გახსენი NotebookLM-ში
                </a>
              </p>
              <p className="free-lesson__bridge">
                ეს არის ერთი გაკვეთილი სრული პროგრამიდან. დანარჩენ მოდულებში სწავლობ პრომპტინგს,
                ბიზნეს ამოცანებს, ვიზუალურ AI-ს, Custom GPTs-სა და n8n ავტომატიზაციას.
              </p>
              <CtaButton label={`შემოუერთდი პროგრამას — ${PRICE_LABEL}`} />
              <ul className="free-lesson__bullets">
                {bullets.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="free-lesson__proof">
          <div className="free-lesson-shell">
            <div className="campaign-section-heading free-lesson__proof-heading">
              <p className="campaign-kicker">სტუდენტების გამოცდილება</p>
              <h2>რას ამბობენ AI პროგრამის მონაწილეები.</h2>
            </div>
            <div className="campaign-testimonial-grid free-lesson__testimonial-grid">
              {testimonials.map((testimonial) => (
                <div className="campaign-testimonial" key={`${testimonial.name}-${testimonial.note}`}>
                  <blockquote>"{testimonial.quote}"</blockquote>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.note}</span>
                </div>
              ))}
            </div>
            <div className="free-lesson__closing-card">
              <div>
                <span>სრული AI Pro პროგრამა</span>
                <strong>6 მოდული + 4 კვირიანი მენტორშიფი</strong>
              </div>
              <p>
                თუ ეს გაკვეთილი სასარგებლო იყო, სრული პროგრამა დაგეხმარება იგივე მიდგომა გამოიყენო
                პრომპტინგში, ბიზნეს ამოცანებში, Custom GPTs-სა და n8n ავტომატიზაციაში.
              </p>
              <div className="free-lesson__closing-meta">
                <span>ერთჯერადი ფასი: {PRICE_LABEL}</span>
                <span>Python და SQL ბონუსად</span>
              </div>
              <CtaButton label={`შემოუერთდი პროგრამას — ${PRICE_LABEL}`} />
            </div>
          </div>
        </section>
      </main>

      <CampaignFooter />
      <FreeLessonEmailGate listKey="ai-pro" listId={4} productLabel="AI Pro" source="ai-free-lesson" />
    </div>
  );
}
