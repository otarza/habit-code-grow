import { type CSSProperties, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  Bot,
  Brain,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Image as ImageIcon,
  MessageSquareText,
  ShieldCheck,
  Users,
  Volume2,
  Workflow,
} from "lucide-react";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignStickyCta } from "@/components/campaign/CampaignStickyCta";
import { FlittCheckoutModal } from "@/components/campaign/FlittCheckoutModal";
import { SEO } from "@/components/SEO";
import { rememberAttributionRef } from "@/lib/attribution";
import { type CheckoutOverride, handleBuy } from "@/lib/checkout";

const paymentLogos = ["visa", "mastercard", "apple-pay", "google-pay"] as const;
const PRO_VIDEO_BASE_URL =
  "https://player.mediadelivery.net/embed/678241/5c33a6d3-33fc-41a5-83ca-1a9c8ee702ff?autoplay=true&loop=false&muted=true&preload=true&responsive=true";
const PRO_CURRENT_PRICE = 249;
const PRO_PROMO_CODE = "150";
const PRO_PROMO_PRICE = 99;
const PRO_PROMO_BUTTON_ID = "6e5fddecc50d14bdcc75f27b3708b0fa21c7887e";
const PRO_FULL_PRICE = 790;
const formatGel = (value: number) => `₾${value}`;
const getProVideoUrl = (soundEnabled: boolean) =>
  PRO_VIDEO_BASE_URL.replace("muted=true", `muted=${soundEnabled ? "false" : "true"}`);
const PRO_CURRENT_PRICE_LABEL = formatGel(PRO_CURRENT_PRICE);
const PRO_PROMO_PRICE_LABEL = formatGel(PRO_PROMO_PRICE);
const PRO_PROMO_DISCOUNT_LABEL = formatGel(PRO_CURRENT_PRICE - PRO_PROMO_PRICE);
const PRO_PROMO_SAVINGS_LABEL = formatGel(PRO_FULL_PRICE - PRO_PROMO_PRICE);
const PRO_PROMO_SAVINGS_MESSAGE = `შენ ზოგავ ${PRO_PROMO_SAVINGS_LABEL} - ს`;
const PRO_FULL_PRICE_LABEL = formatGel(PRO_FULL_PRICE);
const PRO_DISCOUNT_WINDOW_LABEL = "ივნისის ბოლომდე";
const PRO_PROMO_DEADLINE_LABEL = "30 ივნისამდე";
const PRO_PROMO_CHECKOUT: CheckoutOverride = {
  buttonId: PRO_PROMO_BUTTON_ID,
  name: "AI Bootcamp მენტორობით — Promo 150",
  value: PRO_PROMO_PRICE,
  savingsLabel: PRO_PROMO_SAVINGS_MESSAGE,
};
const PRO_PROMO_CONFETTI = [
  { x: "-44vw", y: "56vh", r: "-320deg", c: "#ff766a" },
  { x: "-36vw", y: "42vh", r: "260deg", c: "#f5f5f7" },
  { x: "-28vw", y: "62vh", r: "-210deg", c: "#da291c" },
  { x: "-20vw", y: "48vh", r: "340deg", c: "#ffb4ac" },
  { x: "-14vw", y: "66vh", r: "-280deg", c: "#9adbe8" },
  { x: "-8vw", y: "46vh", r: "220deg", c: "#ff766a" },
  { x: "-2vw", y: "70vh", r: "-360deg", c: "#f5f5f7" },
  { x: "6vw", y: "52vh", r: "300deg", c: "#da291c" },
  { x: "12vw", y: "68vh", r: "-240deg", c: "#ffb4ac" },
  { x: "18vw", y: "44vh", r: "280deg", c: "#9adbe8" },
  { x: "26vw", y: "64vh", r: "-300deg", c: "#ff766a" },
  { x: "34vw", y: "50vh", r: "240deg", c: "#f5f5f7" },
  { x: "42vw", y: "60vh", r: "-260deg", c: "#da291c" },
  { x: "-40vw", y: "74vh", r: "380deg", c: "#9adbe8" },
  { x: "-30vw", y: "78vh", r: "-340deg", c: "#ff766a" },
  { x: "-16vw", y: "82vh", r: "310deg", c: "#f5f5f7" },
  { x: "0vw", y: "84vh", r: "-390deg", c: "#ffb4ac" },
  { x: "16vw", y: "80vh", r: "330deg", c: "#da291c" },
  { x: "30vw", y: "76vh", r: "-310deg", c: "#9adbe8" },
  { x: "40vw", y: "72vh", r: "360deg", c: "#ff766a" },
] as const;

