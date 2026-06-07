import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Volume2 } from "lucide-react";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { PRODUCTS } from "@/lib/checkout";
import bitcampLogo from "@/assets/bitcamp-logo.png";

// Same video as the gated lesson at /learn/ai-bootcamp/fundamentals/tcrei-model
// (public/learn-content/ai-bootcamp/fundamentals/tcrei-model.md → YouTube).
const LESSON_VIDEO_ID = "meGlYoD5ndc";
const buildLessonSrc = (muted: boolean) =>
  `https://www.youtube.com/embed/${LESSON_VIDEO_ID}?autoplay=1&mute=${
    muted ? 1 : 0
  }&playsinline=1&rel=0&modestbranding=1`;

// Warm viewers go straight to the existing /ai-bootcamp checkout (buy card).
// `ref` = attribution, `#purchase` = scroll target added on the landing page.
const CHECKOUT_URL = "/ai-bootcamp?ref=free-lesson#purchase";

// Price is owned by the checkout config so this label stays in sync with /ai-bootcamp.
const PRICE_LABEL = `₾${PRODUCTS.bootcamp.value}`;

const bullets = [
  "25 ვიდეო გაკვეთილი, მოკლე და პრაქტიკული",
  "Python და SQL სრული კურსები ბონუსად",
  "50+ მზა პრომპტის ბიბლიოთეკა",
];

type AnalyticsWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

function fireFreeLessonEvent(event: "FreeLessonView" | "FreeLessonCTAClick") {
  if (typeof window === "undefined") return;
  const win = window as AnalyticsWindow;
  // Meta Pixel custom event — builds the retargeting audience / measures intent.
  win.fbq?.("trackCustom", event);
  // Mirror to GA for parity with the rest of the site's dual tracking.
  win.gtag?.("event", event);
}

function goToCheckout() {
  fireFreeLessonEvent("FreeLessonCTAClick");
  // Full navigation so the landing page's global PageView re-fires and the
  // existing Flitt checkout initialises fresh.
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
  const [soundOn, setSoundOn] = useState(false);
  const viewedRef = useRef(false);

  const enableSound = () => {
    // First genuine interaction with the player = "watched the lesson" signal.
    if (!viewedRef.current) {
      viewedRef.current = true;
      fireFreeLessonEvent("FreeLessonView");
    }
    setSoundOn(true);
  };

  return (
    <div className="campaign-hero-video free-lesson__video" aria-label="უფასო გაკვეთილის ვიდეო">
      <iframe
        // Swapping the key forces a reload with sound on — the click is a user
        // gesture, so the browser allows un-muted autoplay (same pattern as /ai-bootcamp).
        key={soundOn ? "sound-on" : "muted"}
        src={buildLessonSrc(!soundOn)}
        title="T.C.R.E.I. პრაქტიკაში — უფასო გაკვეთილი"
        loading="eager"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
      />
      <button
        type="button"
        className={`campaign-hero-video__sound${soundOn ? " is-on" : ""}`}
        onClick={enableSound}
        disabled={soundOn}
      >
        <Volume2 aria-hidden="true" size={16} />
        <span>{soundOn ? "ხმა ჩართულია" : "ჩართე ხმა"}</span>
      </button>
    </div>
  );
}

export default function AIBootcampFreeLesson() {
  return (
    <div className="campaign-page free-lesson">
      <Helmet>
        <meta name="robots" content="noindex" />
        <title>უფასო გაკვეთილი — T.C.R.E.I. პრაქტიკაში | BitCamp</title>
        <meta
          name="description"
          content="ნახე ერთი სრული გაკვეთილი BitCamp-ის AI Bootcamp-იდან: T.C.R.E.I. რეალურ მაგალითზე, ChatGPT-ით."
        />
        <meta property="og:title" content="უფასო გაკვეთილი — T.C.R.E.I. პრაქტიკაში | BitCamp" />
        <meta
          property="og:description"
          content="ერთი სრული გაკვეთილი ჩვენი AI Bootcamp-იდან. ნახე როგორ მუშაობს T.C.R.E.I. რეალურ მაგალითზე."
        />
        <meta property="og:image" content="https://www.bitcamp.ge/ai-meta.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Minimal header — logo only, nowhere to click but down the page */}
      <header className="campaign-header">
        <div className="campaign-shell campaign-header__inner">
          <img src={bitcampLogo} alt="BitCamp" />
        </div>
      </header>

      <main>
        <section className="free-lesson__top">
          <div className="free-lesson-shell">
            <p className="campaign-eyebrow">უფასო გაკვეთილი AI Bootcamp-იდან</p>
            <h1 className="free-lesson__title">T.C.R.E.I. პრაქტიკაში — ნახე სანამ გადაწყვეტ</h1>
            <p className="free-lesson__sub">
              ერთი სრული გაკვეთილი ჩვენი AI Bootcamp-იდან. ნახე როგორ მუშაობს T.C.R.E.I. რეალურ
              მაგალითზე — ChatGPT-ით, ცოცხლად.
            </p>

            <FreeLessonVideo />
            <p className="free-lesson__hint">ხმა ჩართე და უყურე ბოლომდე 🔊</p>

            {/* CTA section — directly below the video, no dead space */}
            <div className="free-lesson__cta-card">
              <p className="free-lesson__bridge">
                ეს იყო ერთი გაკვეთილი 25-დან. დანარჩენი 24 — ზუსტად ამ ფორმატით: T.C.R.E.I., Prompt
                Chaining, CSV, JSON და სხვა.
              </p>
              <CtaButton label={`დაიწყე სწავლა — ${PRICE_LABEL}`} />
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
            <blockquote className="campaign-hero-testimonial">
              <span>სტუდენტის გამოცდილება</span>
              <p>
                „დიდი მადლობა, ძალიან სასარგებლო კურსია.. მოვრჩით frameworks და ძალიან საინტერესო
                დასკვნა გამოვიტანე... ამის მერე სისტემურად და გააზრებულად ბევრად ეფექტურ შედეგს
                მივიღებ."
              </p>
              <footer>
                <strong>მიხეილ ჯერიაშვილი</strong>
                <small>აქტიური მონაწილე</small>
              </footer>
            </blockquote>

            <div className="free-lesson__final-cta">
              <CtaButton label={`დაიწყე სწავლა — ${PRICE_LABEL}`} />
            </div>
          </div>
        </section>
      </main>

      <CampaignFooter />
    </div>
  );
}
