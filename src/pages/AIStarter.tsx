import "./AIStarter.css";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, X, BookOpen, Gift, PlayCircle, Brain, Briefcase, CheckCircle2, Infinity as InfinityIcon, Lock, Mail, MessageSquareText, ShieldCheck, Users, Video } from "lucide-react";
import { CampaignPromoConfetti } from "@/components/campaign/CampaignPromoConfetti";
import { TestimonialStars } from "@/components/campaign/TestimonialStars";
import { StarterTestimonialCarousel } from "@/components/campaign/StarterTestimonialCarousel";
import { FIRST_PREVIEW_LESSON, type PreviewRequest, type PreviewSource, StarterCurriculum } from "@/components/campaign/StarterCurriculum";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignHeroVideo } from "@/components/campaign/CampaignHeroVideo";
import { CampaignStickyCta } from "@/components/campaign/CampaignStickyCta";
import { InlineFlittCheckout } from "@/components/campaign/InlineFlittCheckout";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { aiStarterTestimonials } from "@/data/aiStarterTestimonials";
import { SEO } from "@/components/SEO";
import { rememberAttributionRef } from "@/lib/attribution";
import { PRODUCTS, STARTER_LAST_DEADLINE, STARTER_PROMO_PHASES, isBlackFridayTheme, isHalloweenTheme, starterPromoPhase, trackInitiateCheckout } from "@/lib/checkout";
import { HalloweenDecor } from "@/components/campaign/HalloweenDecor";
import { EMAIL_RE, loadFlitt } from "@/lib/flitt";

const FULL_PRICE = PRODUCTS.starter.value;
// Dev-only preview of a future phase: /ai-starter?at=2026-11-01T00:30:00+04:00 pins the page clock.
if (import.meta.env.DEV) {
  const at = new URLSearchParams(window.location.search).get("at");
  if (at && !Number.isNaN(Date.parse(at))) {
    const offset = Date.parse(at) - Date.now();
    const realNow = Date.now.bind(Date);
    Date.now = () => realNow() + offset;
  }
}
// Real promo deadlines live in STARTER_PROMO_PHASES (₾79, ₾99, 3-hour extension, then the Black Friday
// ₾249 → ₾149 window until Nov 27). The page switches phase by itself at each deadline; after the last one it sells at ₾249.
const COHORT_NAME = "Black Friday";
const COHORT_DEADLINE_SHORT = "27 ნოემბრამდე";
// Figures the owner states in the launch video.
const COHORT_PROOF = { last: 134, october: 306 };
const LAST_PROMO_PHASE = STARTER_PROMO_PHASES[STARTER_PROMO_PHASES.length - 1];
type OfferSlot = "inline" | "desktop" | "final";
const modules = [
  { n: "01", title: "ფუნდამენტური პრომპტინგი", subtitle: "AI-სთან ეფექტური კომუნიკაცია", icon: MessageSquareText,
    goal: "გაიგებ, როგორ ჩამოაყალიბო მოთხოვნა და მიაწოდო AI-ს საჭირო კონტექსტი." },
  { n: "02", title: "პრაქტიკული შაბლონები და მონაცემები", subtitle: "Chain of Thought, Prompt Chaining, CSV და JSON — უკეთესი შედეგისთვის", icon: Brain,
    goal: "ისწავლი რთული ამოცანის ნაბიჯებად დაყოფას, პასუხის ფორმატის განსაზღვრასა და შედეგის გაუმჯობესებას." },
  { n: "03", title: "პროდუქტიულობა და ბიზნესი", subtitle: "საკუთარი ბრენდის კონტენტი AI-ს დახმარებით", icon: Briefcase,
    goal: "ჩამოაყალიბებ შენი ბრენდის ხმას, შექმნი ამ სტილით კონტენტს და მოამზადებ კონტენტის კალენდარს." },
];
// Placeholder replaced with the current phase's question when rendering.
const PROMO_FAQ = ["promo", ""];
// Shown only while cohort registration is open.
const COHORT_FAQ = ["რამდენ ხანს მოქმედებს Black Friday-ის ფასი?", `₾149 27 ნოემბრის შუაღამემდე მოქმედებს, თბილისის დროით. მერე კურსი ისევ ₾249 ღირს. კურსი ვიდეოგაკვეთილებია — უყურებ, როცა გცალია, შენი ტემპით. დღეში დაახლოებით 30 წუთი საკმარისია.`];
const promoFaq = (price: number, endLabel: string) => [`როგორ მივიღო ${price}₾-იანი ფასი?`,
  `დააჭირე ღილაკს „გააქტიურე ${FULL_PRICE - price}₾ ფასდაკლება“. გვერდზე ფასი ${FULL_PRICE}₾-დან ${price}₾-მდე შემცირდება. კოდის დამახსოვრება ან ხელით შეყვანა არ გჭირდება.${endLabel ? ` ფასდაკლება მოქმედებს ${endLabel}.` : ""}`];
const faqs = [
  ["ვისთვისაა ეს კურსი?", "მათთვის, ვისაც AI-სთან შეხება ჯერ არ ჰქონია და სურს პირველი ნაბიჯები გასაგები ვიდეოგაკვეთილებით გადადგას. თუ ფიქრობ, რომ ტექნოლოგიებისგან შორს ხარ — ეს კურსი სწორედ შენთვისაა."],
  COHORT_FAQ,
  ["მჭირდება პროგრამირების ცოდნა?", "არა. კურსი იწყება საფუძვლებით და პრომპტების შესაქმნელად პროგრამირების ცოდნა არ გჭირდება."],
  PROMO_FAQ,
  ["რა მოხდება, თუ კურსი არ მომეწონა?", "გაქვს 5-დღიანი გარანტია: შეძენიდან 5 დღის განმავლობაში მოგვწერე hello@bitcamp.ge-ზე შეკვეთის ელ. ფოსტიდან და თანხას სრულად დაგიბრუნებთ — მაშინაც, თუ უკვე დაიწყე გაკვეთილების ყურება. თანხა ბრუნდება იმავე ბარათზე, 7 სამუშაო დღეში."],
  ["როდის მივიღებ წვდომას?", "გადახდიდან რამდენიმე წუთში ელ. ფოსტაზე მიიღებ პირად ბმულს, რომლითაც კურსი მაშინვე გაიხსნება. წვდომა უვადოა — გაკვეთილებს ნებისმიერ დროს დაუბრუნდები."],
  ["რა შედის პაკეტში?", "ვიდეოკურსის პირველი სამი მოდული: ფუნდამენტური პრომპტინგი, პრაქტიკული შაბლონები და მონაცემები, პროდუქტიულობა და ბიზნესი. მენტორობა, ბონუს კურსები და დანარჩენი სამი მოდული ამ პაკეტში არ შედის."],
  ["თუ უფრო სიღრმისეულად სწავლა მომინდება?", "შემდგომ შეგიძლია დაინტერესდე BitCamp-ის სხვა მოდულებით ან მენტორობით. ისინი ცალკე შეთავაზებებია და AI Starter-ის ფასში არ შედის."],
];

