import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import bitcampLogo from "@/assets/bitcamp-logo.png";

const PRODUCT_LABELS: Record<string, string> = {
  bootcamp: "AI Prompt Engineering Bootcamp",
  pro: "AI Bootcamp მენტორობით",
};

type Variant = "success" | "declined" | "default";

function resolveVariant(status: string | null): Variant {
  const s = (status || "").toLowerCase();
  if (s === "success" || s === "approved") return "success";
  if (s === "declined" || s === "failed" || s === "fail") return "declined";
  return "default";
}

const ctaButtonStyle: React.CSSProperties = {
  display: "inline-block",
  background: "var(--cp-cta-bg)",
  color: "var(--cp-cta-text)",
  textDecoration: "none",
  padding: "14px 28px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: 600,
};

const headingStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 700,
  color: "var(--cp-text-primary)",
  letterSpacing: "-0.02em",
  marginBottom: "16px",
  lineHeight: 1.15,
};

const bodyTextStyle: React.CSSProperties = {
  fontSize: "17px",
  color: "var(--cp-text-secondary)",
  lineHeight: 1.7,
  marginBottom: "20px",
};

const noteStyle: React.CSSProperties = {
  fontSize: "15px",
  color: "var(--cp-text-muted)",
  marginTop: "8px",
};

const accentLinkStyle: React.CSSProperties = {
  color: "var(--cp-accent-text)",
  textDecoration: "none",
};

export default function ThankYou() {
  const [params] = useSearchParams();
  const variant = resolveVariant(params.get("status") || params.get("order_status"));
  const product = params.get("product") ?? "bootcamp";
  const productLabel = PRODUCT_LABELS[product] ?? PRODUCT_LABELS.bootcamp;
  const orderId = params.get("order_id");

  const title =
    variant === "success"
      ? "გადახდა წარმატებით — BitCamp"
      : variant === "declined"
      ? "გადახდა ვერ დასრულდა — BitCamp"
      : "მადლობა — BitCamp";

  return (
    <div className="campaign-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <meta name="robots" content="noindex" />
        <title>{title}</title>
      </Helmet>

      {/* Minimal header */}
      <header style={{ padding: "20px 24px", borderBottom: "1px solid var(--cp-border)" }}>
        <div style={{ maxWidth: "920px", margin: "0 auto" }}>
          <Link to="/">
            <img src={bitcampLogo} alt="BitCamp" style={{ height: "28px", filter: "invert(1)", opacity: 0.85 }} />
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px" }}>
        <div style={{ maxWidth: "560px", textAlign: "center" }}>

          {variant === "success" && (
            <>
              <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎉</div>
              <h1 style={headingStyle}>გადახდა წარმატებით დასრულდა!</h1>
              <p style={bodyTextStyle}>
                <strong style={{ color: "var(--cp-text-primary)" }}>{productLabel}</strong>-ის წვდომა გააქტიურდა.
              </p>
              <p style={{ ...bodyTextStyle, marginBottom: "40px" }}>
                შეამოწმე შენი ელ-ფოსტა — გამოგზავნე{" "}
                <strong style={{ color: "var(--cp-text-primary)" }}>Magic Link</strong>{" "}
                კურსზე წვდომისთვის.
              </p>
              <p style={noteStyle}>
                ვერ ხედავ ელფოსტას? შეამოწმე Spam ფოლდერი ან მოგვწერე{" "}
                <a href="mailto:hello@bitcamp.ge" style={accentLinkStyle}>
                  hello@bitcamp.ge
                </a>
              </p>
              {orderId && (
                <p style={{ ...noteStyle, marginTop: "24px", fontSize: "13px" }}>
                  შეკვეთა #{orderId}
                </p>
              )}
            </>
          )}

          {variant === "declined" && (
            <>
              <div style={{ fontSize: "48px", marginBottom: "24px" }}>⚠️</div>
              <h1 style={headingStyle}>გადახდა ვერ დასრულდა</h1>
              <p style={{ ...bodyTextStyle, marginBottom: "32px" }}>
                შენი გადახდა არ გავიდა. სცადე თავიდან ან გამოიყენე სხვა ბარათი ან გადახდის მეთოდი.
              </p>
              <Link to="/ai-bootcamp" style={{ ...ctaButtonStyle, marginBottom: "32px" }}>
                სცადე თავიდან →
              </Link>
              <p style={noteStyle}>
                პრობლემა გრძელდება? მოგვწერე{" "}
                <a href="mailto:hello@bitcamp.ge" style={accentLinkStyle}>
                  hello@bitcamp.ge
                </a>
              </p>
            </>
          )}

          {variant === "default" && (
            <>
              <div style={{ fontSize: "48px", marginBottom: "24px" }}>✅</div>
              <h1 style={headingStyle}>მადლობა!</h1>
              <p style={{ ...bodyTextStyle, marginBottom: "40px" }}>
                შემდეგი ნაბიჯი: შეამოწმე შენი ელ-ფოსტა — გამოგიგზავნე კურსზე წვდომის ინსტრუქცია.
              </p>
              <p style={noteStyle}>
                კითხვები?{" "}
                <a href="mailto:hello@bitcamp.ge" style={accentLinkStyle}>
                  hello@bitcamp.ge
                </a>
              </p>
            </>
          )}

        </div>
      </main>

      <CampaignFooter />
    </div>
  );
}
