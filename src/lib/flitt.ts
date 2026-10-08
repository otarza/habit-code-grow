// Shared Flitt embedded-checkout loader, used by the checkout modal and
// the inline checkout on /ai-starter.
const FLITT_CSS = "https://pay.flitt.com/latest/checkout-vue/checkout.css";
const FLITT_JS = "https://pay.flitt.com/latest/checkout-vue/checkout.js";
const FLITT_FONTS = [
  "https://pay.flitt.com/icons/dist/fonts/inter-regular.woff2",
  "https://pay.flitt.com/icons/dist/fonts/inter-medium.woff2",
  "https://pay.flitt.com/icons/dist/fonts/inter-semibold.woff2",
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FlittCheckout = (selector: string, options: Record<string, unknown>) => void;

let flittLoading: Promise<FlittCheckout> | null = null;

export function loadFlitt(): Promise<FlittCheckout> {
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

  flittLoading.catch(() => {
    flittLoading = null;
  });
  return flittLoading;
}

export function buildFlittOptions(buttonId: string, email: string) {
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
