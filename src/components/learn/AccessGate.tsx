import { useEffect, useState } from "react";

interface Props {
  courseSlug: string;
  product: "bootcamp" | "pro";
  courseName: string;
  buyLabel: string;
  buyPrice: string;
}

const storageKey = (courseSlug: string) =>
  `bitcamp_soft_access_${courseSlug}_email`;

type State = "checking" | "granted" | "locked";

export function AccessGate({ courseSlug, product, courseName, buyLabel, buyPrice }: Props) {
  const [state, setState] = useState<State>("checking");
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(true);

  useEffect(() => {
    try {
      // Magic link: ?email=user@example.com sets access immediately
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get("email");
      if (urlEmail) {
        localStorage.setItem(storageKey(courseSlug), urlEmail.toLowerCase().trim());
        params.delete("email");
        params.delete("token");
        const clean =
          window.location.pathname +
          (params.toString() ? "?" + params.toString() : "");
        window.history.replaceState({}, "", clean);
        setState("granted");
        return;
      }

      // Existing access in localStorage
      const stored = localStorage.getItem(storageKey(courseSlug));
      setState(stored ? "granted" : "locked");
    } catch {
      // Private browsing — treat as locked
      setState("locked");
    }
  }, [courseSlug]);

  // Checking: opaque overlay blocks content during hydration
  if (state === "checking") {
    return <div className="access-gate access-gate--checking" aria-hidden="true" />;
  }

  if (state === "granted") return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    try {
      localStorage.setItem(storageKey(courseSlug), trimmed);
    } catch {
      // ignore localStorage errors in private browsing
    }
    setState("granted");
  };

  const handleBuy = () => {
    window.dispatchEvent(new CustomEvent("flitt:open", { detail: { product } }));
  };

  return (
    <div className="access-gate" role="dialog" aria-modal="true" aria-label="კურსზე წვდომა">
      <div className="access-gate__card">
        <div className="access-gate__lock" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="access-gate__title">{courseName}</h2>
        <p className="access-gate__subtitle">
          კურსზე წვდომისთვის შეიყვანე ელ-ფოსტა, რომლითაც შეიძინე.
        </p>

        {showEmailForm ? (
          <form className="access-gate__form" onSubmit={handleEmailSubmit}>
            <input
              className="access-gate__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="შენი ელ-ფოსტა"
              required
              autoFocus
            />
            <button className="access-gate__submit" type="submit">
              კურსში შესვლა →
            </button>
          </form>
        ) : null}

        <div className="access-gate__divider">
          <span>ან</span>
        </div>

        <button className="access-gate__buy" type="button" onClick={handleBuy}>
          {buyLabel} — {buyPrice}
        </button>

        {!showEmailForm && (
          <button
            className="access-gate__toggle"
            type="button"
            onClick={() => setShowEmailForm(true)}
          >
            უკვე გიყიდია? შეიყვანე ელ-ფოსტა
          </button>
        )}
      </div>
    </div>
  );
}
