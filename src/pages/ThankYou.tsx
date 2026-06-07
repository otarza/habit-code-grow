import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CampaignFooter } from "@/components/campaign/CampaignFooter";
import bitcampLogo from "@/assets/bitcamp-logo.png";

const PRODUCT_LABELS: Record<string, string> = {
  bootcamp: "AI Prompt Engineering Bootcamp",
  pro: "AI Bootcamp მენტორობით",
};

// Default values per product slug — used when Flitt's redirect doesn't carry amount/currency
const PRODUCT_DEFAULTS: Record<string, { value: number; currency: string }> = {
  bootcamp: { value: 149, currency: "GEL" },
  pro: { value: 249, currency: "GEL" },
};

type Variant = "success" | "declined" | "default";

function resolveVariant(status: string | null): Variant {
  const s = (status || "").toLowerCase();
  if (s === "success" || s === "approved") return "success";
  if (s === "declined" || s === "failed" || s === "fail") return "declined";
  return "default";
}

type WindowWithAnalytics = Window & {
  fbq?: (event: string, name: string, params?: Record<string, unknown>, opts?: Record<string, unknown>) => void;
  gtag?: (event: string, name: string, params?: Record<string, unknown>) => void;
};

function trackPurchase(args: {
  product: string;
  orderId: string;
  value: number;
  currency: string;
}) {
  // sessionStorage dedup — guards against refresh on the thank-you page firing duplicate purchases.
  // Note: Meta's eventID (passed below) also dedupes server-side, but client-side guard saves the call entirely.
  const key = `bitcamp_purchase_fired_${args.orderId}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  const win = window as WindowWithAnalytics;
  const meta = PRODUCT_LABELS[args.product] ?? PRODUCT_LABELS.bootcamp;

  // Meta Pixel
  win.fbq?.(
    "track",
    "Purchase",
    {
      value: args.value,
      currency: args.currency,
      content_ids: [args.product],
      content_name: meta,
      content_type: "product",
      num_items: 1,
    },
    { eventID: args.orderId } // dedup key for Meta (works with server-side Conversions API too)
  );

  // Google Analytics — GA4 ecommerce purchase event
  win.gtag?.("event", "purchase", {
    transaction_id: args.orderId,
    value: args.value,
    currency: args.currency,
    items: [
      {
        item_id: args.product,
        item_name: meta,
        price: args.value,
        quantity: 1,
      },
    ],
  });
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

  // Fire Purchase tracking on successful redirect.
  // Flitt sometimes appends `amount` in tetri (e.g. "14900" = ₾149.00); fall back to product default.
  useEffect(() => {
    if (variant !== "success" || !orderId) return;
    const rawAmount = params.get("amount");
    const parsed = rawAmount ? Number(rawAmount) : NaN;
    const defaults = PRODUCT_DEFAULTS[product] ?? PRODUCT_DEFAULTS.bootcamp;
    // Flitt passes amount in smallest unit (tetri). If we get a value > 999, it's likely tetri → divide.
    const value = Number.isFinite(parsed) && parsed > 0
      ? parsed > 999 ? parsed / 100 : parsed
      : defaults.value;
    const currency = params.get("currency") || defaults.currency;

    trackPurchase({ product, orderId, value, currency });
  }, [variant, orderId, product, params]);

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
