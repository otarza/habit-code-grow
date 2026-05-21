import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Database,
  MessageSquareText,
  ShieldCheck,
  Users,
  Video,
  Workflow,
} from "lucide-react";
import { Countdown } from "@/components/campaign/Countdown";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import { CampaignStickyCta } from "@/components/campaign/CampaignStickyCta";
import { FlittCheckoutModal } from "@/components/campaign/FlittCheckoutModal";
import { handleBuy } from "@/lib/checkout";

const paymentLogos = ["visa", "mastercard", "apple-pay", "google-pay"] as const;

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
    a: "26 მაისს 23:59 საათზე ₾99-იანი დამოუკიდებლობის შეთავაზება იხურება. შემდეგ თვითსწავლის ვერსია აღარ იქნება ამ ფასად ხელმისაწვდომი.",
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
      <p className="campaign-price__label">დამოუკიდებლობის ფასი</p>
      <div className="campaign-price__new">₾99</div>
    </div>
  );
}

function HeroOffer({ className = "", onBuy }: { className?: string; onBuy: () => void }) {
  return (
    <div className={`campaign-hero__offer ${className}`}>
      <div className="campaign-offer-heading">
        <span>შეთავაზება იხურება</span>
        <strong>26 მაისს, 23:59-ზე</strong>
      </div>
      <Countdown />
      <div className="campaign-hero__buy">
        <PriceBlock />
        <CtaButton label="დაიწყე სწავლა — ₾99" onClick={onBuy} />
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
        <title>AI Prompt Engineering Bootcamp - ₾99 | BitCamp</title>
        <meta
          name="description"
          content="AI Prompt Engineering Bootcamp თვითსწავლისთვის: 25 გაკვეთილი, T.C.R.E.I. ჩარჩო, 50+ პრომპტი და Python/SQL ბონუსები ₾99-ად."
        />
        <meta property="og:title" content="AI Prompt Engineering Bootcamp - ₾99 | BitCamp" />
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
              <p className="campaign-eyebrow">საქართველოს დამოუკიდებლობის დღისადმი მიძღვნილი შეთავაზება · სრულდება 26 მაისს</p>
              <h1>
                დაიწყე AI-ს სწორად გამოყენება <span className="campaign-nowrap">2 დღეში</span>
              </h1>
              <p className="campaign-lead">
                ისწავლე ChatGPT, Gemini და Claude ისე, რომ T.C.R.E.I.-ით დაზოგო დრო პირველივე დღიდან.
              </p>

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

              <InstructorTrustCard />

              <HeroOffer className="campaign-hero__offer--inline" onBuy={buy} />
            </div>

            <div className="campaign-hero__visual">
              <HeroOffer className="campaign-hero__offer--desktop" onBuy={buy} />
              <HeroCoursePreview />
            </div>
          </div>
        </section>

        <CampaignStickyCta
          eyebrow="თვითსწავლა"
          price="₾99"
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

        <section className="campaign-cta-band">
          <div className="campaign-shell campaign-cta-band__inner">
            <FadeIn className="campaign-cta-band__copy">
              <p className="campaign-kicker">დამოუკიდებლობის ფასი</p>
              <h2>დაიწყე Bootcamp ახლა და შეინარჩუნე ₾99 ფასი.</h2>
              <p>
                26 მაისის 23:59-ის შემდეგ შეთავაზება იხურება და კურსი უბრუნდება ჩვეულ ფასს.
              </p>
              <div className="campaign-cta-band__meta">
                <span>
                  <CalendarDays aria-hidden="true" size={16} />
                  26 მაისი • 23:59
                </span>
                <span>
                  <ShieldCheck aria-hidden="true" size={16} />
                  უსაფრთხო გადახდა
                </span>
              </div>
            </FadeIn>
            <FadeIn className="campaign-cta-band__action">
              <div className="campaign-cta-price-line">
                <div>
                  <span>დღევანდელი ფასი</span>
                  <strong>₾99</strong>
                </div>
                <span className="campaign-price__save">26 მაისამდე</span>
              </div>
              <CtaButton label="დაიწყე სწავლა — ₾99" onClick={buy} />
              <PaymentLogos compact />
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
            <FadeIn className="campaign-final__panel">
              <div className="campaign-final__deadline">
                <span>შეთავაზება იხურება</span>
                <strong>26 მაისს, 23:59-ზე</strong>
              </div>
              <Countdown />
              <div className="campaign-final__price-row">
                <div>
                  <span>დღევანდელი ფასი</span>
                  <strong>₾99</strong>
                </div>
                <span className="campaign-price__save">26 მაისამდე</span>
              </div>
              <CtaButton label="დაიწყე სწავლა — ₾99" onClick={buy} />
              <p>
                გჭირდება მენტორშიფი, Discord მხარდაჭერა და უკუკავშირი?{" "}
                <Link to="/ai" className="campaign-text-link">
                  იხილე ₾249-იანი მენტორული ვერსია
                </Link>
              </p>
            </FadeIn>
          </div>
        </section>
      </main>

      <CampaignFooter />
      <FlittCheckoutModal />
    </div>
  );
}
