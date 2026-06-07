import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  MessageSquareText,
  ShieldCheck,
  Users,
  Video,
  Volume2,
  Workflow,
} from "lucide-react";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignStickyCta } from "@/components/campaign/CampaignStickyCta";
import { FlittCheckoutModal } from "@/components/campaign/FlittCheckoutModal";
import { handleBuy, PRODUCTS } from "@/lib/checkout";

const paymentLogos = ["visa", "mastercard", "apple-pay", "google-pay"] as const;
const BOOTCAMP_VIDEO_BASE_URL =
  "https://player.mediadelivery.net/embed/678241/5c33a6d3-33fc-41a5-83ca-1a9c8ee702ff?autoplay=true&loop=false&muted=true&preload=true&responsive=true";
const BOOTCAMP_START_PRICE = 99;
const BOOTCAMP_NEXT_PRICE = 119;
const BOOTCAMP_FUTURE_PRICE_STEPS = [189, 229, 319];
// Current price is owned by checkout config so UI, analytics, and Flitt button updates stay in sync.
const BOOTCAMP_CURRENT_PRICE = PRODUCTS.bootcamp.value;
const BOOTCAMP_FULL_PRICE = 449;
const BOOTCAMP_PRICE_STEPS = [
  BOOTCAMP_START_PRICE,
  BOOTCAMP_NEXT_PRICE,
  BOOTCAMP_CURRENT_PRICE,
  ...BOOTCAMP_FUTURE_PRICE_STEPS,
  BOOTCAMP_FULL_PRICE,
];

const formatGel = (value: number) => `₾${value}`;
const getBootcampVideoUrl = (soundEnabled: boolean) =>
  BOOTCAMP_VIDEO_BASE_URL.replace("muted=true", `muted=${soundEnabled ? "false" : "true"}`);
const BOOTCAMP_CURRENT_PRICE_LABEL = formatGel(BOOTCAMP_CURRENT_PRICE);
const BOOTCAMP_FULL_PRICE_LABEL = formatGel(BOOTCAMP_FULL_PRICE);
const BOOTCAMP_SAVINGS = BOOTCAMP_FULL_PRICE - BOOTCAMP_CURRENT_PRICE;
const BOOTCAMP_CURRENT_PRICE_STEP_INDEX = Math.max(0, BOOTCAMP_PRICE_STEPS.indexOf(BOOTCAMP_CURRENT_PRICE));
const BOOTCAMP_PRICE_PROGRESS = Math.round(
  (BOOTCAMP_CURRENT_PRICE_STEP_INDEX / (BOOTCAMP_PRICE_STEPS.length - 1)) * 100
);

const outcomes = [
  {
    label: "შედეგი 01",
    title: "AI-სგან იღებ ზუსტ პასუხებს",
    body: "T.C.R.E.I. ფორმულის დახმარებით, პირველივე ცდაზე მიიღებ სასურველ შედეგს და დაზოგავ დროს.",
    icon: MessageSquareText,
  },
  {
    label: "შედეგი 02",
    title: "ამუშავებ მონაცემებს წამებში",
    body: "ისწავლი CSV ფაილების დამუშავებას და რთული დავალებების ეტაპობრივად შესრულებას (Prompt Chaining).",
    icon: Database,
  },
  {
    label: "შედეგი 03",
    title: "AI ხდება შენი ყოველდღიური ინსტრუმენტი",
    body: "ისწავლი AI-ს ეფექტურად გამოყენებას ისე, რომ ის შენი ყოველდღიური საქმის განუყოფელი ნაწილი გახდეს.",
    icon: Workflow,
  },
];

const lessonHighlights = [
  { n: "03", title: "რა არის Prompting?", detail: "როგორ ვაქცევთ ბუნდოვან მოთხოვნას ზუსტ ამოცანად" },
  { n: "07", title: "კონტექსტი", detail: "რატომ არის კონტექსტი პასუხის ხარისხის მთავარი მმართველი" },
  { n: "14", title: "T.C.R.E.I. მოდელი", detail: "BitCamp-ის პრაქტიკული ჩარჩო ძლიერი პრომპტებისთვის" },
  { n: "20", title: "Prompt Chaining", detail: "როგორ დავყოთ რთული პროცესი მართვად ნაბიჯებად" },
  { n: "22", title: "ცხრილური მონაცემები", detail: "CSV ფაილების დამუშავება და ანალიზი AI-სთან ერთად" },
  { n: "25", title: "JSON", detail: "სტრუქტურირებული პასუხები ავტომატიზაციისთვის" },
];