function GeorgianFlag() {
  return <svg width="16" height="16" viewBox="0 0 30 20" aria-hidden="true" focusable="false">
    <path fill="#fff" d="M0 0h30v20H0z" />
    <path fill="#e00020" d="M13 0h4v20h-4zM0 8h30v4H0z" />
    {[ [6.5, 4], [23.5, 4], [6.5, 16], [23.5, 16] ].map(([x, y]) =>
      <path key={`${x}-${y}`} transform={`translate(${x} ${y})`} fill="#e00020"
        d="M-1-2.5h2l-.25 1.75L2.5-1v2L.75.75 1 2.5h-2L-.75.75-2.5 1v-2l1.75.25z" />
    )}
  </svg>;
}

type PromoSource = "bar" | "card" | "nudge" | "curriculum";
type Analytics = Window & {
  fbq?: (event: string, name: string, params?: Record<string, unknown>) => void;
  gtag?: (event: string, name: string, params?: Record<string, unknown>) => void;
};

// Funnel events between PageView and Purchase, so drop-off is measurable.
function trackStarter(name: string, params: Record<string, unknown> = {}, standard = false) {
  const win = window as Analytics;
  win.fbq?.(standard ? "track" : "trackCustom", name, { content_ids: ["starter"], currency: "GEL", ...params });
  win.gtag?.("event", name, { item_id: "starter", currency: "GEL", ...params });
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The visible offer card closest to the middle of the viewport.
function nearestOfferCard() {
  const distance = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
  };
  return Array.from(document.querySelectorAll<HTMLElement>(".campaign-page--starter .campaign-buy-anchor"))
    .filter(el => el.offsetParent !== null)
    .sort((a, b) => distance(a) - distance(b))[0];
}

// Current time, ticking every second until the promo deadline has passed.
function useNow(until: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (Date.now() >= until) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= until) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [until]);
  return now;
}

function countdownParts(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    [String(Math.floor(total / 86400)), "დღე"],
    [pad(Math.floor((total % 86400) / 3600)), "სთ"],
    [pad(Math.floor((total % 3600) / 60)), "წთ"],
    [pad(total % 60), "წმ"],
  ];
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const clock = [Math.floor((total % 86400) / 3600), Math.floor((total % 3600) / 60), total % 60]
    .map(n => String(n).padStart(2, "0")).join(":");
  return days ? `${days} დღე და ${clock} საათი` : `${clock} საათი`;
}

