import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Gift, Mail } from "lucide-react";

const FREE_LESSON_SUBSCRIBE_WEBHOOK_URL =
  import.meta.env.VITE_FREE_LESSON_SUBSCRIBE_WEBHOOK_URL ||
  "https://n8n.bitcamp.ge/webhook/free-lesson-subscribe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MODAL_DELAY_MS = 4500;

type SubmitState = "idle" | "submitting" | "success" | "error";

type FreeLessonEmailGateProps = {
  listKey: "ai-bootcamp" | "ai-pro";
  listId: 4 | 5;
  productLabel: string;
  source: string;
};

function getTrackingParams() {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || "",
    utmMedium: params.get("utm_medium") || "",
    utmCampaign: params.get("utm_campaign") || "",
    fbclid: params.get("fbclid") || "",
  };
}

export function FreeLessonEmailGate({ listKey, listId, productLabel, source }: FreeLessonEmailGateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const tracking = useMemo(getTrackingParams, []);
  const storageKey = `bitcamp-free-lesson-email-gate:${listKey}`;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.localStorage.getItem(storageKey) === "subscribed") return undefined;

    const timer = window.setTimeout(() => setIsOpen(true), MODAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!isOpen || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_RE.test(normalizedEmail)) {
      setSubmitState("error");
      setError("გთხოვ, შეიყვანე სწორი ელფოსტა.");
      return;
    }

    setSubmitState("submitting");
    setError("");

    try {
      const payload = new URLSearchParams({
        email: normalizedEmail,
        listKey,
        listId: String(listId),
        source,
        path: window.location.pathname,
        ...tracking,
      });

      const response = await fetch(FREE_LESSON_SUBSCRIBE_WEBHOOK_URL, {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Subscribe failed");
      }

      window.localStorage.setItem(storageKey, "subscribed");
      setSubmitState("success");
      window.setTimeout(() => setIsOpen(false), 900);
    } catch {
      setSubmitState("error");
      setError("ვერ დაემატა. სცადე კიდევ ერთხელ.");
    }
  };

  if (!isOpen) return null;

  const isSubmitting = submitState === "submitting";
  const isSuccess = submitState === "success";

  return (
    <div className="free-lesson-gate" role="dialog" aria-modal="true" aria-labelledby="free-lesson-gate-title">
      <div className="free-lesson-gate__backdrop" aria-hidden="true" />
      <div className="free-lesson-gate__panel">
        <div className="free-lesson-gate__icon" aria-hidden="true">
          <Gift size={24} />
        </div>
        <p className="free-lesson-gate__eyebrow">უფასო რესურსები გზაშია</p>
        <h2 id="free-lesson-gate-title">ჩაწერე ელფოსტა და გააგრძელე ვიდეოს ყურება</h2>
        <p className="free-lesson-gate__copy">
          {productLabel}-ის მსგავს პრაქტიკულ მასალებს, პრომპტებსა და უფასო გაკვეთილებს მომავალშიც
          გამოგიგზავნით.
        </p>

        <form className="free-lesson-gate__form" onSubmit={handleSubmit}>
          <label htmlFor={`free-lesson-email-${listKey}`}>ელფოსტა</label>
          <div className="free-lesson-gate__input-row">
            <Mail size={18} aria-hidden="true" />
            <input
              id={`free-lesson-email-${listKey}`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting || isSuccess}
              required
            />
          </div>
          {error ? <p className="free-lesson-gate__error">{error}</p> : null}
          {isSuccess ? <p className="free-lesson-gate__success">მადლობა! ვიდეო შეგიძლია გააგრძელო.</p> : null}
          <button type="submit" className="free-lesson-gate__submit" disabled={isSubmitting || isSuccess}>
            <span>{isSubmitting ? "იგზავნება..." : isSuccess ? "დამატებულია" : "გაგრძელება"}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </form>

      </div>
    </div>
  );
}