const included = [
  "25 ვიდეო გაკვეთილი, მოკლე და პრაქტიკაზე ორიენტირებული",
  "სამუდამო წვდომა ყველა გაკვეთილსა და მომავალ განახლებაზე",
  "Python-ის სრული კურსი ბონუსად",
  "SQL-ის სრული კურსი ბონუსად",
  "50+ მზა პრომპტის ბიბლიოთეკა",
];

const fitSignals = [
  "ChatGPT-ს იყენებ, მაგრამ პასუხები ხან ზედაპირულია და ხან გამოსადეგი",
  "გინდა AI საქმეში გამოიყენო: ტექსტში, კვლევაში, ანალიზში ან კომუნიკაციაში",
  "არ ხარ პროგრამისტი და გჭირდება მარტივი, განმეორებადი ჩარჩო",
  "გინდა მზა პრომპტები და მაგალითები, რომ ყოველი მოთხოვნა თავიდან არ ააწყო",
];

const instructorCredentials = [
  "BitCamp-ის დამფუძნებელი",
  "Python, SQL, კომპ. მეცნიერების, Full-Stack Web Development და AI კურსების ავტორი",
  "16 წლიანი გამოცდილება ტექნოლოგიურ ინდუსტრიაში",
  "სენიორ პროგრამულ ინჟინრად მუშაობის ისტორია ამერიკაში, კანადაში და ევროპის 12 ქვეყანაში",
];

const heroPreviewDays = [
  {
    day: "დღე 01",
    title: "სწორი მოთხოვნის აწყობა",
    items: ["რა არის Prompting", "კონტექსტის მიცემა", "T.C.R.E.I. ფორმულა"],
  },
  {
    day: "დღე 02",
    title: "AI რეალურ საქმეში",
    items: ["Prompt Chaining", "CSV / JSON პასუხები", "50+ მზა პრომპტი"],
  },
];

const promptFormula = [
  { letter: "T", label: "ამოცანა" },
  { letter: "C", label: "კონტექსტი" },
  { letter: "R", label: "როლი" },
  { letter: "E", label: "მაგალითი" },
  { letter: "I", label: "გაუმჯობესება" },
];

const testimonials = [
  {
    quote:
      "დიდი მადლობა, ძალიან სასარგებლო კურსია.. მოვრჩით frameworks და ძალიან საინტერესო დასკვნა გამოვიტანე... ამის მერე სისტემურად და გააზრებულად ბევრად ეფექტურ შედეგს მივიღებ.",
    name: "მიხეილ ჯერიაშვილი",
    note: "აქტიური მონაწილე · სისტემური მიდგომა",
  },
  {
    quote:
      "ვიდეო გაკვეთილები ჩანაწერის სახით ჩემთვის როგორც ემიგრანტისთვის, რომელსაც ძალიან დატვირთული გრაფიკი აქვს, ძალიან მოსახერხებელია.",
    name: "Ia Kiknadze",
    note: "აქტიური მონაწილე · მოქნილი ფორმატი",
  },
  {
    quote:
      "ნამდვილად კარგი ფორმატია მოკლე ვიდეოების... ვინც ახლა იწყებს ახალი პროფესიის ათვისებას მოკლე ვიდეოებით დაწყება სჯობს.",
    name: "George Gegelia",
    note: "აქტიური მონაწილე · მოკლე ვიდეოები",
  },
];