const proIncludes = [
  "სრული 6-მოდულიანი პროგრამა: პრომპტინგიდან n8n ავტომატიზაციამდე",
  "T.C.R.E.I. ჩარჩო, Advanced Prompting და Prompt Chaining",
  "AI-ის პრაქტიკული გამოყენება: ტექსტი, მონაცემები და დოკუმენტები",
  "ვიზუალური AI, Custom GPTs და პერსონალური აგენტების აწყობა",
  "Python-ის და SQL-ის სრული კურსები ბონუსად",
  "4-კვირიანი მენტორშიფი, დახურული Discord ჯგუფი და უკუკავშირი",
];

const proInstructorCredentials = [
  "BitCamp-ის დამფუძნებელი",
  "Python, SQL, კომპ. მეცნიერების, Full-Stack Web Development და AI კურსების ავტორი",
  "16 წლიანი გამოცდილება ტექნოლოგიურ ინდუსტრიაში",
  "სენიორ პროგრამულ ინჟინრად მუშაობის ისტორია ამერიკაში, კანადაში და ევროპის 12 ქვეყანაში",
];

const mentorSteps = [
  {
    title: "სწავლობ ნულიდან პროფესიონალამდე",
    body: "იწყებ პრომპტინგის საფუძვლებით და ასრულებ პერსონალური აგენტებითა და n8n ავტომატიზაციით.",
  },
  {
    title: "ცოდნას იყენებ პრაქტიკაში",
    body: "ყოველი მოდული რეალური ამოცანით სრულდება: ტექსტის დამუშავება, კვლევა, მონაცემების ანალიზი თუ ავტომატიზაცია.",
  },
  {
    title: "იღებ მუდმივ უკუკავშირს",
    body: "4 კვირის განმავლობაში ერთად განვიხილავთ და ვაუმჯობესებთ შენს პრომპტებსა და სისტემებს.",
  },
];

const proOutcomes = [
  {
    label: "შედეგი 01",
    title: "AI შენი ყოველდღიური ინსტრუმენტი ხდება",
    body: "T.C.R.E.I. ჩარჩოს დახმარებით ბუნდოვან მოთხოვნებს ზუსტ ინსტრუქციებად აქცევ და პირველივე ცდაზე იღებ სასურველ შედეგს.",
    icon: MessageSquareText,
  },
  {
    label: "შედეგი 02",
    title: "მრავალფეროვანი ამოცანების გადაჭრა",
    body: "ისწავლი დოკუმენტების და მონაცემების დამუშავებას, ბიზნეს ამოცანების მოგვარებას და არა მხოლოდ ChatGPT-სთან მარტივ მიმოწერას.",
    icon: Briefcase,
  },
  {
    label: "შედეგი 03",
    title: "ქმნი აგენტებსა და ავტომატიზაციებს",
    body: "Custom GPTs და n8n დაგეხმარება შექმნა სისტემები, რომლებიც რუტინულ საქმეს შენს ნაცვლად, ავტომატურად გააკეთებენ.",
    icon: Workflow,
  },
];

