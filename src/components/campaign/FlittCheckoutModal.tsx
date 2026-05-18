import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import type { FlittOpenEventDetail } from "@/lib/checkout";

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
    const existingCheckout = (window as Window & { checkout?: FlittCheckout }).checkout;
    if (typeof existingCheckout === "function") {
      resolve(existingCheckout);
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

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${FLITT_JS}"]`);
    if (existing) {
      existing.addEventListener("load", () => {
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
      customer_data: { email },
    },
    options: {
      theme: { type: "light", preset: "reset" },
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
      main: "#DA291C",
      card_bg: "#1C1C20",
      card_shadow: "#0A0A0B",
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
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<FlittOpenEventDetail>;
      setDetail(ce.detail);
      setIsOpen(true);
      setStep("email");
      setEmail("");
      setEmailError("");
      setStatus("idle");
    };
    window.addEventListener("flitt:open", handler);
    return () => window.removeEventListener("flitt:open", handler);
  }, []);

  useEffect(() => {
    if (!isOpen || !detail || step !== "payment") return;

    let cancelled = false;
    setStatus("loading");

    loadFlitt()
      .then((checkout) => {
        if (cancelled || !mountRef.current) return;
        mountRef.current.innerHTML = '<div id="flitt-mount-target"></div>';
        checkout("#flitt-mount-target", buildFlittOptions(detail.buttonId, email));
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
  }, [isOpen, detail, step, email]);

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
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError("შეიყვანე ვალიდური ელ. ფოსტა");
      return;
    }
    setEmail(trimmed);
    setEmailError("");
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
              {detail.name} — ₾{detail.value}
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
              <button type="submit" className="campaign-modal__continue">
                <span>გაგრძელება — ₾{detail.value}</span>
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