const faqs = [
  {
    q: "ვისთვის არის ეს Bootcamp?",
    a: "მათთვის, ვინც უკვე იყენებს ChatGPT-ს ან სხვა AI ხელსაწყოს, მაგრამ შედეგები ჯერ არ არის სტაბილური. პროგრამირება საჭირო არ არის; საჭიროა მხოლოდ სურვილი, რომ AI-სთან მუშაობა გახდეს უფრო სისტემური.",
  },
  {
    q: "რა მოხდება 26 მაისის შემდეგ?",
    a: `ფასი იზრდება ეტაპობრივად: ${formatGel(BOOTCAMP_START_PRICE)}-დან ${BOOTCAMP_FULL_PRICE_LABEL}-მდე. გადახდისას მოქმედებს ის ფასი, რომელიც ღილაკზე ჩანს.`,
  },
  {
    q: "რა ხდება შეძენის შემდეგ?",
    a: "შეძენისთანავე ელფოსტაზე მიიღებთ კურსზე წვდომის დეტალურ ინსტრუქციას. გადახდა უსაფრთხოდ მუშავდება Tally-ის ფორმით და საბანკო ბარათით/გადარიცხვით.",
  },
  {
    q: "შესაძლებელია თანხის დაბრუნება?",
    a: (
      <>
        დიახ, 14 დღის განმავლობაში, თუ კურსის გავლა ჯერ არ დაგიწყია. სრული პირობებისთვის იხილე{" "}
        <Link to="/terms" className="campaign-text-link">
          მომსახურების პირობები
        </Link>
        .
      </>
    ),
  },
];

function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("campaign-reveal");
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("is-visible");
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

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

function PriceBlock({ align = "left" }: { align?: "left" | "center" }) {
  return (
    <div className={`campaign-price campaign-price--${align}`}>
      <p className="campaign-price__label">მიმდინარე ფასი</p>
      <div className="campaign-price__row">
        <span className="campaign-price__old">{BOOTCAMP_FULL_PRICE_LABEL}</span>
        <span className="campaign-price__save">დაზოგე {formatGel(BOOTCAMP_SAVINGS)}</span>
      </div>
      <div className="campaign-price__new">{BOOTCAMP_CURRENT_PRICE_LABEL}</div>
    </div>
  );
}

function PriceReturnProgress() {
  return (
    <div
      className="campaign-price-return"
      style={
        {
          "--campaign-price-progress": `${BOOTCAMP_PRICE_PROGRESS}%`,
          "--campaign-price-step-count": BOOTCAMP_PRICE_STEPS.length,
        } as React.CSSProperties
      }
      aria-label={`მიმდინარე ფასი ${BOOTCAMP_CURRENT_PRICE_LABEL}; სრული ფასი ${BOOTCAMP_FULL_PRICE_LABEL}`}
    >
      <div className="campaign-price-return__top">
        <span>ფასი იზრდება ეტაპობრივად</span>
        <strong>
          {BOOTCAMP_CURRENT_PRICE_LABEL} / {BOOTCAMP_FULL_PRICE_LABEL}
        </strong>
      </div>
      <div
        className="campaign-price-return__track"
        role="progressbar"
        aria-valuemin={BOOTCAMP_START_PRICE}
        aria-valuemax={BOOTCAMP_FULL_PRICE}
        aria-valuenow={BOOTCAMP_CURRENT_PRICE}
      >
        <span className="campaign-price-return__fill" />
      </div>
      <div className="campaign-price-return__ticks" aria-hidden="true">
        {BOOTCAMP_PRICE_STEPS.map((price) => (
          <span
            key={price}
            className={price <= BOOTCAMP_CURRENT_PRICE ? "is-active" : undefined}
          />
        ))}
      </div>
      <div className="campaign-price-return__meta">
        <span>საწყისი იყო {formatGel(BOOTCAMP_START_PRICE)}</span>
        <span>წინა {formatGel(BOOTCAMP_NEXT_PRICE)}</span>
        <span className="is-current">ახლა {BOOTCAMP_CURRENT_PRICE_LABEL}</span>
        <span>
          შემდეგ {BOOTCAMP_FUTURE_PRICE_STEPS.map(formatGel).join(", ")} · ბოლოს {BOOTCAMP_FULL_PRICE_LABEL}
        </span>
      </div>
      <p>გადახდისას მოქმედებს ის ფასი, რომელიც ღილაკზე ჩანს.</p>
    </div>
  );
}

