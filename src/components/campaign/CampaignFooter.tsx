import { Link } from "react-router-dom";

export function CampaignFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--cp-border)", paddingTop: "48px", paddingBottom: "48px" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto", padding: "0 24px" }}>

        {/* Payment logos */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "28px", flexWrap: "wrap" }}>
          {["visa", "mastercard", "apple-pay", "google-pay"].map((name) => (
            <img
              key={name}
              src={`/assets/payment/${name}.svg`}
              alt={name}
              style={{ height: "24px", filter: "grayscale(1) brightness(1.8)", opacity: 0.6 }}
            />
          ))}
        </div>

        {/* Legal info */}
        <div style={{ color: "var(--cp-text-muted)", fontSize: "13px", lineHeight: "1.7", marginBottom: "20px" }}>
          <p>ო. ზაკალაშვილი (ი/მ) &nbsp;·&nbsp; ს/კ: 01001071740</p>
          <p>მისამართი: მირიან მეფის ქუჩა, 11გ, ბინა #39</p>
          <p>ტელ: +995 557 15 12 90 &nbsp;·&nbsp; ელ-ფოსტა: hello@bitcamp.ge</p>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
          <Link
            to="/terms"
            style={{ color: "var(--cp-text-muted)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--cp-text-secondary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--cp-text-muted)")}
          >
            მომსახურების პირობები
          </Link>
          <span style={{ color: "var(--cp-border-strong)" }}>·</span>
          <Link
            to="/privacy"
            style={{ color: "var(--cp-text-muted)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--cp-text-secondary)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--cp-text-muted)")}
          >
            კონფიდენციალურობა
          </Link>
        </div>

      </div>
    </footer>
  );
}
