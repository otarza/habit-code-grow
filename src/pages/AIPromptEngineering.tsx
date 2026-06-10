import { useEffect, useState } from "react";
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
import { handleBuy } from "@/lib/checkout";

const paymentLogos = ["visa", "mastercard", "apple-pay", "google-pay"] as const;
const BOOTCAMP_VIDEO_BASE_URL =
  "https://player.mediadelivery.net/embed/678241/5c33a6d3-33fc-41a5-83ca-1a9c8ee702ff?autoplay=true&loop=false&muted=true&preload=true&responsive=true";
const getBootcampVideoUrl = (soundEnabled: boolean) =>
  BOOTCAMP_VIDEO_BASE_URL.replace("muted=true", `muted=${soundEnabled ? "false" : "true"}`);

const proIncludes = [
  "სრული 6-მოდულიანი პროგრამა: პრომპტინგიდან n8n ავტომატიზაციამდე",
  "T.C.R.E.I. ჩარჩო, Advanced Prompting და Prompt Chaining",
  "AI-ის პრაქტიკული გამოყენება: ტექსტი, მონაცემები და დოკუმენტები",
  "ვიზუალური AI, Custom GPTs და პერსონალური აგენტების აწყობა",
  "Python-ის და SQL-ის სრული კურსები ბონუსად",
  "4-კვირიანი მენტორშიფი, დახურული Discord ჯგუფი და უკუკავშირი",
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
    q: "რით განსხვავდება ეს ₾99-იანი Bootcamp-ისგან?",
    a: "₾99-იანი Bootcamp არის თვითსწავლის კურსი პრომპტინგის საფუძვლებისთვის. ეს პროგრამა კი სრული 6-მოდულიანი გზაა: მოიცავს Advanced Prompting-ს, ბიზნეს ამოცანებს, ვიზუალურ AI-ს, Custom GPTs-სა და n8n ავტომატიზაციას, რასაც ემატება 4-კვირიანი მენტორშიფი და ინდივიდუალური უკუკავშირი.",
  },
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