const fullProgramModules = [
  {
    n: "01",
    title: "ფუნდამენტური პრომპტინგი",
    subtitle: "AI-სთან ეფექტური კომუნიკაცია",
    goal: "ისწავლი, როგორ მიიღო AI-სგან ზუსტად ის, რაც გინდა — პირველივე ცდაზე.",
    icon: MessageSquareText,
    topics: ["LLM-ების მუშაობის პრინციპი", "T.C.R.E.I. ფორმულა", "კონტექსტის მართვა", "Few-Shot Prompting"],
  },
  {
    n: "02",
    title: "Advanced Prompting",
    subtitle: "რთული ამოცანების ლოგიკა",
    goal: "გადააქცევ AI-ს უბრალო ჩატბოტიდან ლოგიკურად მოაზროვნე სამუშაო პარტნიორად.",
    icon: Brain,
    topics: ["Chain of Thought", "Prompt Chaining", "სტრუქტურირებული პასუხები", "ქართული ენის თავისებურებები"],
  },
  {
    n: "03",
    title: "პროდუქტიულობა და ბიზნესი",
    subtitle: "მაქსიმალური შედეგი ნაკლებ დროში",
    goal: "ისწავლი კონკრეტული ბიზნეს-ამოცანების გადაჭრას წუთებში, საათების ნაცვლად.",
    icon: Briefcase,
    topics: ["კონტენტის შექმნა", "დოკუმენტების ანალიზი", "კორპორატიული მიმოწერა"],
  },
  {
    n: "04",
    title: "ვიზუალური AI",
    subtitle: "DALL-E, Midjourney და Vision",
    goal: "შეძლებ სურათების გენერაციას, ვიზუალური ინფორმაციის დამუშავებას და მონაცემების ვიზუალიზაციას.",
    icon: ImageIcon,
    topics: ["სურათების გენერაცია", "Vision მოდელები", "მონაცემთა ვიზუალიზაცია"],
  },
  {
    n: "05",
    title: "პერსონალური აგენტები",
    subtitle: "Custom GPTs",
    goal: "ააწყობ პირად AI დამხმარეებს, რომლებსაც ესმით შენი კონტექსტი, ფაილები და სამუშაო სტილი.",
    icon: Bot,
    topics: ["Custom Instructions", "საკუთარი GPT-ის შექმნა", "Knowledge Base", "აგენტის გაზიარება"],
  },
  {
    n: "06",
    title: "ავტომატიზაცია",
    subtitle: "n8n და რეალური პროცესები",
    goal: "შექმნი სისტემებს, რომლებიც აკავშირებს სხვადასხვა პროგრამებს და დამოუკიდებლად ასრულებს ამოცანებს.",
    icon: Workflow,
    topics: ["n8n-ის საფუძვლები", "Webhooks და API", "AI ავტომატიზაციები", "Human-in-the-Loop"],
  },
];

const proTestimonials = [
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
  {
    quote:
      "დღეს შემოგიერთდით... პირველი გაკვეთილის მოსმენისთანავე დიდი იმედი და სურვილი გაჩნდა და მადლობა თქვენ ამისთვის!",
    name: "TuKa",
    note: "აქტიური მონაწილე · სწავლის მოტივაცია",
  },
  {
    quote:
      "დიდი მადლობა ოთარ... მიუხედავად ჩემი საკმაოდ არასტაბილური გრაფიკისა, დიდი ყურადღებით გამოგყვები კურსის მსვლეობისას.",
    name: "Giorgi Toidze",
    note: "აქტიური მონაწილე · მოქნილი სწავლა",
  },
  {
    quote: "მადლობა ამ გამოცდილების გაზიარებისთვის. საოცარი ადამიანი ხართ და პროფესიონალი ძალიან საინტერესოა",
    name: "Lizi",
    note: "აქტიური მონაწილე · პროფესიონალიზმი",
  },
];

const proFaqs = [
  {
    q: "მჭირდება პროგრამირების ცოდნა?",
    a: "არა. კურსი იწყება AI-სთან სწორი კომუნიკაციით და არ მოითხოვს კოდის წერას. Python და SQL კურსები გადმოგეცემათ ბონუსად, ხოლო n8n მოდული ავტომატიზაციას ვიზუალურად, დამწყებისთვის გასაგები ენით ხსნის.",
  },
  {
    q: "რას გულისხმობს მენტორშიფი?",
    a: "4 კვირის განმავლობაში გექნებათ სივრცე კითხვებისთვის, დახურული Discord ჯგუფი და ინდივიდუალური უკუკავშირი თქვენს პრომპტებსა და პრაქტიკულ დავალებებზე. ჩვენ დაგეხმარებით ცოდნის პრაქტიკაში დანერგვაში.",
  },
  {
    q: "რა ხდება კურსის შეძენის შემდეგ?",
    a: "შეძენისთანავე ელფოსტაზე მიიღებთ კურსზე წვდომის დეტალურ ინსტრუქციასა და მენტორშიფის ინფორმაციას. გადახდა უსაფრთხოდ მუშავდება Tally-ის ფორმით და საბანკო ბარათით/გადარიცხვით.",
  },
];

function CtaButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="campaign-cta" onClick={onClick}>
      <span>{label}</span>
      <ArrowRight aria-hidden="true" size={18} />
    </button>
  );
}

function PaymentLogos({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "campaign-payment-logos campaign-payment-logos--compact" : "campaign-payment-logos"}>
      {paymentLogos.map((name) => (
        <img key={name} src={`/assets/payment/${name}.svg`} alt={name} />
      ))}
    </div>
  );
}

function ProHeroVideo({ className = "" }: { className?: string }) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className={`campaign-hero-video ${className}`} aria-label="AI სრული პროგრამის ვიდეო">
      <iframe
        key={soundEnabled ? "sound-on" : "muted"}
        src={getProVideoUrl(soundEnabled)}
        title="AI სრული პროგრამის ვიდეო"
        loading="lazy"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
      <button
        type="button"
        className={`campaign-hero-video__sound${soundEnabled ? " is-on" : ""}`}
        onClick={() => setSoundEnabled(true)}
        disabled={soundEnabled}
      >
        <Volume2 aria-hidden="true" size={16} />
        <span>{soundEnabled ? "ხმა ჩართულია" : "ჩართე ხმა"}</span>
      </button>
    </div>
  );
}

function PromoActivateButton({
  isActive,
  onActivate,
  compact = false,
}: {
  isActive: boolean;
  onActivate: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={compact ? "campaign-promo-button campaign-promo-button--compact" : "campaign-promo-button"}
      onClick={onActivate}
      disabled={isActive}
    >
      {isActive ? "პრომო კოდი 150 გააქტიურებულია" : "გააქტიურე პრომო კოდი 150"}
    </button>
  );
}

function ProPromoBar({
  isActive,
  onActivate,
}: {
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <div className={`campaign-promo-bar${isActive ? " is-active" : ""}`}>
      <div className="campaign-shell campaign-promo-bar__inner">
        <div>
          <span>პრომო კოდი {PRO_PROMO_CODE}</span>
          <strong>
            {isActive
              ? `${PRO_PROMO_PRICE_LABEL} - ${PRO_PROMO_SAVINGS_MESSAGE} · მოქმედებს ${PRO_PROMO_DEADLINE_LABEL}`
              : `${PRO_PROMO_DISCOUNT_LABEL} ფასდაკლება AI სრულ პროგრამაზე · მოქმედებს ${PRO_PROMO_DEADLINE_LABEL}`}
          </strong>
        </div>
        <PromoActivateButton isActive={isActive} onActivate={onActivate} />
      </div>
    </div>
  );
}

