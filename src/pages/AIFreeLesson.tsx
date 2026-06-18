import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Volume2 } from "lucide-react";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { FreeLessonResourceForm } from "@/components/FreeLessonEmailGate";
import bitcampLogo from "@/assets/bitcamp-logo.png";

// Same video as the gated lesson at /learn/ai-pro/customer-profile/notebooklm-central-hub
// (public/learn-content/ai-pro/customer-profile/notebooklm-central-hub.md).
const LESSON_VIDEO_ID = "PqYK-h3eiPA";
const NOTEBOOK_URL =
  "https://notebooklm.google.com/notebook/a0564db3-4ed4-4708-9137-26003c68380c";

const CHECKOUT_URL = "/ai?ref=free-lesson#purchase";

type YouTubePlayer = {
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  playVideo: () => void;
  destroy: () => void;
};
type YouTubeWindow = Window & {
  YT?: { Player: new (el: Element, opts: unknown) => YouTubePlayer };
  onYouTubeIframeAPIReady?: () => void;
};

const bullets = [
  "6-მოდულიანი AI პროგრამა მენტორშიფით",
  "NotebookLM, ბიზნეს ამოცანები, Custom GPTs და n8n ავტომატიზაცია",
  "Python და SQL სრული კურსები ბონუსად",
];

let ytApiPromise: Promise<void> | null = null;
function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const win = window as YouTubeWindow;
  if (win.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>((resolve) => {
    const prev = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector("script[data-yt-iframe-api]")) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.setAttribute("data-yt-iframe-api", "");
      document.head.appendChild(tag);
    }
  });
  return ytApiPromise;
}

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
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const wantSoundRef = useRef(false);
  const viewedRef = useRef(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeIframeApi().then(() => {
      const win = window as YouTubeWindow;
      if (cancelled || !holderRef.current || !win.YT?.Player) return;
      playerRef.current = new win.YT.Player(holderRef.current, {
        videoId: LESSON_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            if (cancelled) return;
            try {
              event.target.mute();
              event.target.playVideo();
              if (wantSoundRef.current) {
                event.target.unMute();
                event.target.setVolume(100);
              }
            } catch {
              /* player not ready yet - ignore */
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, []);

  const enableSound = () => {
    if (!viewedRef.current) {
      viewedRef.current = true;
      fireFreeLessonEvent("FreeLessonView");
    }
    wantSoundRef.current = true;
    try {
      playerRef.current?.unMute();
      playerRef.current?.setVolume(100);
      playerRef.current?.playVideo();
    } catch {
      /* ignore */
    }
    setSoundOn(true);
  };

  return (
    <div className="campaign-hero-video free-lesson__video" aria-label="უფასო გაკვეთილის ვიდეო">
      <div className="free-lesson__video-frame">
        <div ref={holderRef} />
      </div>
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

            <div className="free-lesson__takeaways">
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
              <ul className="free-lesson__bullets">
                {bullets.map((item) => (
                  <li key={item}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <FreeLessonResourceForm listKey="ai-pro" listId={4} productLabel="AI Pro" source="ai-free-lesson" />

            <div className="free-lesson__cta-card">
              <div>
                <span>სრული პროგრამა</span>
                <h2>გინდა სრული AI გზამკვლევი?</h2>
              </div>
              <p className="free-lesson__bridge">
                სრულ პროგრამაში ეტაპობრივად გაივლი პრომპტინგს, ბიზნეს ამოცანებს, ვიზუალურ AI-ს,
                Custom GPTs-სა და n8n ავტომატიზაციას მენტორული მხარდაჭერით.
              </p>
              <CtaButton label="ნახე სრული პროგრამა" />
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
                <span>Python და SQL ბონუსად</span>
                <span>4 კვირიანი მენტორშიფი</span>
              </div>
              <CtaButton label="ნახე სრული პროგრამა" />
            </div>
          </div>
        </section>
      </main>

      <CampaignFooter />
    </div>
  );
}
