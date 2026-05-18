import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import bitcampLogo from "@/assets/bitcamp-logo.png";

const PRODUCT_LABELS: Record<string, string> = {
  bootcamp: "AI Prompt Engineering Bootcamp",
  architect: "სრული AI არქიტექტორის პროგრამა",
};

export default function ThankYou() {
  const [params] = useSearchParams();
  const product = params.get("product") ?? "bootcamp";
  const productLabel = PRODUCT_LABELS[product] ?? PRODUCT_LABELS.bootcamp;

  return (
    <div className="campaign-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <meta name="robots" content="noindex" />
        <title>მადლობა — BitCamp</title>
      </Helmet>

      {/* Minimal header */}
      <header style={{ padding: "20px 24px", borderBottom: "1px solid var(--cp-border)" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <Link to="/">
            <img src={bitcampLogo} alt="BitCamp" style={{ height: "28px", filter: "invert(1)", opacity: 0.85 }} />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px" }}>
        <div style={{ maxWidth: "560px", textAlign: "center" }}>

          <div style={{ fontSize: "48px", marginBottom: "24px" }}>✅</div>

          <h1 style={{
            fontSize: "32px", fontWeight: 700, color: "var(--cp-text-primary)",
            letterSpacing: "-0.02em", marginBottom: "16px", lineHeight: 1.15,
          }}>
            მადლობა! მივიღეთ თქვენი განცხადება.
          </h1>

          <p style={{ fontSize: "17px", color: "var(--cp-text-secondary)", lineHeight: 1.7, marginBottom: "8px" }}>
            თქვენ მოითხოვეთ: <strong style={{ color: "var(--cp-text-primary)" }}>{productLabel}</strong>
          </p>

          <p style={{ fontSize: "17px", color: "var(--cp-text-secondary)", lineHeight: 1.7, marginBottom: "8px" }}>
            შემდეგი ნაბიჯი: შეამოწმე შენი ელ-ფოსტა — გამოგიგზავნეთ გადარიცხვის დეტალები.
          </p>

          <p style={{ fontSize: "17px", color: "var(--cp-text-secondary)", lineHeight: 1.7, marginBottom: "40px" }}>
            გადარიცხვის შემდეგ, კურსზე წვდომას მიიღებ <strong style={{ color: "var(--cp-text-primary)" }}>1 საათში</strong> (სამუშაო საათებში).
          </p>

          <p style={{ fontSize: "15px", color: "var(--cp-text-muted)" }}>
            კითხვები?{" "}
            <a href="mailto:hello@bitcamp.ge" style={{ color: "var(--cp-accent-text)", textDecoration: "none" }}>
              hello@bitcamp.ge
            </a>
          </p>

        </div>
      </main>

      <CampaignFooter />
    </div>
  );
}
