import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { type FlittOpenEventDetail } from "@/lib/checkout";
import { buildFlittOptions, EMAIL_RE, loadFlitt } from "@/lib/flitt";

export function FlittCheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState<FlittOpenEventDetail | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [step, setStep] = useState<"email" | "payment">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [activeButtonId, setActiveButtonId] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<FlittOpenEventDetail>;
      setDetail(ce.detail);
      setIsOpen(true);
      setStep("email");
      setEmail("");
      setEmailError("");
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
    setActiveButtonId(detail.buttonId);
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
            {/* The email step shows savings in its own panel; avoid repeating it. */}
            {detail.savingsLabel && step !== "email" ? (
              <span className="campaign-modal__savings">{detail.savingsLabel}</span>
            ) : null}
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
              {detail.savingsLabel ? (
                <div className="campaign-modal__savings-panel">
                  <span>პრომო ფასი აქტიურია</span>
                  <strong>{detail.savingsLabel}</strong>
                </div>
              ) : null}
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
