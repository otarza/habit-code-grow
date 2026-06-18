import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowRight, Gift, Mail } from "lucide-react";

const FREE_LESSON_SUBSCRIBE_WEBHOOK_URL =
  import.meta.env.VITE_FREE_LESSON_SUBSCRIBE_WEBHOOK_URL ||
  "https://n8n.bitcamp.ge/webhook/free-lesson-subscribe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = "idle" | "submitting" | "success" | "error";

type FreeLessonResourceFormProps = {
  listKey: "ai-bootcamp" | "ai-pro";
  listId: 4 | 5;
  productLabel: string;
  source: string;
};

type AnalyticsWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
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

function fireResourceSubmit(productLabel: string, listKey: string, listId: number) {
  if (typeof window === "undefined") return;
  const win = window as AnalyticsWindow;
  const payload = { product: productLabel, list_key: listKey, list_id: listId };
  win.fbq?.("trackCustom", "FreeLessonResourceSubmit", payload);
  win.gtag?.("event", "FreeLessonResourceSubmit", payload);
}

export function FreeLessonResourceForm({ listKey, listId, productLabel, source }: FreeLessonResourceFormProps) {
  const [email, setEmail] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const tracking = useMemo(getTrackingParams, []);
  const storageKey = `bitcamp-free-lesson-resources:${listKey}`;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    setHasSubscribed(window.localStorage.getItem(storageKey) === "subscribed");
    return undefined;
  }, [storageKey]);

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
      fireResourceSubmit(productLabel, listKey, listId);
      setSubmitState("success");
      setHasSubscribed(true);
    } catch {
      setSubmitState("error");
      setError("ვერ დაემატა. სცადე კიდევ ერთხელ.");
    }
  };

  const isSubmitting = submitState === "submitting";
  const isSuccess = submitState === "success";
  const isDisabled = isSubmitting || isSuccess || hasSubscribed;

  return (
    <section className="free-lesson-resource" aria-labelledby={`free-lesson-resource-title-${listKey}`}>
      <div className="free-lesson-resource__icon" aria-hidden="true">
        <Gift size={24} />
      </div>
      <div className="free-lesson-resource__content">
        <p className="free-lesson-resource__eyebrow">შემდეგი ნაბიჯი</p>
        <h2 id={`free-lesson-resource-title-${listKey}`}>მიიღე დამატებითი AI რესურსები</h2>
        <p>
          გამოგიგზავნი {productLabel}-თან დაკავშირებულ პრომპტების შაბლონებს, პრაქტიკულ მაგალითებს და
          მომდევნო უფასო გაკვეთილსაც.
        </p>
      </div>

      <form className="free-lesson-resource__form" onSubmit={handleSubmit}>
        <label htmlFor={`free-lesson-email-${listKey}`}>ელფოსტა</label>
        <div className="free-lesson-resource__input-row">
          <Mail size={18} aria-hidden="true" />
          <input
            id={`free-lesson-email-${listKey}`}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isDisabled}
            required
          />
        </div>
        {error ? <p className="free-lesson-resource__error">{error}</p> : null}
        {hasSubscribed ? (
          <p className="free-lesson-resource__success">მადლობა! რესურსებს ელფოსტაზე მიიღებ.</p>
        ) : null}
        <button type="submit" className="free-lesson-resource__submit" disabled={isDisabled}>
          <span>{isSubmitting ? "იგზავნება..." : hasSubscribed ? "დამატებულია" : "გამომიგზავნე რესურსები"}</span>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
