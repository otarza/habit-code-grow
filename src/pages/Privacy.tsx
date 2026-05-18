import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import bitcampLogo from "@/assets/bitcamp-logo.png";

export default function Privacy() {
  return (
    <div className="campaign-page" style={{ minHeight: "100vh" }}>
      <Helmet>
        <title>კონფიდენციალურობის პოლიტიკა — BitCamp</title>
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
          კონფიდენციალურობის პოლიტიკა
        </h1>
        <p style={{ color: "var(--cp-text-muted)", marginBottom: "48px", fontSize: "15px" }}>
          ბოლო განახლება: 2026 წლის 17 მაისი
        </p>

        <Section title="1. ვინ ვართ">
          ო. ზაკალაშვილი (ი/მ) (ს/კ: 01001071740, მისამართი: მირიან მეფის ქუჩა, 11გ, ბინა #39) არის ვებგვერდის bitcamp.ge მფლობელი და თქვენი პერსონალური მონაცემების ადმინისტრატორი.
        </Section>

        <Section title="2. რა მონაცემებს ვაგროვებთ">
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>სახელი და გვარი</li>
            <li>ელ-ფოსტის მისამართი</li>
            <li>ტელეფონის ნომერი (არასავალდებულო)</li>
            <li>ინფორმაცია გადახდის შესახებ (გადახდის ოპერატორ Flitt-ის მეშვეობით — ჩვენ ბარათის სრულ მონაცემებს არ ვინახავთ)</li>
            <li>ინფორმაცია კურსზე აქტივობის შესახებ</li>
            <li>IP მისამართი და ბრაუზერის ინფორმაცია (ანალიტიკისთვის)</li>
          </ul>
        </Section>

        <Section title="3. რატომ ვაგროვებთ">
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>მომსახურების მისაწოდებლად (კურსზე წვდომის უზრუნველყოფა)</li>
            <li>გადახდის დასამუშავებლად</li>
            <li>მომხმარებლის მხარდასაჭერად</li>
            <li>მომსახურების გასაუმჯობესებლად</li>
            <li>მარკეტინგული შეტყობინებებისთვის (მხოლოდ თქვენი თანხმობით)</li>
          </ul>
        </Section>

        <Section title="4. ვის გადავცემთ თქვენს მონაცემებს">
          <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
            <li>გადახდის ოპერატორი: Flitt</li>
            <li>ელფოსტის სერვისი: Postmark</li>
            <li>ანალიტიკა: Google Analytics, Meta Pixel</li>
            <li>ვებჰოსტინგი: GitHub Pages / Cloudflare</li>
          </ul>
          <br />
          არ ვყიდით თქვენს ინფორმაციას მესამე მხარეებზე მარკეტინგული მიზნებისთვის.
        </Section>

        <Section title="5. რამდენ ხანს ვინახავთ">
          თქვენი მონაცემები ინახება მანამ, სანამ თქვენ გაქვთ ანგარიში ჩვენთან, ან გადახდის შემდეგ 7 წლის განმავლობაში — საქართველოს კანონმდებლობით საგადასახადო ვალდებულებების შესაბამისად.
        </Section>

        <Section title="6. თქვენი უფლებები">
          თქვენ გაქვთ უფლება:
          <ul style={{ paddingLeft: "20px", lineHeight: "2", marginTop: "8px" }}>
            <li>მოითხოვოთ თქვენი მონაცემების ასლი</li>
            <li>მოითხოვოთ შესწორება</li>
            <li>მოითხოვოთ წაშლა (გარდა კანონით სავალდებულო შემთხვევებისა)</li>
            <li>გააუქმოთ თანხმობა მარკეტინგულ შეტყობინებებზე</li>
            <li>შემოგვტანოთ პრეტენზია საქართველოს პერსონალურ მონაცემთა დაცვის ინსპექტორთან</li>
          </ul>
        </Section>

        <Section title="7. Cookies">
          ვებგვერდი იყენებს cookies-ებს მომსახურების გასაუმჯობესებლად. ბრაუზერის პარამეტრებში შეგიძლიათ მათი გათიშვა.
        </Section>

        <Section title="8. უსაფრთხოება">
          თქვენი მონაცემები ინახება დაცული სერვერებზე SSL დაშიფვრით. გადახდის ბარათის მონაცემები არასოდეს ხვდება ჩვენს სერვერებზე — ისინი მუშავდება უშუალოდ Flitt-ის მიერ.
        </Section>

        <Section title="9. ცვლილებები">
          პოლიტიკის ცვლილების შემთხვევაში, ვაცნობებთ ვებგვერდზე ან ელფოსტით.
        </Section>

        <Section title="10. კონტაქტი" last>
          კონფიდენციალურობასთან დაკავშირებული ნებისმიერი კითხვისთვის:{" "}
          <a href="mailto:hello@bitcamp.ge" style={{ color: "var(--cp-accent-text)" }}>
            hello@bitcamp.ge
          </a>
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