function ProOffer({ className = "", id, onBuy }: { className?: string; id?: string; onBuy: () => void }) {
  return (
    <div id={id} className={`campaign-hero__offer campaign-hero__offer--pro campaign-buy-anchor ${className}`}>
      <div className="campaign-offer-heading">
        <span>სრული AI პროგრამა</span>
        <strong>6 მოდული + მენტორშიფი</strong>
      </div>
      <div className="campaign-final__price-row">
        <div>
          <span>ერთჯერადი ფასი</span>
          <strong>₾249</strong>
        </div>
        <span className="campaign-price__save">რეკომენდებული</span>
      </div>
      <CtaButton label="შემოუერთდი პროგრამას — ₾249" onClick={onBuy} />
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
  const buy = () => handleBuy("pro");

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

  return (
    <div className="campaign-page campaign-page--pro">
      <SEO
        title="AI სრული პროგრამა მენტორობით — ₾249 | BitCamp"
        description="6-მოდულიანი AI პროგრამა მენტორობით: prompting, business AI, visual AI, Custom GPTs, n8n ავტომატიზაცია, Python/SQL ბონუსები და 4 კვირის მხარდაჭერა."
        image="https://www.bitcamp.ge/ai-meta.png"
        url="https://www.bitcamp.ge/ai"
      />
      <Helmet>
        <script async src="https://tally.so/widgets/embed.js" />
      </Helmet>

      <main>
        <section className="campaign-hero">
          <div className="campaign-shell campaign-hero__grid">
            <div className="campaign-hero__copy">
              <p className="campaign-eyebrow">AI-ს სრული პროგრამა მენტორშიფით</p>
              <h1>ისწავლე AI-ს პროფესიონალურ დონეზე გამოყენება: პრომპტინგიდან ავტომატიზაციამდე.</h1>
              <p className="campaign-lead">
                6-მოდულიანი პრაქტიკული პროგრამა მათთვის, ვისაც AI-ს გამოყენება რეალური სამუშაო პროცესების დასაჩქარებლად და გასამარტივებლად სურს. კურსს ახლავს 4-კვირიანი მენტორშიფი და ინდივიდუალური უკუკავშირი.
              </p>

              <BootcampHeroVideo className="campaign-hero-video--inline" />

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

              <div className="campaign-author-chip">
                <img src="/media/external/images/otar-profile-photo.png" alt="" />
                <div>
                  <span>მენტორი: ოთარ ზაკალაშვილი</span>
                  <strong>BitCamp-ის დამფუძნებელი · Python, SQL, კომპ.მეცნიერების, Full-Stack Web Development და AI კურსების ავტორი. 16 წლიანი გამოცდილებით ტექ ინდუსტრიაში · სენიორ პროგრამულ ინჟინერად მუშაობის ისტორიით ამერიკაში, კანადაში და ევროპის 12 ქვეყანაში.</strong>
                </div>
              </div>

              <ProOffer className="campaign-hero__offer--inline" onBuy={buy} />
            </div>

            <div className="campaign-hero__visual">
              <BootcampHeroVideo className="campaign-hero-video--desktop" />
              <ProOffer id="purchase" className="campaign-hero__offer--desktop" onBuy={buy} />

              <figure className="campaign-instructor-card">
                <img
                  src="/media/external/images/otar-spotlight-clean.png"
                  alt="ოთარ ზაკალაშვილი"
                />
                <figcaption>
                  <span>კურსს უძღვება</span>
                  <strong>ოთარ ზაკალაშვილი</strong>
                  <small>პრაქტიკული AI, Python, SQL და Web კურსების ავტორი BitCamp-ში</small>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <CampaignStickyCta
          eyebrow="სრული პროგრამა"
          price="₾249"
          label="შემოუერთდი"
          onClick={buy}
        />

        <section className="campaign-proof-strip" aria-label="ნდობის მაჩვენებლები">
          <div className="campaign-shell campaign-proof-strip__grid">
            <div>
              <strong>6</strong>
              <span>მოდული prompting-იდან n8n ავტომატიზაციამდე</span>
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
              <h2>აირჩიე ეს ვერსია, თუ გინდა სწავლა დასრულდეს რეალური ავტომატიზაციებით და არა მხოლოდ თეორიით.</h2>
              <p>
                ₾99-იანი Bootcamp არის კარგი დასაწყისი თვითსწავლისთვის. ეს პროგრამა კი გაძლევს სრულ გზას:
                Advanced Prompting, Business AI, Visual AI, Custom GPTs, n8n ავტომატიზაცია და მენტორული უკუკავშირი პრაქტიკაზე.
              </p>
              <div className="campaign-cta-band__meta">
                <span>
                  <BookOpen aria-hidden="true" size={16} />
                  6 მოდული
                </span>
                <span>
                  <CalendarDays aria-hidden="true" size={16} />
                  4 კვირის მხარდაჭერა
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
                  <strong>₾249</strong>
                </div>
                <span className="campaign-price__save">მენტორული</span>
              </div>
              <CtaButton label="შემოუერთდი პროგრამას — ₾249" onClick={buy} />
              <PaymentLogos compact />
              <p className="campaign-muted-note campaign-muted-note--tight">
                ჯერ მხოლოდ პრომპტინგის საფუძვლები გინდა?{" "}
                <Link to="/ai-bootcamp" className="campaign-text-link">
                  ნახე ₾99 თვითსწავლის ვერსია
                </Link>
                .
              </p>
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
              <h2>რეალური შეფასებები წინა სტუდენტებისგან.</h2>
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
                  <strong>₾249</strong>
                </div>
                <span className="campaign-price__save">მენტორული</span>
              </div>
              <CtaButton label="შემოუერთდი პროგრამას — ₾249" onClick={buy} />
              <p>
                თუ გინდა უფრო მსუბუქი შესასვლელი, შეგიძლია დაიწყო{" "}
                <Link to="/ai-bootcamp" className="campaign-text-link">
                  ₾99 თვითსწავლის Bootcamp-ით
                </Link>
                .
              </p>
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