function PromoConfetti() {
  return (
    <div className="campaign-promo-confetti" aria-hidden="true">
      {PRO_PROMO_CONFETTI.map((piece, index) => (
        <span
          key={`${piece.x}-${index}`}
          style={
            {
              "--confetti-x": piece.x,
              "--confetti-y": piece.y,
              "--confetti-r": piece.r,
              "--confetti-color": piece.c,
              "--confetti-delay": `${index * 18}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ProOffer({
  className = "",
  id,
  onBuy,
  isPromoActive,
  onActivatePromo,
  currentPriceLabel,
  discountBadge,
}: {
  className?: string;
  id?: string;
  onBuy: () => void;
  isPromoActive: boolean;
  onActivatePromo: () => void;
  currentPriceLabel: string;
  discountBadge: string;
}) {
  return (
    <div id={id} className={`campaign-hero__offer campaign-hero__offer--pro campaign-buy-anchor ${className}`}>
      <div className="campaign-offer-heading">
        <span>სრული AI პროგრამა</span>
        <strong>6 მოდული + მენტორშიფი</strong>
      </div>
      <div className="campaign-offer-promo">
        <span>{isPromoActive ? `${PRO_PROMO_CODE} კოდი მოქმედებს ${PRO_PROMO_DEADLINE_LABEL} - ${PRO_PROMO_SAVINGS_MESSAGE}` : `${PRO_PROMO_CODE} კოდი გაძლევს დამატებით ${PRO_PROMO_DISCOUNT_LABEL} ფასდაკლებას ${PRO_PROMO_DEADLINE_LABEL}`}</span>
        <PromoActivateButton isActive={isPromoActive} onActivate={onActivatePromo} compact />
      </div>
      <div className="campaign-final__price-row">
        <div>
          <span>ერთჯერადი ფასი</span>
          <span className="campaign-price__old">{PRO_FULL_PRICE_LABEL}</span>
          <strong>{currentPriceLabel}</strong>
        </div>
        <span className="campaign-price__save">{discountBadge}</span>
      </div>
      <CtaButton label={`შემოუერთდი პროგრამას — ${currentPriceLabel}`} onClick={onBuy} />
      <div className="campaign-offer-footer">
        <div className="campaign-secure-line">
          <ShieldCheck aria-hidden="true" size={16} />
          <span>უსაფრთხო გადახდა ბარათით ან საბანკო გადარიცხვით</span>
        </div>
        <div className="campaign-secure-line">
          <CheckCircle2 aria-hidden="true" size={16} />
          <span>14 დღე დაბრუნებისთვის, თუ კურსის გავლა ჯერ არ დაგიწყია</span>
        </div>
        <PaymentLogos compact />
      </div>
    </div>
  );
}

function ProHeroTestimonial() {
  const testimonial = proTestimonials[1];

  return (
    <blockquote className="campaign-hero-testimonial">
      <span>სტუდენტის გამოცდილება</span>
      <p>"{testimonial.quote}"</p>
      <footer>
        <strong>{testimonial.name}</strong>
        <small>{testimonial.note}</small>
      </footer>
    </blockquote>
  );
}

function ProInstructorTrustCard() {
  return (
    <div className="campaign-author-card">
      <div className="campaign-author-card__top">
        <img src="/media/external/images/otar-profile-photo.png" alt="" />
        <div>
          <span>კურსს უძღვება</span>
          <strong>ოთარ ზაკალაშვილი</strong>
          <small>BitCamp-ის დამფუძნებელი და ქართული ტექნოლოგიური კურსების ავტორი</small>
        </div>
      </div>

      <div className="campaign-author-card__credentials">
        {proInstructorCredentials.map((credential) => (
          <div key={credential}>
            <CheckCircle2 aria-hidden="true" size={16} />
            <span>{credential}</span>
          </div>
        ))}
      </div>

      <div className="campaign-author-card__stats" aria-label="ინსტრუქტორის გამოცდილება">
        <div>
          <strong>16 წელი</strong>
          <span>ტექ გამოცდილება</span>
        </div>
        <div>
          <strong>12 ქვეყანა</strong>
          <span>საერთაშორისო პროექტები</span>
        </div>
        <div>
          <strong>2 000+</strong>
          <span>სტუდენტი</span>
        </div>
      </div>
    </div>
  );
}

function FAQAccordion({ items }: { items: typeof proFaqs }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="campaign-faq">
      {items.map((item, i) => (
        <div className="campaign-faq__item" key={item.q}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <span aria-hidden="true">{open === i ? "-" : "+"}</span>
          </button>
          {open === i && <div className="campaign-faq__answer">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function AIPromptEngineering() {
  const location = useLocation();
  const [isPromoActive, setIsPromoActive] = useState(false);
  const [showPromoConfetti, setShowPromoConfetti] = useState(false);
  const currentPriceLabel = isPromoActive ? PRO_PROMO_PRICE_LABEL : PRO_CURRENT_PRICE_LABEL;
  const discountBadge = isPromoActive ? PRO_PROMO_SAVINGS_MESSAGE : PRO_DISCOUNT_WINDOW_LABEL;
  const scrollToBuySection = () => {
    window.setTimeout(() => {
      const anchors = Array.from(document.querySelectorAll<HTMLElement>(".campaign-buy-anchor"));
      const target = anchors.find((el) => el.offsetParent !== null) ?? anchors[0];
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };
  const activatePromo = () => {
    if (isPromoActive) return;
    setIsPromoActive(true);
    setShowPromoConfetti(true);
    scrollToBuySection();
  };
  const buy = () => handleBuy("pro", isPromoActive ? PRO_PROMO_CHECKOUT : undefined);

  useEffect(() => {
    rememberAttributionRef();
  }, []);

  useEffect(() => {
    if (location.hash !== "#purchase") return;
    const timer = window.setTimeout(() => {
      const anchors = Array.from(document.querySelectorAll<HTMLElement>(".campaign-buy-anchor"));
      const target = anchors.find((el) => el.offsetParent !== null) ?? anchors[0];
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  useEffect(() => {
    if (!showPromoConfetti) return;
    const timer = window.setTimeout(() => setShowPromoConfetti(false), 1800);
    return () => window.clearTimeout(timer);
  }, [showPromoConfetti]);

  return (
    <div className={`campaign-page campaign-page--pro${isPromoActive ? " campaign-page--promo-active" : ""}`}>
      <SEO
        title={`AI სრული პროგრამა მენტორობით — ${PRO_CURRENT_PRICE_LABEL} | BitCamp`}
        description="6-მოდულიანი AI პროგრამა მენტორობით: prompting, business AI, visual AI, Custom GPTs, n8n ავტომატიზაცია, Python/SQL ბონუსები და 4 კვირიანი სამენტორო მხარდაჭერა."
        image="https://www.bitcamp.ge/ai-meta.png"
        url="https://www.bitcamp.ge/ai"
      />
      <Helmet>
        <script async src="https://tally.so/widgets/embed.js" />
      </Helmet>

      <ProPromoBar isActive={isPromoActive} onActivate={activatePromo} />
      {showPromoConfetti ? <PromoConfetti /> : null}

      <main>
        <section className="campaign-hero">
          <div className="campaign-shell campaign-hero__grid">
            <div className="campaign-hero__copy">
              <p className="campaign-eyebrow">AI-ს სრული პროგრამა მენტორშიფით</p>
              <h1>0 - დან AI ავტომატიზაციამდე</h1>
              <p className="campaign-lead">
                6-მოდულიანი პრაქტიკული პროგრამა მათთვის, ვისაც AI-ს გამოყენება რეალური სამუშაო პროცესების დასაჩქარებლად და გასამარტივებლად სურს.
              </p>

              <ProHeroVideo className="campaign-hero-video--inline" />

              <div className="campaign-hero__facts" aria-label="პროგრამის ძირითადი ინფორმაცია">
                <span>
                  <BookOpen aria-hidden="true" size={16} />
                  6 მოდული
                </span>
                <span>
                  <Users aria-hidden="true" size={16} />
                  4 კვირიანი მენტორშიფი
                </span>
                <span>
                  <MessageSquareText aria-hidden="true" size={16} />
                  Discord მხარდაჭერა
                </span>
                <span>
                  <CheckCircle2 aria-hidden="true" size={16} />
                  უკუკავშირი პრაქტიკაზე
                </span>
              </div>

              <ProInstructorTrustCard />
              <ProHeroTestimonial />

              <ProOffer
                className="campaign-hero__offer--inline"
                onBuy={buy}
                isPromoActive={isPromoActive}
                onActivatePromo={activatePromo}
                currentPriceLabel={currentPriceLabel}
                discountBadge={discountBadge}
              />
            </div>

            <div className="campaign-hero__visual">
              <ProHeroVideo className="campaign-hero-video--desktop" />
              <ProOffer
                id="purchase"
                className="campaign-hero__offer--desktop"
                onBuy={buy}
                isPromoActive={isPromoActive}
                onActivatePromo={activatePromo}
                currentPriceLabel={currentPriceLabel}
                discountBadge={discountBadge}
              />

            </div>
          </div>
        </section>

        <CampaignStickyCta
          eyebrow="სრული პროგრამა"
          price={currentPriceLabel}
          label="შემოუერთდი"
          onClick={buy}
        />

        <section className="campaign-proof-strip" aria-label="ნდობის მაჩვენებლები">
          <div className="campaign-shell campaign-proof-strip__grid">
            <div>
              <strong>6 მოდული</strong>
              <span>prompting-იდან n8n ავტომატიზაციამდე</span>
            </div>
            <div>
              <strong>4 კვირა</strong>
              <span>მენტორშიფი, კითხვები და უკუკავშირი</span>
            </div>
            <div>
              <strong>2 000+</strong>
              <span>კმაყოფილი სტუდენტი BitCamp-ის AI კურსებში</span>
            </div>
            <div>
              <strong>2</strong>
              <span>ბონუს კურსი: Python და SQL</span>
            </div>
          </div>
        </section>

        <section className="campaign-section campaign-section--decision">
          <div className="campaign-shell campaign-decision-grid">
            <div className="campaign-fit-copy">
              <p className="campaign-kicker">რატომ სრული პროგრამა</p>
              <h2>თუ გსურს AI ყოველდღიურ სამუშაო ინსტრუმენტად აქციო, მხოლოდ პრომპტების სია არ არის საკმარისი.</h2>
              <div className="campaign-fit-list">
                {mentorSteps.map((step) => (
                  <div key={step.title}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <span>
                      <strong>{step.title}</strong> — {step.body}
                    </span>
                  </div>
                ))}
              </div>
              <blockquote className="campaign-proof-quote">
                <p>"{proTestimonials[1].quote}"</p>
                <footer>
                  <strong>{proTestimonials[1].name}</strong>
                  <span>{proTestimonials[1].note}</span>
                </footer>
              </blockquote>
            </div>

            <div className="campaign-prompt-demo">
              <p className="campaign-kicker">პაკეტში შედის</p>
              <h3>პროგრამა აერთიანებს თეორიას, პრაქტიკას და მენტორულ მხარდაჭერას.</h3>
              <div className="campaign-included-list campaign-included-list--panel">
                {proIncludes.map((item) => (
                  <div key={item}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="campaign-cta-band">
          <div className="campaign-shell campaign-cta-band__inner">
            <div className="campaign-cta-band__copy">
              <p className="campaign-kicker">რეკომენდებული გზა</p>
              <h2>აირჩიე ეს კურსი, თუ გინდა სწავლა დასრულდეს რეალური ავტომატიზაციებით და არა მხოლოდ თეორიით.</h2>
              <p>
                ეს პროგრამა კი გაძლევს სრულ ბილიკს:
                Advanced Prompting, Business AI, Visual AI, Custom GPTs, n8n ავტომატიზაცია და მენტორული უკუკავშირი პრაქტიკაზე.
              </p>
              <div className="campaign-cta-band__meta">
                <span>
                  <BookOpen aria-hidden="true" size={16} />
                  6 მოდული
                </span>
                <span>
                  <CalendarDays aria-hidden="true" size={16} />
                  4 კვირიანი სამენტორო მხარდაჭერა
                </span>
                <span>
                  <ShieldCheck aria-hidden="true" size={16} />
                  უსაფრთხო გადახდა
                </span>
              </div>
            </div>

            <div className="campaign-cta-band__action">
              <div className="campaign-cta-price-line">
                <div>
                  <span>სრული პროგრამა</span>
                  <span className="campaign-price__old">{PRO_FULL_PRICE_LABEL}</span>
                  <strong>{currentPriceLabel}</strong>
                </div>
                <span className="campaign-price__save">{discountBadge}</span>
              </div>
              <CtaButton label={`შემოუერთდი პროგრამას — ${currentPriceLabel}`} onClick={buy} />
              <PaymentLogos compact />
            </div>
          </div>
        </section>

        <section className="campaign-section">
          <div className="campaign-shell">
            <div className="campaign-section-heading">
              <p className="campaign-kicker">რას შეცვლის პროგრამა</p>
              <h2>ეს არის გზა AI-ის რიგითი მომხმარებლობიდან, ავტომატიზებული სისტემების შექმნამდე.</h2>
            </div>

            <div className="campaign-outcome-grid">
              {proOutcomes.map((outcome) => {
                const Icon = outcome.icon;
                return (
                  <div className="campaign-outcome-card" key={outcome.label}>
                    <div className="campaign-card-icon">
                      <Icon aria-hidden="true" size={20} />
                    </div>
                    <p>{outcome.label}</p>
                    <h3>{outcome.title}</h3>
                    <span>{outcome.body}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="campaign-section campaign-section--surface">
          <div className="campaign-shell">
            <div className="campaign-section-heading">
              <p className="campaign-kicker">სრული სასწავლო პროგრამა</p>
              <h2>6 მოდული: პრომპტინგიდან აგენტებამდე და n8n ავტომატიზაციამდე.</h2>
            </div>

            <div className="campaign-module-grid">
              {fullProgramModules.map((module) => {
                const Icon = module.icon;
                return (
                  <article className="campaign-module-card" key={module.n}>
                    <div className="campaign-module-card__top">
                      <div className="campaign-card-icon">
                        <Icon aria-hidden="true" size={20} />
                      </div>
                      <div>
                        <span>მოდული {module.n}</span>
                        <h3>{module.title}</h3>
                        <small>{module.subtitle}</small>
                      </div>
                    </div>
                    <p>{module.goal}</p>
                    <ul>
                      {module.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="campaign-section">
          <div className="campaign-shell campaign-instructor-section">
            <div className="campaign-instructor-photo">
              <img src="/media/external/images/otar-spotlight-clean.png" alt="ოთარ ზაკალაშვილი" />
            </div>

            <div className="campaign-instructor-copy">
              <p className="campaign-kicker">ვისგან სწავლობ</p>
              <h2>პრაქტიკოსისგან, რომელმაც ქართული ტექნოლოგიური კურსების სტანდარტი შექმნა.</h2>
              <p className="campaign-body">
                ოთარი BitCamp-ის დამფუძნებელია და წლებია ქმნის კურსებს პროგრამირებაში,
                მონაცემთა ანალიზსა და AI-ში. ამ პროგრამის მიზანია რთული AI კონცეფციები ახსნას
                მარტივ, პრაქტიკულ ენაზე: როგორ მივცეთ სწორი კონტექსტი, როგორ ავაწყოთ პროცესი და როგორ
                ვაქციოთ შედეგი განმეორებად ავტომატიზაციად.
              </p>

              <div className="campaign-credential-list">
                <div>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>Python, SQL, Web და AI კურსების ავტორი BitCamp-ში</span>
                </div>
                <div>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>2 000+ კმაყოფილ სტუდენტზე გამოცდილი ფორმატი: თეორია, ჩარჩო და პრაქტიკა</span>
                </div>
                <div>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>მენტორული მხარდაჭერა მათთვის, ვისაც ცოდნის პრაქტიკაში გამოყენება სურს</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="campaign-section campaign-section--surface">
          <div className="campaign-shell">
            <div className="campaign-section-heading">
              <p className="campaign-kicker">სტუდენტების ხმა</p>
              <h2>შეფასებები და შთაბეჭდილებები</h2>
            </div>

            <div className="campaign-testimonial-grid">
              {proTestimonials.map((testimonial) => (
                <div className="campaign-testimonial" key={`${testimonial.name}-${testimonial.note}`}>
                  <blockquote>"{testimonial.quote}"</blockquote>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="campaign-section">
          <div className="campaign-shell campaign-faq-grid">
            <div>
              <p className="campaign-kicker">კითხვები</p>
              <h2>მოკლე პასუხები გადაწყვეტილების წინ.</h2>
            </div>
            <FAQAccordion items={proFaqs} />
          </div>
        </section>

        <section className="campaign-final">
          <div className="campaign-shell campaign-final__inner">
            <div className="campaign-final__copy">
              <p className="campaign-kicker">ბოლო ნაბიჯი</p>
              <h2>თუ AI უკვე მნიშვნელოვანია შენს საქმეში, აირჩიე სრული გზა მენტორშიფით.</h2>
              <p>
                მიიღებ 6-მოდულიან პროგრამას, Python/SQL ბონუსებს, დახურულ Discord ჯგუფსა და 4-კვირიან უკუკავშირს, რათა ცოდნა რეალურ საქმეში დანერგო.
              </p>
            </div>
            <div className="campaign-final__panel">
              <div className="campaign-final__deadline">
                <span>სრული პროგრამა</span>
                <strong>6 მოდული + 4 კვირიანი მენტორშიფი</strong>
              </div>
              <div className="campaign-final__price-row">
                <div>
                  <span>ერთჯერადი ფასი</span>
                  <span className="campaign-price__old">{PRO_FULL_PRICE_LABEL}</span>
                  <strong>{currentPriceLabel}</strong>
                </div>
                <span className="campaign-price__save">{discountBadge}</span>
              </div>
              <CtaButton label={`შემოუერთდი პროგრამას — ${currentPriceLabel}`} onClick={buy} />
              <PaymentLogos compact />
            </div>
          </div>
        </section>
      </main>

      <CampaignFooter />
      <FlittCheckoutModal />
    </div>
  );
}
