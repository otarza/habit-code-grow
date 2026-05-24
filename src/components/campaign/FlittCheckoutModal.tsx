import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { resolvePromoCode, type FlittOpenEventDetail, type PromoCode } from "@/lib/checkout";

const FLITT_CSS = "https://pay.flitt.com/latest/checkout-vue/checkout.css";
const FLITT_JS = "https://pay.flitt.com/latest/checkout-vue/checkout.js";
const FLITT_FONTS = [
  "https://pay.flitt.com/icons/dist/fonts/inter-regular.woff2",
  "https://pay.flitt.com/icons/dist/fonts/inter-medium.woff2",
  "https://pay.flitt.com/icons/dist/fonts/inter-semibold.woff2",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FlittCheckout = (selector: string, options: Record<string, unknown>) => void;

let flittLoading: Promise<FlittCheckout> | null = null;

function loadFlitt(): Promise<FlittCheckout> {
  if (flittLoading) return flittLoading;

  flittLoading = new Promise((resolve, reject) => {
    const existing = (window as Window & { checkout?: FlittCheckout }).checkout;
    if (typeof existing === "function") {
      resolve(existing);
      return;
    }

    FLITT_FONTS.forEach((href) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      link.href = href;
      document.head.appendChild(link);
    });

    if (!document.querySelector(`link[href="${FLITT_CSS}"]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = FLITT_CSS;
      document.head.appendChild(css);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${FLITT_JS}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        const fn = (window as Window & { checkout?: FlittCheckout }).checkout;
        if (typeof fn === "function") resolve(fn);
        else reject(new Error("Flitt loaded but `checkout` not defined"));
      });
      return;
    }

    const script = document.createElement("script");
    script.src = FLITT_JS;
    script.async = true;
    script.onload = () => {
      const fn = (window as Window & { checkout?: FlittCheckout }).checkout;
      if (typeof fn === "function") resolve(fn);
      else reject(new Error("Flitt loaded but `checkout` not defined"));
    };
    script.onerror = () => reject(new Error("Failed to load Flitt checkout script"));
    document.head.appendChild(script);
  });

  return flittLoading;
}

function buildFlittOptions(buttonId: string, email: string) {
  return {
    params: {
      button: buttonId,
      sender_email: email,
      merchant_data: JSON.stringify({ email }),
      customer_data: { email },
    },
    options: {
      // Match the design template configured in Flitt portal:
      // https://portal.flitt.com/#/solutions/design/edit/4056248/c18b51f1b4d94e80286b8718cc25805492dd01ac
      // (BitCamp Template 0 — dark theme, plain layout, default purple button)
      theme: { type: "dark", preset: "reset" },
      endpoint: {
        button: "/latest/checkout-v2/button/index.html",
        gateway: "/latest/checkout-v2/index.html",
      },
      api_domain: "pay.flitt.com",
      card_icons: ["mastercard", "visa"],
      show_email: false,
      methods_disabled: [],
      fullScreen: false,
      hide_button_title: true,
    },
    css_variable: {
      main: "#7d8ff8",
      card_bg: "#353535",
      card_shadow: "#9ADBE8",
    },
  };
}

export function FlittCheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState<FlittOpenEventDetail | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [step, setStep] = useState<"email" | "payment">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  // Resolve promo code live as the buyer types — silently ignores codes that
  // don't match or that target a different product than the one being purchased.
  const appliedPromo: PromoCode | null = useMemo(() => {
    if (!detail) return null;
    return resolvePromoCode(promoCode, detail.product);
  }, [promoCode, detail]);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<FlittOpenEventDetail>;
      setDetail(ce.detail);
      setIsOpen(true);
      setStep("email");
      setEmail("");
      setEmailError("");
      setPromoCode("");
      setActiveButtonId(null);
      setStatus("idle");
    };
    window.addEventListener("flitt:open", handler);
    return () => window.removeEventListener("flitt:open", handler);
  }, []);

  useEffect(() => {
    if (!isOpen || !detail || step !== "payment" || !activeButtonId) return;

    let cancelled = false;
    setStatus("loading");

    loadFlitt()
      .then((checkout) => {
        if (cancelled || !mountRef.current) return;
        mountRef.current.innerHTML = '<div id="flitt-mount-target"></div>';
        checkout("#flitt-mount-target", buildFlittOptions(activeButtonId, email));
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[FlittCheckoutModal]", err);
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, detail, step, email, activeButtonId]);

  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !detail) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError("შეიყვანე ვალიდური ელ. ფოსტა");
      return;
    }
    setEmail(trimmed);
    setEmailError("");
    setActiveButtonId(appliedPromo ? appliedPromo.buttonId : detail.buttonId);
    setStep("payment");
  };

  return (
    <div
      className="campaign-modal"
      role="dialog"
      aria-modal="true"
      aria-label={detail.name}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="campaign-modal__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="campaign-modal__header">
          <div>
            <span className="campaign-modal__eyebrow">გადახდა</span>
            <strong className="campaign-modal__title">
              {detail.name}
              {appliedPromo ? " — ფასდაკლება 🎁" : ` — ₾${detail.value}`}
            </strong>
          </div>
          <button
            type="button"
            className="campaign-modal__close"
            onClick={() => setIsOpen(false)}
            aria-label="დახურვა"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="campaign-modal__body">
          {step === "email" ? (
            <form className="campaign-modal__email-step" onSubmit={handleEmailSubmit}>
              <label htmlFor="campaign-modal-email" className="campaign-modal__label">
                ელ. ფოსტა
              </label>
              <input
                id="campaign-modal-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="email@example.com"
                className={`campaign-modal__input${emailError ? " campaign-modal__input--error" : ""}`}
                required
                autoFocus
              />
              {emailError && (
                <div className="campaign-modal__field-error">{emailError}</div>
              )}
              <p className="campaign-modal__hint">
                ამ მისამართზე გამოვაგზავნით კურსზე წვდომას გადახდის შემდეგ.
              </p>

              <label htmlFor="campaign-modal-promo" className="campaign-modal__label campaign-modal__label--secondary">
                პრომო კოდი <span className="campaign-modal__label-meta">(არასავალდებულო)</span>
              </label>
              <input
                id="campaign-modal-promo"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="თუ გაქვს — შეიყვანე აქ"
                className={`campaign-modal__input${appliedPromo ? " campaign-modal__input--success" : ""}`}
              />
              {appliedPromo && (
                <div className="campaign-modal__promo-applied">✓ {appliedPromo.label}</div>
              )}

              <button type="submit" className="campaign-modal__continue">
                <span>
                  {appliedPromo
                    ? "გაგრძელება ფასდაკლებით"
                    : `გაგრძელება — ₾${detail.value}`}
                </span>
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </form>
          ) : (
            <>
              {status === "loading" && (
                <div className="campaign-modal__status">იტვირთება უსაფრთხო გადახდის ფანჯარა…</div>
              )}
              {status === "error" && (
                <div className="campaign-modal__status campaign-modal__status--error">
                  გადახდის ფანჯრის ჩატვირთვა ვერ მოხერხდა. სცადე თავიდან ან მოგვწერე
                  hello@bitcamp.ge
                </div>
              )}
              <div
                ref={mountRef}
                className="campaign-modal__flitt"
                style={status === "ready" ? undefined : { opacity: 0, height: 0, overflow: "hidden" }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
