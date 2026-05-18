import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import bitcampLogo from "@/assets/bitcamp-logo.png";

export default function Terms() {
  return (
    <div className="campaign-page" style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>მომსახურების პირობები — BitCamp</title>
      </Helmet>

      {/* Minimal header */}
      <header style={{ padding: "24px", borderBottom: "1px solid var(--cp-border)" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <Link to="/">
            <img
              src={bitcampLogo}
              alt="BitCamp"
              style={{ height: "32px", filter: "invert(1)", opacity: 0.9 }}
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px", color: "var(--cp-text-primary)" }}>
          მომსახურების პირობები
        </h1>
        <p style={{ color: "var(--cp-text-muted)", marginBottom: "48px", fontSize: "15px" }}>
          ბოლო განახლება: 2026 წლის 17 მაისი
        </p>

        <Section title="1. ზოგადი დებულებები">
          წინამდებარე პირობები არეგულირებს ურთიერთობას ო. ზაქალაშვილს (ი/მ) (ს/კ: 01001071740, მისამართი: მირიან მეფის ქუჩა, 11გ, ბინა #39, შემდგომში „კომპანია") და ვებგვერდის bitcamp.ge მომხმარებელს შორის.
          <br /><br />
          ვებგვერდით სარგებლობით, თქვენ ეთანხმებით ამ პირობებს. თუ არ ეთანხმებით, გთხოვთ, არ გამოიყენოთ ვებგვერდი.
        </Section>

        <Section title="2. მომსახურების აღწერა">
          კომპანია გთავაზობთ ონლაინ საგანმანათლებლო კურსებს ხელოვნური ინტელექტის, პროგრამირებისა და ციფრული უნარების მიმართულებით. კურსები ხელმისაწვდომია ვიდეო ფორმატში, შესაბამისი მასალებითა და დახმარებით.
        </Section>

        <Section title="3. ფასი და გადახდა">
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>ყველა ფასი მითითებულია ქართულ ლარში (₾) დღგ-ს ჩათვლით.</li>
            <li>გადახდა ხდება ბანკის ბარათით (VISA, Mastercard), Google Pay-ით, Apple Pay-ით ან საბანკო გადარიცხვით.</li>
            <li>გადახდის შემდეგ მომხმარებელი იღებს წვდომას შესყიდულ კურსზე ელექტრონული ფოსტის მეშვეობით 1 საათში (სამუშაო საათებში).</li>
          </ul>
        </Section>

        <Section title="4. დაბრუნების და გაუქმების პოლიტიკა">
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>მომხმარებელს უფლება აქვს მოითხოვოს თანხის სრული დაბრუნება შესყიდვიდან 14 დღის განმავლობაში, თუ მან არ დაიწყო კურსის გავლა.</li>
            <li>კურსის გავლის დაწყების შემდეგ (პირველი მოდულის გახსნა) თანხის დაბრუნება არ ხდება.</li>
            <li>დაბრუნების მოთხოვნა იგზავნება ელფოსტაზე: hello@bitcamp.ge</li>
            <li>დაბრუნება ხდება იმავე გადახდის მეთოდით, რომლითაც განხორციელდა შესყიდვა, 7 სამუშაო დღის განმავლობაში.</li>
          </ul>
        </Section>

        <Section title="5. ინტელექტუალური საკუთრება">
          ვებგვერდზე და კურსებში წარმოდგენილი ყველა მასალა (ვიდეო, ტექსტი, კოდი, გრაფიკა) წარმოადგენს კომპანიის ან მისი ლიცენზიის მფლობელების საკუთრებას. მათი კოპირება, გავრცელება ან გასაჯაროება დაუშვებელია.
        </Section>

        <Section title="6. მომხმარებლის ვალდებულებები">
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>მომხმარებელი ვალდებულია მიაწოდოს ნამდვილი და სრული ინფორმაცია.</li>
            <li>კურსის წვდომა პერსონალურია — სხვა პირისთვის გადაცემა აკრძალულია.</li>
          </ul>
        </Section>

        <Section title="7. პასუხისმგებლობის შეზღუდვა">
          კომპანია არ აგებს პასუხს მომხმარებლის მიერ კურსის გავლის შედეგად მიღებულ ან გამოტოვებულ შემოსავალზე. კურსები წარმოადგენს საგანმანათლებლო რესურსს და არ წარმოადგენს გარანტიას კონკრეტული შედეგისთვის.
        </Section>

        <Section title="8. პერსონალური მონაცემები">
          პერსონალური მონაცემების დამუშავება რეგულირდება ცალკე დოკუმენტით —{" "}
          <Link to="/privacy" style={{ color: "var(--cp-accent-text)" }}>
            კონფიდენციალურობის პოლიტიკა
          </Link>.
        </Section>

        <Section title="9. პირობების ცვლილება">
          კომპანია იტოვებს უფლებას, ცალმხრივად შეიტანოს ცვლილებები ამ პირობებში. ცვლილებები ძალაში შედის ვებგვერდზე გამოქვეყნებისთანავე.
        </Section>

        <Section title="10. საკონტაქტო ინფორმაცია" last>
          <div style={{ lineHeight: "2" }}>
            <p>ო. ზაკალაშვილი (ი/მ)</p>
            <p>ს/კ: 01001071740</p>
            <p>მისამართი: მირიან მეფის ქუჩა, 11გ, ბინა #39</p>
            <p>ტელ: +995 557 15 12 90</p>
            <p>ელ-ფოსტა: hello@bitcamp.ge</p>
          </div>
        </Section>
      </main>

      <CampaignFooter />
    </div>
  );
}

function Section({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section style={{ marginBottom: last ? 0 : "40px" }}>
      <h2
        style={{
          fontSize: "17px",
          fontWeight: 600,
          color: "var(--cp-text-primary)",
          marginBottom: "12px",
          paddingBottom: "8px",
          borderBottom: "1px solid var(--cp-border)",
        }}
      >
        {title}
      </h2>
      <div style={{ color: "var(--cp-text-secondary)", fontSize: "15px", lineHeight: "1.8" }}>
        {children}
      </div>
    </section>
  );
}
