import "./AIStarter.css";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Gift, Brain, Briefcase, CheckCircle2, MessageSquareText, Video } from "lucide-react";
import { CampaignPromoConfetti } from "@/components/campaign/CampaignPromoConfetti";
import { TestimonialStars } from "@/components/campaign/TestimonialStars";
import { StarterTestimonialCarousel } from "@/components/campaign/StarterTestimonialCarousel";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignStickyCta } from "@/components/campaign/CampaignStickyCta";
import { InlineFlittCheckout } from "@/components/campaign/InlineFlittCheckout";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { aiStarterTestimonials } from "@/data/aiStarterTestimonials";
import { SEO } from "@/components/SEO";
import { rememberAttributionRef } from "@/lib/attribution";
import { PRODUCTS, STARTER_PROMO_CHECKOUT, trackInitiateCheckout } from "@/lib/checkout";
import { EMAIL_RE, loadFlitt } from "@/lib/flitt";

const PROMO_PRICE = STARTER_PROMO_CHECKOUT.value!;
type OfferSlot = "inline" | "desktop" | "final";
const modules = [
  { n: "01", title: "ფუნდამენტური პრომპტინგი", subtitle: "AI-სთან ეფექტური კომუნიკაცია", icon: MessageSquareText,
    goal: "გაიგებ, როგორ ჩამოაყალიბო მოთხოვნა და მიაწოდო AI-ს საჭირო კონტექსტი.",
    topics: ["LLM-ების მუშაობის პრინციპი", "T.C.R.E.I. ფორმულა", "კონტექსტის მართვა", "მაგალითებით სწავლება — Few-Shot Prompting"] },
  { n: "02", title: "Advanced Prompting", subtitle: "მოთხოვნიდან თანმიმდევრულ სამუშაო პროცესამდე", icon: Brain,
    goal: "ისწავლი რთული ამოცანის ნაბიჯებად დაყოფას, პასუხის ფორმატის განსაზღვრასა და შედეგის გაუმჯობესებას.",
    topics: ["ამოცანის ნაბიჯებად დაყოფა", "Prompt Chaining", "სტრუქტურირებული პასუხები", "ქართული ენის თავისებურებები"] },
  { n: "03", title: "პროდუქტიულობა და ბიზნესი", subtitle: "საკუთარი ბრენდის კონტენტი AI-ს დახმარებით", icon: Briefcase,
    goal: "ჩამოაყალიბებ შენი ბრენდის ხმას, შექმნი ამ სტილით კონტენტს და მოამზადებ კონტენტის კალენდარს.",
    topics: ["ბრენდის ხმა და სტილი", "კონტენტის შექმნა", "კონტენტის კალენდარი", "დოკუმენტები და საქმიანი მიმოწერა"] },
];
const faqs = [
  ["ვისთვისაა ეს კურსი?", "მათთვის, ვისაც AI-სთან შეხება ჯერ არ ჰქონია და სურს პირველი ნაბიჯები გასაგები ვიდეოგაკვეთილებით გადადგას."],
  ["მჭირდება პროგრამირების ცოდნა?", "არა. კურსი იწყება საფუძვლებით და პრომპტების შესაქმნელად პროგრამირების ცოდნა არ გჭირდება."],
  ["როგორ მივიღო 79₾-იანი ფასი?", "დააჭირე ღილაკს „გააქტიურე 170₾ ფასდაკლება“. გვერდზე ფასი 249₾-დან 79₾-მდე შემცირდება. კოდის დამახსოვრება ან ხელით შეყვანა არ გჭირდება."],
  ["რა შედის პაკეტში?", "ვიდეოკურსის პირველი სამი მოდული: ფუნდამენტური პრომპტინგი, Advanced Prompting და პროდუქტიულობა და ბიზნესი. მენტორობა, ბონუს კურსები და დანარჩენი სამი მოდული ამ პაკეტში არ შედის."],
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
  const [promoActive, setPromoActive] = useState(false);
  const [showPromoConfetti, setShowPromoConfetti] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [email, setEmail] = useState("");
  // The email field stays hidden until the visitor shows intent (promo or buy click).
  const [emailVisible, setEmailVisible] = useState(false);
  const [emailError, setEmailError] = useState<OfferSlot | null>(null);
  // The offer card whose inline Flitt checkout is open (one at a time).
  const [checkoutSlot, setCheckoutSlot] = useState<OfferSlot | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  // Buying before activating the promo first shows a "you have a discount" prompt
  // in that card; the visitor can still explicitly continue at full price.
  const [nudgeSlot, setNudgeSlot] = useState<OfferSlot | null>(null);
  const [fullPriceChosen, setFullPriceChosen] = useState(false);
  const emailInputs = useRef<Partial<Record<OfferSlot, HTMLInputElement | null>>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const price = promoActive ? PROMO_PRICE : PRODUCTS.starter.value;
  const priceLabel = `₾${price}`;
  const displayedPrice = useAnimatedNumber(price);
  // Card the visitor activated the promo from; the email call-out focuses there.
  const promoSlotRef = useRef<OfferSlot | null>(null);
  useEffect(() => { rememberAttributionRef(); }, []);

  // Match /ai: reveal the updated offer after React paints, then clear the burst.
  useEffect(() => {
    if (!promoActive) return;
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

  const activatePromo = (slot?: OfferSlot) => {
    if (promoActive) return;
    promoSlotRef.current = slot ?? null;
    // The price changes, so close any checkout opened at the old price.
    setCheckoutSlot(null);
    setNudgeSlot(null);
    setEmailVisible(true);
    setPromoActive(true);
    setShowPromoConfetti(true);
  };

  const config = PRODUCTS.starter;
  const buttonId = promoActive ? STARTER_PROMO_CHECKOUT.buttonId : config.mode === "embed" ? config.buttonId : "";

  const buy = (slot: OfferSlot) => {
    if (!buttonId) {
      setCheckoutMessage("ონლაინ შეძენა ჯერ არ არის ხელმისაწვდომი. კურსის შესახებ მოგვწერე: hello@bitcamp.ge");
      return;
    }
    if (!promoActive && !fullPriceChosen) {
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
    trackInitiateCheckout("starter", promoActive ? STARTER_PROMO_CHECKOUT : undefined);
    setCheckoutEmail(trimmed);
    setCheckoutSlot(slot);
  };

  const showNudge = (slot: OfferSlot) => {
    setNudgeSlot(slot);
    loadFlitt().catch(() => undefined);
    window.setTimeout(() => document
      .querySelector<HTMLButtonElement>(`.campaign-buy-anchor[data-slot="${slot}"] .starter-nudge__activate`)
      ?.focus({ preventScroll: true }), 0);
  };

  const continueAtFullPrice = (slot: OfferSlot) => {
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
    if (!promoActive && !fullPriceChosen) {
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
    {promoActive ? "170₾ ფასდაკლება გააქტიურებულია" : "გააქტიურე 170₾ ფასდაკლება"}
  </button>;
  const purchase = (slot: OfferSlot) => nudgeSlot === slot ? <div className="starter-nudge" role="alertdialog" aria-labelledby={`starter-nudge-${slot}`}>
    <Gift aria-hidden="true" size={28} />
    <strong id={`starter-nudge-${slot}`}>მოიცა! შენ გაქვს ₾170 ფასდაკლება</strong>
    <p>ერთი კლიკით ფასი ₾249-დან ₾79-მდე შემცირდება.</p>
    <button type="button" className="campaign-cta starter-nudge__activate" onClick={() => activatePromo(slot)}>
      <span>გააქტიურე და გადაიხადე ₾79</span><ArrowRight aria-hidden="true" size={18} />
    </button>
    <button type="button" className="starter-nudge__full" onClick={() => continueAtFullPrice(slot)}>გაგრძელება ₾249-ად</button>
  </div> : checkoutSlot === slot ? <div id={`starter-checkout-${slot}`} className="campaign-inline-checkout">
    <div className="campaign-inline-checkout__summary">
      <span>წვდომა გამოიგზავნება: <strong>{checkoutEmail}</strong></span>
      <button type="button" onClick={() => {
        setCheckoutSlot(null);
        window.setTimeout(() => emailInputs.current[slot]?.focus(), 0);
      }}>← შეცვალე ელ. ფოსტა</button>
    </div>
    <InlineFlittCheckout buttonId={buttonId} email={checkoutEmail} />
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
    <button type="submit" className={`campaign-cta${!promoActive && !fullPriceChosen ? " starter-cta--secondary" : ""}`}>
      <span>შეიძინე AI Starter — {priceLabel}</span><ArrowRight aria-hidden="true" size={18} />
    </button>
  </form>;
  const offer = (className: string, slot: OfferSlot, id?: string) => <div id={id} data-slot={slot}
    className={`campaign-hero__offer campaign-hero__offer--pro campaign-buy-anchor ${className}${showPromoConfetti ? " starter-offer--celebrate" : ""}`}>
    <div className="campaign-offer-heading"><span>AI Starter</span><strong>3 მოდული · ვიდეოკურსი</strong></div>
    {promoActive
      ? <div className="starter-promo-applied" role="status">
        <CheckCircle2 aria-hidden="true" size={22} />
        <div><strong>ფასდაკლება გააქტიურებულია</strong><span>₾249 → ₾79 · დაზოგე ₾170</span></div>
      </div>
      : <div className="campaign-offer-promo"><span>პირველი ნაბიჯი AI-ში — 170₾ ფასდაკლებით</span>{promoButton(true, slot)}</div>}
    <div className="campaign-final__price-row"><div className="campaign-price-stack">
      <span>ერთჯერადი ფასი</span>
      {promoActive && <span className="campaign-price__old starter-price-old">₾249</span>}
      <strong className={`campaign-price__current${promoActive ? " starter-price-new" : ""}`} aria-live="polite">
        <span aria-hidden="true">₾{displayedPrice}</span><span className="sr-only">{priceLabel}</span>
      </strong>
    </div>{promoActive && <span className="campaign-price__save starter-price-save">შენ ზოგავ ₾170-ს</span>}</div>
    {purchase(slot)}
    <p className="campaign-secure-line">მენტორობისა და ბონუს კურსების გარეშე</p>
  </div>;

  return <div className={`campaign-page campaign-page--pro campaign-page--starter${promoActive ? " campaign-page--promo-active" : ""}`}>
    <SEO title="AI Starter — პირველი ნაბიჯები AI-ში | BitCamp"
      description="AI ვიდეოკურსი დამწყებთათვის: პრომპტები, ბრენდის ხმა და კონტენტის კალენდარი. 3 მოდული — 249₾; ფასდაკლების გააქტიურებით 79₾."
      url="https://www.bitcamp.ge/ai-starter" />
    <div className={`campaign-promo-bar${promoActive ? " is-active" : ""}`}><div className="campaign-shell campaign-promo-bar__inner">
      <div><span>AI Starter</span><strong aria-live="polite">{promoActive ? "ფასდაკლება აქტიურია — 3 მოდული 79₾-ად" : "249₾ → 79₾ · გააქტიურე ფასდაკლება ერთი კლიკით"}</strong></div>{promoButton()}
    </div></div>
    {showPromoConfetti && <CampaignPromoConfetti />}
    <main>
      <section className="campaign-hero"><div className="campaign-shell campaign-hero__grid">
        <div className="campaign-hero__copy"><p className="campaign-eyebrow">AI ვიდეოკურსი ნულიდან</p>
          <h1>პირველი ნაბიჯები AI-ში — მარტივად და გასაგებად</h1>
          <p className="campaign-lead">გონია, რომ AI შენთვის ზედმეტად რთულია? დაიწყე 0 - დან, საფუძვლებით და ისწავლე მისი გამოყენება საკუთარი ვირტუალური ბიზნესის შექმნის მაგალითზე.</p>
          <StarterTestimonialCarousel />
          <div className="campaign-hero__facts"><span><BookOpen size={16} />3 მოდული</span><span><CheckCircle2 size={16} />ნულიდან</span><span><GeorgianFlag />ქართულად</span><span><Video size={16} aria-hidden="true" />ვიდეო გაკვეთილები</span></div>
          <div className="campaign-author-card"><div className="campaign-author-card__top">
            <img src="/media/external/images/otar-profile-photo.png" alt="ოთარ ზაკალაშვილი" />
            <div><span>კურსს უძღვება</span><strong>ოთარ ზაკალაშვილი</strong><small>BitCamp-ის დამფუძნებელი და AI კურსის ავტორი</small></div>
          </div></div>
          {offer("campaign-hero__offer--inline", "inline")}
        </div>
        <div className="campaign-hero__visual">{offer("campaign-hero__offer--desktop", "desktop", "purchase")}</div>
      </div></section>
      <CampaignStickyCta eyebrow="AI Starter · 3 მოდული" price={priceLabel} label="შეიძინე კურსი" onClick={buyFromStickyBar} />
      <section className="campaign-section campaign-section--surface"><div className="campaign-shell campaign-decision-grid">
        <div className="campaign-fit-copy"><p className="campaign-kicker">შენი პირველი შეხება AI-სთან</p><h2>დაიწყე იმ საქმით, რომელიც უკვე ნაცნობია.</h2>
          <p className="campaign-lead">არ გჭირდება წინასწარი ტექნიკური ცოდნა. კურსზე ისწავლი, როგორ აუხსნა AI-ს შენი ამოცანა, შეაფასო პასუხი და გააუმჯობესო შედეგი.</p>
        </div>
        <div className="campaign-prompt-demo"><p className="campaign-kicker">რას ისწავლი</p><h3>პრომპტიდან კონტენტის კალენდრამდე</h3>
          <div className="campaign-included-list campaign-included-list--panel">{["ჩამოაყალიბებ გასაგებ და კონკრეტულ პრომპტებს", "შექმნი საკუთარი კომპანიის ბრენდის ხმასა და სტილს", "მოამზადებ კონტენტს შენი ბრენდის ხმით", "შექმნი კონტენტის კალენდარს"].map(item => <div key={item}><CheckCircle2 aria-hidden="true" size={18} /><span>{item}</span></div>)}</div>
        </div>
      </div></section>
      <section className="campaign-section"><div className="campaign-shell"><div className="campaign-section-heading">
        <p className="campaign-kicker">სასწავლო პროგრამა</p><h2>სამი მოდული შენი პირველი ნაბიჯებისთვის.</h2>
      </div><div className="campaign-module-grid">{modules.map(({ icon: Icon, ...module }) => <article className="campaign-module-card" key={module.n}>
        <div className="campaign-module-card__top"><div className="campaign-card-icon"><Icon aria-hidden="true" size={22} /></div><div><span>მოდული {module.n}</span><h3>{module.title}</h3><small>{module.subtitle}</small></div></div>
        <p>{module.goal}</p><ul>{module.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
      </article>)}</div></div></section>
      <section id="starter-testimonials" className="campaign-section campaign-section--surface"><div className="campaign-shell"><div className="campaign-section-heading">
        <p className="campaign-kicker">სტუდენტების გამოცდილება</p><h2>გასაგები ახსნა პირველი ნაბიჯისთვის.</h2>
        <p>უკუკავშირი BitCamp-ის AI კურსის მონაწილეებისგან.</p>
      </div><div className="campaign-testimonial-grid">
        {aiStarterTestimonials.map(({ name, quote }) => <figure className="campaign-testimonial" key={name}>
          <TestimonialStars />
          <blockquote>„{quote}“</blockquote>
          <figcaption><strong>{name}</strong><span>BitCamp-ის AI კურსის მონაწილე</span></figcaption>
        </figure>)}
      </div></div></section>
      <section className="campaign-section"><div className="campaign-shell campaign-faq-grid"><div><p className="campaign-kicker">კითხვები</p><h2>სანამ დაიწყებ</h2></div>
        <div className="campaign-faq">{faqs.map(([q, a], i) => <div className="campaign-faq__item" key={q}>
          <button type="button" aria-expanded={openFaq === i} aria-controls={`starter-faq-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{q}</span><span aria-hidden="true">{openFaq === i ? "−" : "+"}</span></button>
          <div id={`starter-faq-${i}`} hidden={openFaq !== i} className="campaign-faq__answer">{a}</div>
        </div>)}</div>
      </div></section>
      <section className="campaign-final"><div className="campaign-shell campaign-final__inner"><div className="campaign-final__copy">
        <p className="campaign-kicker">დაიწყე პირველი ნაბიჯით</p><h2>გაიცანი AI შენი საკუთარი ამოცანებით.</h2><p>პრომპტები, ბრენდის ხმა და კონტენტის კალენდარი — სამ ვიდეომოდულში, ნულიდან.</p>
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