// Counts the displayed price down to the new value so the drop is noticed.
function useAnimatedNumber(target: number, duration = 900) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target;
    if (from === target || prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

export default function AIStarter() {
  // Black Friday sells at the promo price by default: no "activate the discount" step.
  const [promoActive, setPromoActive] = useState(() => !!starterPromoPhase(Date.now()) && isBlackFridayTheme(Date.now()));
  const silentPromo = useRef(promoActive);
  const [showPromoConfetti, setShowPromoConfetti] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [email, setEmail] = useState("");
  // The email field stays hidden until the visitor shows intent (promo or buy click).
  const [emailVisible, setEmailVisible] = useState(promoActive);
  const [emailError, setEmailError] = useState<OfferSlot | null>(null);
  // The offer card whose inline Flitt checkout is open (one at a time).
  const [checkoutSlot, setCheckoutSlot] = useState<OfferSlot | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  // Buying before activating the promo first shows a "you have a discount" prompt
  // in that card; the visitor can still explicitly continue at full price.
  const [nudgeSlot, setNudgeSlot] = useState<OfferSlot | null>(null);
  const [fullPriceChosen, setFullPriceChosen] = useState(false);
  // Offer card briefly highlighted after a locked lesson sends the visitor to it.
  const [highlightSlot, setHighlightSlot] = useState<OfferSlot | null>(null);
  const [previewRequest, setPreviewRequest] = useState<PreviewRequest | null>(null);
  const openPreview = (source: PreviewSource) =>
    setPreviewRequest({ slug: FIRST_PREVIEW_LESSON, source, nonce: Date.now() });

  // Ads promising free lessons link to /ai-starter#preview.
  useEffect(() => {
    if (window.location.hash !== "#preview") return;
    const timer = window.setTimeout(() => openPreview("link"), 300);
    return () => window.clearTimeout(timer);
  }, []);
  const emailInputs = useRef<Partial<Record<OfferSlot, HTMLInputElement | null>>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const now = useNow(STARTER_LAST_DEADLINE);
  const phase = starterPromoPhase(now);
  const promoAvailable = !!phase;
  // A visitor who activated the promo keeps the latest phase price if the last deadline passes mid-visit.
  const promo = phase ?? LAST_PROMO_PHASE;
  const PROMO_PRICE = promo.value;
  const SAVINGS = FULL_PRICE - PROMO_PRICE;
  const PROMO_END_LABEL = promo.endLabel;
  const countdown = formatCountdown(promo.endsAt - now);
  // Extra 3-hour timer after the Oct 31 deadline; the Halloween skin covers Oct 31 and the extension.
  const extension = promoAvailable && !!promo.extension;
  // Open-ended standing discount (no countdown or deadline copy); not used by the current phases.
  const openEnded = !!promo.open;
  // Cohort framing is shown only while registration is open.
  const cohortOpen = promoAvailable && !openEnded;
  const halloween = isHalloweenTheme(now);
  const blackFriday = promoAvailable && isBlackFridayTheme(now);
  const price = promoActive ? PROMO_PRICE : FULL_PRICE;
  const priceLabel = `₾${price}`;
  const displayedPrice = useAnimatedNumber(price);
  // Card the visitor activated the promo from; the email call-out focuses there.
  const promoSlotRef = useRef<OfferSlot | null>(null);
  useEffect(() => { rememberAttributionRef(); }, []);

  // Match /ai: reveal the updated offer after React paints, then clear the burst.
  useEffect(() => {
    if (!promoActive) return;
    if (silentPromo.current) { silentPromo.current = false; return; }
    const scrollTimer = window.setTimeout(() => {
      const slot = promoSlotRef.current;
      const target = (slot && document.querySelector<HTMLElement>(`.campaign-buy-anchor[data-slot="${slot}"]`)) || nearestOfferCard();
      target?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "center" });
      // Point desktop visitors straight at the email field; on touch devices focusing
      // would open the keyboard over the new price.
      if (target && window.matchMedia("(pointer: fine)").matches) {
        const input = target.querySelector<HTMLInputElement>('input[type="email"]');
        window.setTimeout(() => input?.focus({ preventScroll: true }), 700);
      }
    }, 120);
    const confettiTimer = window.setTimeout(() => setShowPromoConfetti(false), 1800);
    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(confettiTimer);
    };
  }, [promoActive]);

  // Bring the opened payment form into view once it has rendered.
  useEffect(() => {
    if (!checkoutSlot) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`starter-checkout-${checkoutSlot}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [checkoutSlot]);

  const activatePromo = (slot?: OfferSlot, source: PromoSource = slot ? "card" : "bar") => {
    if (promoActive) return;
    trackStarter("StarterPromoActivated", { source, value: PROMO_PRICE });
    if (source === "nudge") trackStarter("StarterPromoNudgeChoice", { choice: "activated" });
    promoSlotRef.current = slot ?? null;
    // The price changes, so close any checkout opened at the old price.
    setCheckoutSlot(null);
    setNudgeSlot(null);
    setEmailVisible(true);
    setPromoActive(true);
    setShowPromoConfetti(true);
  };

  const config = PRODUCTS.starter;
  const buttonId = promoActive ? promo.buttonId : config.mode === "embed" ? config.buttonId : "";
  // When a phase deadline changes the promo button, close a checkout opened at the old price
  // (the extension keeps the same button, so a late buyer mid-checkout is not interrupted).
  const promoButtonId = promo.buttonId;
  useEffect(() => { setCheckoutSlot(null); }, [promoButtonId]);

  const buy = (slot: OfferSlot) => {
    if (!buttonId) {
      setCheckoutMessage("ონლაინ შეძენა ჯერ არ არის ხელმისაწვდომი. კურსის შესახებ მოგვწერე: hello@bitcamp.ge");
      return;
    }
    if (promoAvailable && !promoActive && !fullPriceChosen) {
      showNudge(slot);
      return;
    }
    if (!emailVisible) {
      setEmailVisible(true);
      loadFlitt().catch(() => undefined);
      window.setTimeout(() => emailInputs.current[slot]?.focus(), 0);
      return;
    }
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError(slot);
      emailInputs.current[slot]?.focus();
      return;
    }
    setEmail(trimmed);
    setEmailError(null);
    setCheckoutMessage("");
    trackInitiateCheckout("starter", promoActive ? promo : undefined);
    trackStarter("Lead", { value: price }, true);
    setCheckoutEmail(trimmed);
    setCheckoutSlot(slot);
  };

  const showNudge = (slot: OfferSlot) => {
    if (nudgeSlot !== slot) trackStarter("StarterPromoNudgeShown");
    setNudgeSlot(slot);
    loadFlitt().catch(() => undefined);
    window.setTimeout(() => document
      .querySelector<HTMLButtonElement>(`.campaign-buy-anchor[data-slot="${slot}"] .starter-nudge__activate`)
      ?.focus({ preventScroll: true }), 0);
  };

  const goToOfferFromLesson = (lesson: string) => {
    trackStarter("StarterLockedLessonClick", { lesson });
    const card = nearestOfferCard();
    const slot = card?.dataset.slot as OfferSlot | undefined;
    if (!card || !slot) return;
    card.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "center" });
    setHighlightSlot(null);
    window.setTimeout(() => setHighlightSlot(slot), 20);
    window.setTimeout(() => setHighlightSlot(current => (current === slot ? null : current)), 2200);
  };

  const continueAtFullPrice = (slot: OfferSlot) => {
    trackStarter("StarterPromoNudgeChoice", { choice: "full_price" });
    setFullPriceChosen(true);
    setNudgeSlot(null);
    setEmailVisible(true);
    window.setTimeout(() => emailInputs.current[slot]?.focus(), 0);
  };

  // Sticky bar: jump to the visible offer card; pay straight away if the email is ready.
  const buyFromStickyBar = () => {
    const card = nearestOfferCard();
    const slot = card?.dataset.slot as OfferSlot | undefined;
    if (!slot) return;
    if (promoAvailable && !promoActive && !fullPriceChosen) {
      showNudge(slot);
      card.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "center" });
      return;
    }
    if (EMAIL_RE.test(email.trim())) {
      buy(slot);
      return;
    }
    setEmailVisible(true);
    card.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth", block: "center" });
    window.setTimeout(() => emailInputs.current[slot]?.focus({ preventScroll: true }), 400);
  };
  const promoButton = (compact = false, slot?: OfferSlot) => <button type="button"
    className={`campaign-promo-button${compact ? " campaign-promo-button--compact" : ""}${promoActive ? "" : " starter-promo-call"}`}
    disabled={promoActive} onClick={() => activatePromo(slot)}>
    {!promoActive && <Gift aria-hidden="true" size={compact ? 16 : 18} />}
    {promoActive ? `${SAVINGS}₾ ფასდაკლება გააქტიურებულია` : `გააქტიურე ${SAVINGS}₾ ფასდაკლება`}
  </button>;
  const purchase = (slot: OfferSlot) => nudgeSlot === slot ? <div className="starter-nudge" role="alertdialog" aria-labelledby={`starter-nudge-${slot}`}>
    <Gift aria-hidden="true" size={28} />
    <strong id={`starter-nudge-${slot}`}>მოიცა! შენ გაქვს ₾{SAVINGS} ფასდაკლება</strong>
    <p>ერთი კლიკით ფასი ₾{FULL_PRICE}-დან ₾{PROMO_PRICE}-მდე შემცირდება.{openEnded ? "" : ` ფასდაკლება მოქმედებს ${PROMO_END_LABEL}.`}</p>
    {!openEnded && <span className="starter-countdown" role="timer" aria-live="off">დარჩა {countdown}</span>}
    <button type="button" className="campaign-cta starter-nudge__activate" onClick={() => activatePromo(slot, "nudge")}>
      <span>გააქტიურე და გადაიხადე ₾{PROMO_PRICE}</span><ArrowRight aria-hidden="true" size={18} />
    </button>
    <button type="button" className="starter-nudge__full" onClick={() => continueAtFullPrice(slot)}>გაგრძელება ₾{FULL_PRICE}-ად</button>
  </div> : checkoutSlot === slot ? <div id={`starter-checkout-${slot}`} className="campaign-inline-checkout">
    <div className="campaign-inline-checkout__summary">
      <span>წვდომა გამოიგზავნება: <strong>{checkoutEmail}</strong></span>
      <button type="button" onClick={() => {
        setCheckoutSlot(null);
        window.setTimeout(() => emailInputs.current[slot]?.focus(), 0);
      }}>← შეცვალე ელ. ფოსტა</button>
    </div>
    <InlineFlittCheckout buttonId={buttonId} email={checkoutEmail}
      onReady={() => trackStarter("AddPaymentInfo", { value: price }, true)} />
  </div> : <form className="campaign-inline-checkout__email" noValidate onSubmit={e => { e.preventDefault(); buy(slot); }}>
    {emailVisible && <div className="starter-email-step">
    <div className="starter-email-step__heading">
      <span className="starter-email-step__chip">ბოლო ნაბიჯი</span>
      <label htmlFor={`starter-email-${slot}`}>შეიყვანე ელ. ფოსტა</label>
    </div>
    <input id={`starter-email-${slot}`} ref={el => { emailInputs.current[slot] = el; }}
      type="email" inputMode="email" autoComplete="email" autoCapitalize="off" autoCorrect="off" spellCheck={false}
      placeholder="email@example.com" value={email}
      aria-invalid={emailError === slot} aria-describedby={`starter-email-${slot}-hint`}
      className={emailError === slot ? "is-invalid" : email === "" ? "is-calling" : undefined}
      onFocus={() => { loadFlitt().catch(() => undefined); }}
      onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(null); }} />
    {emailError === slot && <p className="campaign-inline-checkout__error" role="alert">შეიყვანე სწორი ელ. ფოსტა</p>}
    <p id={`starter-email-${slot}-hint`} className="campaign-inline-checkout__hint">ამ მისამართზე გამოვაგზავნით კურსზე წვდომას გადახდის შემდეგ.</p>
    </div>}
    <button type="submit" className={`campaign-cta${promoAvailable && !promoActive && !fullPriceChosen ? " starter-cta--secondary" : ""}`}>
      <span>შეიძინე AI Starter — {priceLabel}</span><ArrowRight aria-hidden="true" size={18} />
    </button>
  </form>;
  const offer = (className: string, slot: OfferSlot, id?: string) => <div id={id} data-slot={slot}
    className={`campaign-hero__offer campaign-hero__offer--pro campaign-buy-anchor ${className}${showPromoConfetti || highlightSlot === slot ? " starter-offer--celebrate" : ""}`}>
    <div className="campaign-offer-heading"><span>{cohortOpen ? `AI Starter · ${COHORT_NAME}` : "AI Starter"}</span><strong>3 მოდული · 31 ვიდეო გაკვეთილი</strong></div>
    {promoActive
      ? <div className="starter-promo-applied" role="status">
        <CheckCircle2 aria-hidden="true" size={22} />
        <div><strong>{blackFriday ? "Black Friday ფასი" : "ფასდაკლება გააქტიურებულია"}</strong><span>₾{FULL_PRICE} → ₾{PROMO_PRICE} · დაზოგე ₾{SAVINGS}</span>
          {promoAvailable && !openEnded && <small className="starter-countdown" role="timer" aria-live="off">ფასი მოქმედებს {PROMO_END_LABEL} · დარჩა {countdown}</small>}</div>
      </div>
      : promoAvailable && <div className="campaign-offer-promo"><span>პირველი ნაბიჯი AI-ში — {SAVINGS}₾ ფასდაკლებით
        {!openEnded && <small className="starter-countdown" role="timer" aria-live="off">{promo.endDay} · დარჩა {countdown}</small>}</span>{promoButton(true, slot)}</div>}
    <div className="campaign-final__price-row"><div className="campaign-price-stack">
      <span>ერთჯერადი ფასი</span>
      {promoActive && <span className="campaign-price__old starter-price-old">₾{FULL_PRICE}</span>}
      <strong className={`campaign-price__current${promoActive ? " starter-price-new" : ""}`} aria-live="polite">
        <span aria-hidden="true">₾{displayedPrice}</span><span className="sr-only">{priceLabel}</span>
      </strong>
    </div>{promoActive && <span className="campaign-price__save starter-price-save">{promo.savingsLabel}</span>}</div>
    {purchase(slot)}
    <ul className="starter-assurances">
      <li><ShieldCheck aria-hidden="true" size={16} /><span><strong>5-დღიანი გარანტია</strong> — თანხის სრული დაბრუნება</span></li>
      <li><InfinityIcon aria-hidden="true" size={16} /><span><strong>უვადო წვდომა</strong> — ისწავლე შენს ტემპში</span></li>
      <li><Mail aria-hidden="true" size={16} /><span>წვდომა ელ. ფოსტაზე გადახდიდან რამდენიმე წუთში</span></li>
      <li><Lock aria-hidden="true" size={16} /><span>უსაფრთხო გადახდა · Visa / Mastercard / Apple Pay / Google Pay</span></li>
    </ul>
  </div>;


  const timer = (cls = "") => <div className={`bf-timer ${cls}`} role="timer" aria-live="off" aria-label={`ფასდაკლება სრულდება 27 ნოემბრის შუაღამეს, დარჩა ${countdown}`}>
    {countdownParts(promo.endsAt - now).map(([n, u]) => <span key={u}><b>{n}</b><small>{u}</small></span>)}
  </div>;
  const bfCta = (label = `დაიწყე ₾${PROMO_PRICE}-ად`) => <button type="button" className="bf-cta" onClick={buyFromStickyBar}><span>{label}</span><ArrowRight aria-hidden="true" size={20} /></button>;
  const PCT = Math.round((SAVINGS / FULL_PRICE) * 100);
  const bfFaqs = faqs.filter(f => f !== PROMO_FAQ);

  if (blackFriday) return <div className={`campaign-page campaign-page--pro campaign-page--starter campaign-page--blackfriday bf${promoActive ? " campaign-page--promo-active" : ""}`}>
    <SEO title="Black Friday — AI Starter ₾149 | BitCamp"
      description={`Black Friday: AI Starter ₾${FULL_PRICE}-ის ნაცვლად ₾${PROMO_PRICE}, 27 ნოემბრის შუაღამემდე. 31 ვიდეოგაკვეთილი ქართულად, ნულიდან — პრომპტები, ბრენდის ხმა, კონტენტ-კალენდარი.`}
      url="https://www.bitcamp.ge/ai-starter" />
    {showPromoConfetti && <CampaignPromoConfetti />}
    <div className="bf-tape" aria-hidden="true"><span>{Array(16).fill("BLACK FRIDAY ✦ AI STARTER ✦ ").join("")}</span></div>
    <main>
      <section className="bf-hero"><div className="campaign-shell bf-hero__grid">
        <div className="bf-hero__copy">
          <p className="bf-kicker">BLACK FRIDAY · AI STARTER</p>
          <h1>ChatGPT-ს ისევ Google‑ივით იყენებ?</h1>
          <p className="bf-hero__lead">სუპერ მარტივი ახსნით გასწავლი, <mark>როგორ ამუშაო AI შენთვის</mark> — 31 მოკლე გაკვეთილში, ქართულად, ნულიდან.</p>
          <div className="bf-price"><s>₾{FULL_PRICE}</s><strong>₾{PROMO_PRICE}</strong><em>-{PCT}%</em></div>
          <p className="bf-deadline">ეს ფასი 27 ნოემბრის შუაღამემდე მოქმედებს</p>
          {timer()}
          {bfCta()}
          <ul className="bf-trust"><li><ShieldCheck size={16} aria-hidden="true" />5-დღიანი გარანტია</li><li><InfinityIcon size={16} aria-hidden="true" />უვადო წვდომა</li><li><Mail size={16} aria-hidden="true" />წვდომა მაშინვე</li></ul>
          <div className="bf-byline"><img src="/media/external/images/otar-profile-photo.png" alt="" /><div><strong>ოთარ ზაკალაშვილი</strong><span>პროგრამისტი 2010 წლიდან · 3500+ სტუდენტი</span></div></div>
        </div>
        <div className="bf-hero__visual">
          <img src="/media/external/images/otar-profile-photo.png" alt="ოთარ ზაკალაშვილი" />
          <div className="bf-hero__badge"><strong>3500+</strong><span>სტუდენტი BitCamp-ზე</span></div>
        </div>
      </div></section>

      <section className="bf-stats" aria-label="კურსი ციფრებში"><div className="campaign-shell bf-stats__grid">
        {[["31", "ვიდეოგაკვეთილი"], ["6 სთ 46 წთ", "სულ ვიდეო"], ["3", "მოდული, ნულიდან"], ["5 დღე", "გარანტია"]].map(([n, l]) => <div key={l}><strong>{n}</strong><span>{l}</span></div>)}
      </div></section>

      <section className="bf-section"><div className="campaign-shell bf-video">
        <div><p className="bf-kicker">როგორ ვასწავლი</p><h2>ჯერ ნახე, მერე გადაწყვიტე.</h2>
          <p className="bf-muted">3 გაკვეთილი უფასოა. ნახე, როგორ ვხსნი, და მხოლოდ მერე გადაწყვიტე, გინდა თუ არა გაგრძელება.</p>
          <button type="button" className="bf-ghost" onClick={() => openPreview("hero")}><PlayCircle aria-hidden="true" size={20} />ნახე 3 უფასო გაკვეთილი</button></div>
        <CampaignHeroVideo className="bf-video__player" title="BitCamp-ის AI კურსის ვიდეო" />
      </div></section>

      <section className="bf-section bf-section--surface"><div className="campaign-shell">
        <div className="bf-heading"><p className="bf-kicker">ადამიანების 99% AI-ს არასწორად იყენებს</p><h2>ჯადოქრობას ელოდები, ზოგად პასუხს იღებ — და იმედი გიცრუვდება.</h2></div>
        <div className="bf-vs">
          <div className="bf-vs__col bf-vs__col--before"><h3>ახლა</h3><ul>
            {["ერთ წინადადებას წერ და მშრალ, ზოგად ტექსტს იღებ", "ყოველ ჯერზე თავიდან უხსნი, ვინ ხარ და რა გინდა", "ბოლოს პასუხს მაინც ხელით ასწორებ", "საქმე როცა რთულდება, გგონია, რომ AI-ს ეს არ შეუძლია"].map(t => <li key={t}><X aria-hidden="true" size={18} />{t}</li>)}
          </ul></div>
          <div className="bf-vs__col bf-vs__col--after"><h3>კურსის შემდეგ</h3><ul>
            {["პრომპტს სისტემით წერ: დავალება, როლი, კონტექსტი, ფორმატი", "AI შენი ბრენდის ხმით წერს — ისე, როგორც შენ დაწერდი", "პასუხს აფასებ და ხვეწ, სანამ ზუსტად ის არ გამოვა, რაც გინდა", "რთულ საქმეს ნაბიჯებად ყოფ და AI მას ბოლომდე ასრულებს"].map(t => <li key={t}><CheckCircle2 aria-hidden="true" size={18} />{t}</li>)}
          </ul></div>
        </div>
        <p className="bf-muted bf-center-text">ეს შენი ბრალი არ არის — AI-სთან მუშაობა უბრალოდ არავის უსწავლებია. ეს კურსი ზუსტად ამას გასწავლის.</p>
      </div></section>

      <section className="bf-section"><div className="campaign-shell">
        <div className="bf-heading"><p className="bf-kicker">რას ისწავლი</p><h2>3 მოდული — 3 უნარი, რომელსაც ხვალვე გამოიყენებ.</h2></div>
        <div className="bf-modules">
          {[
            { n: "01", meta: "14 გაკვეთილი · 1 სთ 53 წთ", t: "AI პირველივე ცდაზე მიხვდება, რა გინდა", items: ["Task, Persona, Format — სწორი პრომპტის ჩონჩხი", "კონტექსტი, მაგალითები და რეფერენსები", "შედეგის შეფასება და გაუმჯობესება (T.C.R.E.I.)"] },
            { n: "02", meta: "11 გაკვეთილი · 2 სთ 56 წთ", t: "რთული ამოცანა — ნაბიჯ-ნაბიჯ", items: ["Chain of Thought: AI ნაბიჯ-ნაბიჯ ფიქრობს", "Prompt Chaining: დიდ საქმეს პატარა ნაწილებად ყოფ", "CSV და JSON: პასუხს ცხრილად და მოწესრიგებულად იღებ"] },
            { n: "03", meta: "6 გაკვეთილი · 1 სთ 57 წთ", t: "შენი ბრენდი, შენი ხმით", items: ["შენი ბრენდის ხმისა და სტილის აღწერა", "კონტენტი, რომელიც შენნაირად ჟღერს", "მზა კონტენტ-კალენდარი"] },
          ].map(m => <article className="bf-module" key={m.n}>
            <div className="bf-module__top"><span className="bf-module__n">{m.n}</span><span className="bf-module__meta">{m.meta}</span></div>
            <h3>{m.t}</h3>
            <ul>{m.items.map(i => <li key={i}><CheckCircle2 aria-hidden="true" size={16} />{i}</li>)}</ul>
          </article>)}
        </div>
        <div className="bf-center">{bfCta(`მინდა ეს უნარები — ₾${PROMO_PRICE}`)}</div>
      </div></section>

      <section className="bf-section bf-section--surface"><div className="campaign-shell">
        <div className="bf-heading"><p className="bf-kicker">ვისთვისაა</p><h2>თუ ფიქრობ, რომ ტექნოლოგიებისგან შორს ხარ — ეს კურსი შენთვის შევქმენი.</h2></div>
        <div className="bf-chips">{["ბიზნესის მფლობელი", "მარკეტერი / SMM", "ფრილანსერი", "ოფისში მომუშავე", "მასწავლებელი", "სტუდენტი", "ვინც AI-ს ახლა იწყებს"].map(c => <span key={c}>{c}</span>)}</div>
        <p className="bf-muted bf-center-text">პროგრამირება არ გჭირდება. დღეში 30 წუთი საკმარისია — კუს ნაბიჯებით, მაგრამ ყოველდღე. უყურებ, როცა გცალია.</p>
      </div></section>

      <section className="bf-section"><div className="campaign-shell bf-author">
        <img src="/media/external/images/otar-profile-photo.png" alt="ოთარ ზაკალაშვილი" />
        <div><p className="bf-kicker">ვინ გასწავლის</p><h2>ოთარ ზაკალაშვილი</h2>
          <p className="bf-muted">2010 წლიდან პროგრამისტი ვარ და BitCamp-ის დამფუძნებელი. ჩემს კურსებზე 3500-ზე მეტმა ადამიანმა ისწავლა — მარტო ოქტომბრის ნაკადებში {COHORT_PROOF.october}-მა.</p>
          <p className="bf-muted">რთულ საკითხებს სუპერ მარტივად და გასაგებ ენაზე ვხსნი. ამ კურსში შენი გზამკვლევი ვიქნები AI სამყაროში.</p></div>
      </div></section>

      <section className="bf-section bf-section--surface"><div className="campaign-shell">
        <div className="bf-heading"><p className="bf-kicker">სტუდენტები</p><h2>რას მწერენ ჩემი AI კურსის სტუდენტები</h2></div>
        <div className="bf-reviews">{aiStarterTestimonials.map(({ name, quote }) => <figure key={name}>
          <TestimonialStars /><blockquote>„{quote}“</blockquote><figcaption>{name}</figcaption>
        </figure>)}</div>
      </div></section>

      <section className="bf-section"><div className="campaign-shell bf-math">
        <p className="bf-kicker">მოდი, დავითვალოთ</p>
        <h2>₾{PROMO_PRICE} ბევრია?</h2>
        <div className="bf-math__row">
          <div><strong>2 სთ</strong><span>თუ AI კვირაში მხოლოდ 2 საათს დაგიზოგავს</span></div>
          <div><strong>× ₾15</strong><span>და შენი საათი ₾15 ღირს</span></div>
          <div><strong>= ₾120</strong><span>თვეში ამდენ დროს იბრუნებ</span></div>
        </div>
        <p className="bf-muted">კურსი თავს 5 კვირაში იმართლებს. უნარი კი სამუდამოდ შენთან რჩება.</p>
      </div></section>

      <section id="bf-offer" className="bf-section bf-section--offer"><div className="campaign-shell bf-offer">
        <div className="bf-offer__stack">
          <p className="bf-kicker">Black Friday შეთავაზება</p><h2>რას იღებ ₾{PROMO_PRICE}-ად</h2>
          <ul>
            {[["31 ვიდეოგაკვეთილი", "სულ 6 სთ 46 წთ — მოკლედ და საქმეზე"], ["3 მოდული ნულიდან", "პრომპტინგი, შაბლონები, ბიზნესი"], ["უვადო წვდომა", "დაუბრუნდი, როცა მოგინდება"], ["წვდომა მაშინვე", "ბმულს გადახდისთანავე ელფოსტაზე მიიღებ"], ["5-დღიანი გარანტია", "თუ არ მოგეწონა, ფულს სრულად დაგიბრუნებ"]].map(([t, d]) => <li key={t}><CheckCircle2 aria-hidden="true" size={20} /><div><strong>{t}</strong><span>{d}</span></div></li>)}
          </ul>
          <div className="bf-offer__price"><span>ჩვეულებრივ</span><s>₾{FULL_PRICE}</s><span>Black Friday-ზე</span><strong>₾{PROMO_PRICE}</strong></div>
          {timer("bf-timer--small")}
        </div>
        {offer("bf-offer__card campaign-final__panel", "final", "purchase")}
      </div></section>

      <section id="starter-curriculum" className="bf-section bf-section--surface"><div className="campaign-shell">
        <div className="bf-heading"><p className="bf-kicker">სრული პროგრამა</p><h2>31-ვე გაკვეთილი</h2></div>
        <StarterCurriculum modules={modules} ctaLabel={`შეიძინე AI Starter — ${priceLabel}`} onCta={buyFromStickyBar}
          previewRequest={previewRequest} onPreview={(lesson, source) => trackStarter("StarterPreviewPlay", { lesson, source })}
          onLockedLesson={goToOfferFromLesson} />
      </div></section>

      <section className="bf-section"><div className="campaign-shell"><div className="starter-guarantee">
        <ShieldCheck aria-hidden="true" size={44} />
        <div><p className="campaign-kicker">რისკის გარეშე</p><h2>5-დღიანი თანხის დაბრუნების გარანტია</h2>
          <p>დაიწყე კურსი და ნახე გაკვეთილები. თუ 5 დღის განმავლობაში მიხვდები, რომ კურსი შენთვის არ არის, მოგვწერე hello@bitcamp.ge-ზე და თანხას სრულად დაგიბრუნებთ — დამატებითი კითხვების გარეშე.</p></div>
      </div></div></section>

      <section className="bf-section bf-section--surface"><div className="campaign-shell campaign-faq-grid"><div><p className="campaign-kicker">კითხვები</p><h2>სანამ დაიწყებ</h2></div>
        <div className="campaign-faq">{bfFaqs.map(([q, a], i) => <div className="campaign-faq__item" key={q}>
          <button type="button" aria-expanded={openFaq === i} aria-controls={`starter-faq-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{q}</span><span aria-hidden="true">{openFaq === i ? "−" : "+"}</span></button>
          <div id={`starter-faq-${i}`} hidden={openFaq !== i} className="campaign-faq__answer">{a}</div>
        </div>)}</div>
      </div></section>

      <section className="bf-final"><div className="campaign-shell">
        <p className="bf-kicker">მოდი, დავიწყოთ უმარტივესი პირველი ნაბიჯით 👇</p>
        <h2>27 ნოემბრის შუაღამეს ფასი ისევ ₾{FULL_PRICE} გახდება.</h2>
        {timer()}
        {bfCta(`დაიწყე დღესვე — ₾${PROMO_PRICE}`)}
      </div></section>
      <CampaignStickyCta eyebrow={`Black Friday · -${PCT}%`} price={priceLabel} label="დაიწყე" onClick={buyFromStickyBar} />
    </main>
    <Dialog open={Boolean(checkoutMessage)} onOpenChange={open => { if (!open) setCheckoutMessage(""); }}>
      <DialogContent><DialogTitle>კურსის შეძენა</DialogTitle><DialogDescription>{checkoutMessage}</DialogDescription>
        <a className="underline" href="mailto:hello@bitcamp.ge">მოგვწერე ელფოსტაზე</a>
      </DialogContent>
    </Dialog>
    <CampaignFooter />
  </div>;

  return <div className={`campaign-page campaign-page--pro campaign-page--starter${promoActive ? " campaign-page--promo-active" : ""}${halloween ? " campaign-page--halloween" : ""}${extension ? " campaign-page--extension" : ""}`}>
    <SEO title="AI Starter — პირველი ნაბიჯები AI-ში | BitCamp"
      description={`AI ვიდეოკურსი დამწყებთათვის: პრომპტები, ბრენდის ხმა და კონტენტის კალენდარი. 3 მოდული — ${FULL_PRICE}₾${cohortOpen ? `; ${COHORT_NAME} — ${COHORT_DEADLINE_SHORT} ფასდაკლებით ${PROMO_PRICE}₾.` : promoAvailable ? "; ფასდაკლების გააქტიურებით ნაკლებ ფასად." : "."}`}
      url="https://www.bitcamp.ge/ai-starter" />
    {halloween && <HalloweenDecor />}
    {extension && <div className="starter-extension" role="status"><div className="campaign-shell starter-extension__inner">
      <span className="starter-extension__pumpkin" aria-hidden="true">🎃</span>
      <div className="starter-extension__copy"><strong>ფასდაკლება გაგრძელდა მხოლოდ 3 საათით</strong>
        <span>შუაღამე დადგა, მაგრამ დაგვაგვიანდა? ₾99 ფასი ჯერ კიდევ შენია — {PROMO_END_LABEL}.</span></div>
      <div className="starter-extension__timer" role="timer" aria-live="off"><small>დარჩა</small><strong>{countdown}</strong></div>
      <span className="starter-extension__pumpkin starter-extension__pumpkin--right" aria-hidden="true">🎃</span>
    </div></div>}
    {(promoAvailable || promoActive) && !blackFriday && <div className={`campaign-promo-bar${promoActive ? " is-active" : ""}`}><div className="campaign-shell campaign-promo-bar__inner">
      <div><span>{extension ? "🦇 AI Starter · ფასდაკლება გაგრძელდა" : cohortOpen ? `AI Starter · ${COHORT_NAME}` : "AI Starter · ფასდაკლება"}{openEnded ? "" : ` ${PROMO_END_LABEL}${promoAvailable ? ` · დარჩა ${countdown}` : ""}`}</span><strong aria-live="polite">{promoActive ? `ფასდაკლება აქტიურია — 3 მოდული ${PROMO_PRICE}₾-ად` : `${FULL_PRICE}₾ → ${PROMO_PRICE}₾ · გააქტიურე ფასდაკლება ერთი კლიკით`}</strong></div>{promoButton()}
    </div></div>}
    {showPromoConfetti && <CampaignPromoConfetti />}
    <main>
      <section className="campaign-hero"><div className="campaign-shell campaign-hero__grid">
        <div className="campaign-hero__copy">
          <p className="campaign-eyebrow">AI ვიდეოკურსი ნულიდან</p>
          {cohortOpen && <div className="starter-cohort" role="status">
            <span className="starter-cohort__badge">{COHORT_NAME}</span>
            <span className="starter-cohort__text">ფასდაკლება {COHORT_DEADLINE_SHORT} · <span className="starter-countdown" role="timer" aria-live="off">დარჩა {countdown}</span></span>
          </div>}
          <h1>შენი პირველი პრაქტიკული ნაბიჯი AI სამყაროში</h1>
          <p className="campaign-lead">თუ ფიქრობ, რომ ტექნოლოგიებისგან და ხელოვნური ინტელექტისგან შორს ხარ — ეს კურსი შენთვისაა. ამ კურსის გავლის შემდეგ დარწმუნდები, რომ იმაზე გაცილებით მარტივად შეძლებ ყველაფერს, ვიდრე გეგონა. შენი ხელით შექმნილი პრაქტიკული შედეგი ამის ნათელი დასტური იქნება.</p>
          <p className="starter-pace">ვიდეოკურსია — უყურებ, როდესაც გინდა, შენი ტემპით. დღეში ~30 წუთი საკმარისია.</p>
          <button type="button" className="starter-preview-link" onClick={() => openPreview("hero")}>
            <PlayCircle aria-hidden="true" size={18} />ნახე 3 უფასო გაკვეთილი
          </button>
          <CampaignHeroVideo className="campaign-hero-video--inline" title="BitCamp-ის AI კურსის ვიდეო" />
          <StarterTestimonialCarousel />
          <div className="campaign-hero__facts"><span><BookOpen size={16} />3 მოდული · 31 გაკვეთილი</span><span><Video size={16} aria-hidden="true" />~7 საათი ვიდეო</span><span><CheckCircle2 size={16} />ნულიდან</span><span><GeorgianFlag />ქართულად</span></div>
          <div className="campaign-author-card"><div className="campaign-author-card__top">
            <img src="/media/external/images/otar-profile-photo.png" alt="ოთარ ზაკალაშვილი" />
            <div><span>კურსს უძღვება</span><strong>ოთარ ზაკალაშვილი</strong><small>BitCamp-ის დამფუძნებელი და AI კურსის ავტორი</small><small className="starter-author-students"><Users aria-hidden="true" size={14} />3500+ სტუდენტი BitCamp-ის კურსებზე</small>
              {cohortOpen && <small className="starter-author-cohort">ოქტომბრის ნაკადებს {COHORT_PROOF.october} ადამიანი შემოუერთდა · ბოლო ნაკადს — {COHORT_PROOF.last}</small>}</div>
          </div></div>
          {offer("campaign-hero__offer--inline", "inline")}
        </div>
        <div className="campaign-hero__visual"><CampaignHeroVideo className="campaign-hero-video--desktop" title="BitCamp-ის AI კურსის ვიდეო" />{offer("campaign-hero__offer--desktop", "desktop", "purchase")}</div>
      </div></section>
      <CampaignStickyCta eyebrow={cohortOpen ? `${COHORT_NAME} · ${COHORT_DEADLINE_SHORT}` : "AI Starter · 3 მოდული"} price={priceLabel} label="შეიძინე კურსი" onClick={buyFromStickyBar} />
      <section className="campaign-section campaign-section--surface"><div className="campaign-shell campaign-decision-grid">
        <div className="campaign-fit-copy"><p className="campaign-kicker">შენი პირველი შეხება AI-სთან</p><h2>დაიწყე იმ საქმით, რომელიც უკვე ნაცნობია.</h2>
          <p className="campaign-lead">არ გჭირდება წინასწარი ტექნიკური ცოდნა. კურსზე ისწავლი, როგორ აუხსნა AI-ს შენი ამოცანა, შეაფასო პასუხი და გააუმჯობესო შედეგი.</p>
        </div>
        <div className="campaign-prompt-demo"><p className="campaign-kicker">რას ისწავლი</p><h3>პრომპტიდან კონტენტის კალენდრამდე</h3>
          <div className="campaign-included-list campaign-included-list--panel">{["ჩამოაყალიბებ გასაგებ და კონკრეტულ პრომპტებს", "შექმნი საკუთარი კომპანიის ბრენდის ხმასა და სტილს", "მოამზადებ კონტენტს შენი ბრენდის ხმით", "შექმნი კონტენტის კალენდარს"].map(item => <div key={item}><CheckCircle2 aria-hidden="true" size={18} /><span>{item}</span></div>)}</div>
        </div>
      </div></section>
      <section id="starter-curriculum" className="campaign-section"><div className="campaign-shell"><div className="campaign-section-heading">
        <p className="campaign-kicker">სასწავლო პროგრამა</p><h2>სამი მოდული შენი პირველი ნაბიჯებისთვის.</h2>
        <p>ნახე ყველა გაკვეთილი და მისი ხანგრძლივობა. ზოგი გაკვეთილი უფასოდ შეგიძლია ახლავე ნახო.</p>
      </div>
        <StarterCurriculum modules={modules}
          ctaLabel={promoActive || !promoAvailable ? `შეიძინე AI Starter — ${priceLabel}` : `გააქტიურე ${SAVINGS}₾ ფასდაკლება`}
          onCta={() => promoActive || !promoAvailable ? buyFromStickyBar() : activatePromo(undefined, "curriculum")}
          previewRequest={previewRequest}
          onPreview={(lesson, source) => trackStarter("StarterPreviewPlay", { lesson, source })}
          onLockedLesson={goToOfferFromLesson} />
      </div></section>
      <section id="starter-testimonials" className="campaign-section campaign-section--surface"><div className="campaign-shell"><div className="campaign-section-heading">
        <p className="campaign-kicker">სტუდენტების გამოცდილება</p><h2>გასაგები ახსნა პირველი ნაბიჯისთვის.</h2>
        <p>3500+ სტუდენტი BitCamp-ის კურსებზე{cohortOpen ? ` — მხოლოდ ოქტომბრის ნაკადებში ${COHORT_PROOF.october} ადამიანი შემოგვიერთდა` : ""}. უკუკავშირი AI კურსის მონაწილეებისგან.</p>
      </div><div className="campaign-testimonial-grid">
        {aiStarterTestimonials.map(({ name, quote }) => <figure className="campaign-testimonial" key={name}>
          <TestimonialStars />
          <blockquote>„{quote}“</blockquote>
          <figcaption><strong>{name}</strong><span>BitCamp-ის AI კურსის მონაწილე</span></figcaption>
        </figure>)}
      </div></div></section>
      <section className="campaign-section"><div className="campaign-shell"><div className="starter-guarantee">
        <ShieldCheck aria-hidden="true" size={44} />
        <div>
          <p className="campaign-kicker">რისკის გარეშე</p>
          <h2>5-დღიანი თანხის დაბრუნების გარანტია</h2>
          <p>დაიწყე კურსი და ნახე გაკვეთილები. თუ 5 დღის განმავლობაში მიხვდები, რომ კურსი შენთვის არ არის, მოგვწერე hello@bitcamp.ge-ზე და თანხას სრულად დაგიბრუნებთ — დამატებითი კითხვების გარეშე.</p>
        </div>
      </div></div></section>
      <section className="campaign-section"><div className="campaign-shell campaign-faq-grid"><div><p className="campaign-kicker">კითხვები</p><h2>სანამ დაიწყებ</h2></div>
        <div className="campaign-faq">{faqs.flatMap(f => f === COHORT_FAQ ? (cohortOpen ? [f] : []) : f !== PROMO_FAQ ? [f] : promoAvailable ? [promoFaq(PROMO_PRICE, PROMO_END_LABEL)] : []).map(([q, a], i) => <div className="campaign-faq__item" key={q}>
          <button type="button" aria-expanded={openFaq === i} aria-controls={`starter-faq-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{q}</span><span aria-hidden="true">{openFaq === i ? "−" : "+"}</span></button>
          <div id={`starter-faq-${i}`} hidden={openFaq !== i} className="campaign-faq__answer">{a}</div>
        </div>)}</div>
      </div></section>
      <section className="campaign-final"><div className="campaign-shell campaign-final__inner"><div className="campaign-final__copy">
        <p className="campaign-kicker">{cohortOpen ? `${COHORT_NAME} · ${COHORT_DEADLINE_SHORT}` : "დაიწყე პირველი ნაბიჯით"}</p><h2>გაიცანი AI შენი საკუთარი ამოცანებით.</h2><p>პრომპტები, ბრენდის ხმა და კონტენტის კალენდარი — სამ ვიდეომოდულში, ნულიდან.</p>
      </div>{offer("campaign-final__panel", "final")}</div></section>
    </main>
    <Dialog open={Boolean(checkoutMessage)} onOpenChange={open => { if (!open) setCheckoutMessage(""); }}>
      <DialogContent><DialogTitle>კურსის შეძენა</DialogTitle><DialogDescription>{checkoutMessage}</DialogDescription>
        <a className="underline" href="mailto:hello@bitcamp.ge">მოგვწერე ელფოსტაზე</a>
      </DialogContent>
    </Dialog>
    <CampaignFooter />
  </div>;
}
