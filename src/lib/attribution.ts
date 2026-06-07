// Lightweight funnel attribution helper.
//
// The free-lesson funnel (/ai-bootcamp/free-lesson) sends warm viewers to
// /ai-bootcamp?ref=free-lesson#purchase. We persist that `ref` so it can be
// attached to the InitiateCheckout (checkout.ts) and Purchase (ThankYou) pixel
// events — even after Flitt's redirect drops the query param from the URL.

const REF_STORAGE_KEY = "bitcamp_ref";

function readRefFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get("ref");
  } catch {
    return null;
  }
}

/** Call on a landing page mount: if `?ref=` is present, remember it for the session. */
export function rememberAttributionRef(): void {
  const ref = readRefFromUrl();
  if (!ref) return;
  try {
    window.sessionStorage.setItem(REF_STORAGE_KEY, ref);
  } catch {
    /* sessionStorage unavailable (private mode / SSR) — ignore */
  }
}

/** Current attribution ref: URL param wins, otherwise the remembered session value. */
export function getAttributionRef(): string | null {
  const fromUrl = readRefFromUrl();
  if (fromUrl) return fromUrl;
  try {
    return window.sessionStorage.getItem(REF_STORAGE_KEY);
  } catch {
    return null;
  }
}