function GeorgianFlagMark() {
  return (
    <div className="campaign-flag-mark" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function HeroOffer({
  className = "",
  onBuy,
}: {
  className?: string;
  onBuy: () => void;
}) {
  return (
    <div className={`campaign-hero__offer campaign-hero__offer--price-return ${className}`}>
      <GeorgianFlagMark />
      <div className="campaign-offer-heading">
        <span>მოასწარი სანამ გაიზრდება</span>
        <strong>ფასი იზრდება ეტაპობრივად</strong>
      </div>
      <PriceReturnProgress />
      <div className="campaign-hero__buy">
        <PriceBlock />
        <CtaButton label={`დაიწყე სწავლა — ${BOOTCAMP_CURRENT_PRICE_LABEL}`} onClick={onBuy} />
      </div>
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

function InstructorTrustCard() {
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
        {instructorCredentials.map((credential) => (
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

function HeroTestimonial() {
  const testimonial = testimonials[0];

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

function BootcampHeroVideo({ className = "" }: { className?: string }) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className={`campaign-hero-video ${className}`} aria-label="AI Bootcamp ვიდეო">
      <iframe
        key={soundEnabled ? "sound-on" : "muted"}
        src={getBootcampVideoUrl(soundEnabled)}
        title="AI Bootcamp ვიდეო"
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

function HeroCoursePreview() {
  return (
    <div className="campaign-hero-preview" aria-label="კურსის მოკლე სტრუქტურა">
      <div className="campaign-hero-preview__header">
        <span>რას იწყებ პირველივე დღეს</span>
        <strong>2 დღიანი პრაქტიკული სტარტი</strong>
        <p>
          კურსი არ იწყება თეორიით. პირველივე გაკვეთილებიდან აწყობ მოთხოვნას, იღებ უკეთეს პასუხს და
          ხედავ როგორ გამოიყენო AI ყოველდღიურ საქმეში.
        </p>
      </div>

      <div className="campaign-hero-preview__days">
        {heroPreviewDays.map((day) => (
          <div className="campaign-hero-preview__day" key={day.day}>
            <span>{day.day}</span>
            <strong>{day.title}</strong>
            <ul>
              {day.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="campaign-formula-card">
        <div>
          <span>კურსის მთავარი ჩარჩო</span>
          <strong>T.C.R.E.I.</strong>
        </div>
        <div className="campaign-formula-grid">
          {promptFormula.map((item) => (
            <div key={item.letter}>
              <strong>{item.letter}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="campaign-hero-preview__footer">
        <CheckCircle2 aria-hidden="true" size={18} />
        <span>შედეგი: იცი არა მხოლოდ “რა დაწერო”, არამედ როგორ ააწყო მოთხოვნა თავიდან სწორად.</span>
      </div>
    </div>
  );
}

function FAQAccordion({ items }: { items: typeof faqs }) {
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

export default function AIBootcamp() {
  const buy = () => handleBuy("bootcamp");

  return (
    <div className="campaign-page campaign-page--bootcamp">
      <Helmet>
        <meta name="robots" content="noindex" />
        <title>{`AI Prompt Engineering Bootcamp - ${BOOTCAMP_CURRENT_PRICE_LABEL} | BitCamp`}</title>
        <meta
          name="description"
          content={`AI Prompt Engineering Bootcamp თვითსწავლისთვის: 25 გაკვეთილი, T.C.R.E.I. ჩარჩო, 50+ პრომპტი და Python/SQL ბონუსები ${BOOTCAMP_CURRENT_PRICE_LABEL}-ად.`}
        />
        <meta property="og:title" content={`AI Prompt Engineering Bootcamp - ${BOOTCAMP_CURRENT_PRICE_LABEL} | BitCamp`} />
        <meta
          property="og:description"
          content="ისწავლე AI-სთან მუშაობა საკუთარ ტემპში: 25 გაკვეთილი, T.C.R.E.I. ჩარჩო, პრომპტების ბიბლიოთეკა და Python/SQL ბონუსები."
        />
        <meta property="og:image" content="https://www.bitcamp.ge/ai-meta.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main>
        <section className="campaign-hero">
          <div className="campaign-shell campaign-hero__grid">
            <div className="campaign-hero__copy">
              <p className="campaign-eyebrow">კურსის ფასი იზრდება ეტაპობრივად</p>
              <h1>
                დაიწყე AI-ს სწორად გამოყენება <span className="campaign-nowrap">2 დღეში</span>
              </h1>
              <p className="campaign-lead">
                ისწავლე ChatGPT, Gemini და Claude ისე, რომ T.C.R.E.I.-ით დაზოგო დრო პირველივე დღიდან.
              </p>

              <BootcampHeroVideo className="campaign-hero-video--inline" />

              <div className="campaign-hero__facts" aria-label="კურსის ძირითადი ინფორმაცია">
                <span>
                  <Video aria-hidden="true" size={16} />
                  25 გაკვეთილი
                </span>
                <span>
                  <CheckCircle2 aria-hidden="true" size={16} />
                  0-დან დამწყებთათვის
                </span>
                <span>
                  <BookOpen aria-hidden="true" size={16} />
                  Python + SQL ბონუსად
                </span>
                <span>
                  <Users aria-hidden="true" size={16} />
                  2 000+ კმაყოფილი სტუდენტი
                </span>
              </div>

              <HeroTestimonial />

              <InstructorTrustCard />

              <HeroOffer className="campaign-hero__offer--inline" onBuy={buy} />
            </div>

            <div className="campaign-hero__visual">
              <BootcampHeroVideo className="campaign-hero-video--desktop" />
              <HeroOffer className="campaign-hero__offer--desktop" onBuy={buy} />
              <HeroCoursePreview />
            </div>
          </div>
        </section>

        <CampaignStickyCta
          eyebrow="თვითსწავლა"
          price={BOOTCAMP_CURRENT_PRICE_LABEL}
          label="დაიწყე სწავლა"
          onClick={buy}
        />

        <section className="campaign-proof-strip" aria-label="ნდობის მაჩვენებლები">
          <div className="campaign-shell campaign-proof-strip__grid">
            <div>
              <strong>2 000+</strong>
              <span>კმაყოფილი სტუდენტი BitCamp-ის AI კურსებში</span>
            </div>
            <div>
              <strong>25</strong>
              <span>დასრულებული ვიდეო გაკვეთილი ახლავე</span>
            </div>
            <div>
              <strong>2</strong>
              <span>ბონუს კურსი: Python და SQL</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>მზა პრომპტი ყოველდღიური სამუშაოსთვის</span>
            </div>
          </div>
        </section>

        <section className="campaign-section campaign-section--decision">
          <div className="campaign-shell campaign-decision-grid">
            <FadeIn className="campaign-fit-copy">
              <p className="campaign-kicker">ვისთვისაა</p>
              <h2>ეს კურსი შენთვისაა, თუ გსურს დაზოგო დრო და მიიღო უკეთესი შედეგები.</h2>
              <div className="campaign-fit-list">
                {fitSignals.map((item) => (
                  <div key={item}>
                    <CheckCircle2 aria-hidden="true" size={18} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <blockquote className="campaign-proof-quote">
                <p>"{testimonials[0].quote}"</p>
                <footer>
                  <strong>{testimonials[0].name}</strong>
                  <span>{testimonials[0].note}</span>
                </footer>
              </blockquote>
            </FadeIn>

            <FadeIn className="campaign-prompt-demo" aria-label="პრომპტის გაუმჯობესების მაგალითი">
              <p className="campaign-kicker">რას ცვლის ჩარჩო</p>
              <h3>ერთი ბუნდოვანი მოთხოვნა გადაიქცევა სამუშაო ინსტრუქციად.</h3>
              <div className="campaign-prompt-card campaign-prompt-card--before">
                <span>მანამდე</span>
                <p>დამიწერე პოსტი ჩემი ბიზნესისთვის.</p>
              </div>
              <div className="campaign-prompt-card campaign-prompt-card--after">
                <span>შემდეგ T.C.R.E.I.-ით</span>
                <p>
                  დაწერე LinkedIn პოსტი მცირე ბიზნესის მფლობელისთვის. გამოიყენე პრაქტიკული ტონი,
                  ახსენი ერთი პრობლემა, აჩვენე 3 ნაბიჯი და ბოლოს დაამატე მოკლე CTA.
                </p>
              </div>
              <div className="campaign-prompt-result">
                <CheckCircle2 aria-hidden="true" size={18} />
                <span>შედეგი: ნაკლები გადაკეთება, უფრო ზუსტი პასუხი და პრომპტი, რომელსაც შემდეგაც გამოიყენებ.</span>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="campaign-section campaign-section--surface">
          <div className="campaign-shell campaign-two-column">
            <FadeIn>
              <p className="campaign-kicker">რატომ ახლა</p>
              <h2>AI-ს ცოდნა უკვე აღარ ნიშნავს მხოლოდ კარგი ტექსტის დაწერას.</h2>
            </FadeIn>
            <FadeIn>
              <p className="campaign-body">
                ბევრმა უკვე სცადა ChatGPT, მაგრამ ყოველდღიურ საქმეში მაინც იღებს არათანაბარ შედეგებს:
                ზოგჯერ კარგი პასუხი, ზოგჯერ ზედაპირული ტექსტი, ზოგჯერ დაკარგული საათები. ეს Bootcamp
                გაძლევს მეთოდს, რომ AI-სთან მუშაობა გახდეს სტრუქტურირებული და განმეორებადი.
              </p>
              <div className="campaign-insight-box">
                <span>კურსის მთავარი იდეა</span>
                <strong>AI არ არის ჯადოსნური პასუხების ყუთი. ის არის სამუშაო სისტემა, თუ სწორად აძლევ კონტექსტს.</strong>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="campaign-section">
          <div className="campaign-shell">
            <FadeIn className="campaign-section-heading">
              <p className="campaign-kicker">რას შეცვლის კურსი</p>
              <h2>სამი პრაქტიკული უნარი, რომელიც დაუყოვნებლივ გაზრდის შენს პროდუქტიულობას.</h2>
            </FadeIn>

            <div className="campaign-outcome-grid">
              {outcomes.map((outcome) => {
                const Icon = outcome.icon;
                return (
                  <FadeIn className="campaign-outcome-card" key={outcome.label}>
                    <div className="campaign-card-icon">
                      <Icon aria-hidden="true" size={20} />
                    </div>
                    <p>{outcome.label}</p>
                    <h3>{outcome.title}</h3>
                    <span>{outcome.body}</span>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        <section className="campaign-section campaign-section--surface">
          <div className="campaign-shell campaign-instructor-section">
            <FadeIn className="campaign-instructor-photo">
              <img src="/media/external/images/otar-spotlight-clean.png" alt="ოთარ ზაკალაშვილი" />
            </FadeIn>

            <FadeIn className="campaign-instructor-copy">
              <p className="campaign-kicker">ვისგან სწავლობ</p>
              <h2>პრაქტიკოსისგან, რომელმაც ქართული ტექნოლოგიური კურსების სტანდარტი შექმნა.</h2>
              <p className="campaign-body">
                ოთარი BitCamp-ის დამფუძნებელია და წლებია ქმნის კურსებს პროგრამირებაში,
                მონაცემთა ანალიზსა და AI-ში. ამ Bootcamp-ში აქცენტი კეთდება არა რთულ ტერმინებზე,
                არამედ იმაზე, თუ როგორ გამოიყენოს არატექნიკურმა ადამიანმა AI თავისი სამუშაოს გასამარტივებლად.
              </p>

              <div className="campaign-credential-list">
                <div>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>ქართული ვიდეო გაკვეთილები დამწყებისთვის გასაგები ენით</span>
                </div>
                <div>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>Python, SQL, Web და AI სასწავლო მიმართულებების ავტორი BitCamp-ში</span>
                </div>
                <div>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>2 000+ კმაყოფილ სტუდენტთან გამოცდილი ფორმატი: მოკლე გაკვეთილი, ჩარჩო და პრაქტიკა</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="campaign-section">
          <div className="campaign-shell campaign-curriculum">
            <FadeIn className="campaign-section-heading">
              <p className="campaign-kicker">სილაბუსი</p>
              <h2>25 გაკვეთილი, რომელიც გეხმარება AI-სთან საუბარი აქციო სამუშაო სისტემად.</h2>
            </FadeIn>

            <div className="campaign-lesson-list">
              {lessonHighlights.map((lesson) => (
                <FadeIn className="campaign-lesson-row" key={lesson.n}>
                  <span>{lesson.n}</span>
                  <div>
                    <strong>{lesson.title}</strong>
                    <p>{lesson.detail}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn className="campaign-muted-note">
              სრული პროგრამა შეიცავს კიდევ 19 გაკვეთილს, პრაქტიკულ დავალებებს და მზა პრომპტების ბიბლიოთეკას.
            </FadeIn>
          </div>
        </section>

        <section className="campaign-section campaign-section--surface">
          <div className="campaign-shell campaign-included-grid">
            <FadeIn>
              <p className="campaign-kicker">რას მიიღებ</p>
              <h2>Bootcamp არ არის მხოლოდ ვიდეოების ნაკრები.</h2>
              <p className="campaign-body">
                მთავარი ღირებულება არის თვითსწავლებისთვის აწყობილი სისტემა: გაკვეთილები, T.C.R.E.I.
                ჩარჩო, ბონუს კურსები და მზა პრომპტები, რომ AI-სთან მუშაობა სწრაფად დაალაგო.
              </p>
            </FadeIn>

            <FadeIn className="campaign-included-list">
              {included.map((item) => (
                <div key={item}>
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </FadeIn>
          </div>
        </section>

        <section className="campaign-section">
          <div className="campaign-shell">
            <FadeIn className="campaign-section-heading">
              <p className="campaign-kicker">სტუდენტების ხმა</p>
              <h2>სანდოობა მოდის არა ხმამაღალი დაპირებიდან, არამედ სწავლის გამოცდილებიდან.</h2>
            </FadeIn>

            <div className="campaign-testimonial-grid">
              {testimonials.map((testimonial) => (
                <FadeIn className="campaign-testimonial" key={testimonial.name}>
                  <blockquote>"{testimonial.quote}"</blockquote>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.note}</span>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="campaign-section campaign-section--surface">
          <div className="campaign-shell campaign-faq-grid">
            <FadeIn>
              <p className="campaign-kicker">კითხვები</p>
              <h2>მოკლე პასუხები გადაწყვეტილების წინ.</h2>
            </FadeIn>
            <FadeIn>
              <FAQAccordion items={faqs} />
            </FadeIn>
          </div>
        </section>

        <section className="campaign-final">
          <div className="campaign-shell campaign-final__inner">
            <FadeIn className="campaign-final__copy">
              <p className="campaign-kicker">ბოლო ნაბიჯი</p>
              <h2>თუ AI-ს უკვე იყენებ, ახლა დროა ის სწორ სისტემად აქციო.</h2>
              <p>
                მიიღებ 25 მოკლე გაკვეთილს, პრაქტიკულ ჩარჩოს, ბონუს Python და SQL კურსებს და
                პრომპტების ბიბლიოთეკას, რომ სწავლა საკუთარ ტემპში დაიწყო.
              </p>
            </FadeIn>
            <FadeIn className="campaign-final__panel campaign-final__panel--price-return">
              <GeorgianFlagMark />
              <div className="campaign-final__deadline">
                <span>ფასი ბრუნდება სრულ ნიშნულზე</span>
                <strong>
                  {BOOTCAMP_CURRENT_PRICE_LABEL} ახლა · საბოლოოდ გახდება {BOOTCAMP_FULL_PRICE_LABEL}
                </strong>
              </div>
              <PriceReturnProgress />
              <div className="campaign-final__price-row">
                <div>
                  <span>მიმდინარე ფასი</span>
                  <span className="campaign-price__old">{BOOTCAMP_FULL_PRICE_LABEL}</span>
                  <strong>{BOOTCAMP_CURRENT_PRICE_LABEL}</strong>
                </div>
                <span className="campaign-price__save">დაზოგე {formatGel(BOOTCAMP_SAVINGS)}</span>
              </div>
              <CtaButton label={`დაიწყე სწავლა — ${BOOTCAMP_CURRENT_PRICE_LABEL}`} onClick={buy} />
            </FadeIn>
          </div>
        </section>
      </main>

      <CampaignFooter />
      <FlittCheckoutModal />
    </div>
  );
}
