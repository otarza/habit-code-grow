import { getAttributionRef } from "./attribution";

type CheckoutProduct = "bootcamp" | "pro";

type ProductConfig = {
  name: string;
  value: number;
} & (
  | {
      // Redirect to a Flitt-hosted payment link page.
      // Configure response/decline/cancel/server-callback in Flitt dashboard.
      mode: "redirect";
      link: string;
    }
  | {
      // Embed Flitt's Vue checkout inside our own modal.
      // Two-step: collect email in our UI → pass via customer_data.email.
      mode: "embed";
      buttonId: string;
    }
);

export type CheckoutOverride = {
  buttonId: string;
  name?: string;
  value?: number;
  savingsLabel?: string;
};

// Per-product checkout config.
export const PRODUCTS: Record<CheckoutProduct, ProductConfig> = {
  bootcamp: {
    mode: "embed",
    buttonId: "74de94a0a998fdf3f37f433e90448cd5dd11ee97",
    name: "AI Bootcamp Self-Paced",
    value: 149,
  },
  pro: {
    mode: "embed",
    buttonId: "811bb88862b6e4eb4b1a1bfdb86ba16cac23d8f8",
    name: "AI Bootcamp მენტორობით",
    value: 249,
  },
};

export type PromoCode = {
  product: CheckoutProduct;
  buttonId: string;
  label: string;
};

// Promo codes — case-insensitive (normalize to lowercase). When the buyer
// enters a code that matches a key here, we route them to the alternate
// Flitt button (presumably set to a discounted price in Flitt dashboard).
// Add new codes as { lowercase_key: { product, buttonId, label } }.
export const PROMO_CODES: Record<string, PromoCode> = {
  bavshvebi: {
    product: "bootcamp",
    buttonId: "712f14e9fe23dd46c2693b292afd3aed99271a51",
    label: "მადლობა დიუშენის კუნთოვანი დისტროფიით დაავადებული ბავშვების პეტიციის ხელმოწერისთვის 🙏",
  },
};

export function resolvePromoCode(raw: string, product: CheckoutProduct): PromoCode | null {
  const normalized = (raw || "").trim().toLowerCase();
  if (!normalized) return null;
  const match = PROMO_CODES[normalized];
  if (!match) return null;
  if (match.product !== product) return null;
  return match;
}

export type FlittOpenEventDetail = {
  product: CheckoutProduct;
  buttonId: string;
  name: string;
  value: number;
  savingsLabel?: string;
};

function getCheckoutConfig(product: CheckoutProduct, override?: CheckoutOverride) {
  const config = PRODUCTS[product];
  if (!override) return config;
  return {
    ...config,
    name: override.name ?? config.name,
    value: override.value ?? config.value,
    ...(config.mode === "embed" ? { buttonId: override.buttonId } : {}),
  } as ProductConfig;
}

function trackInitiateCheckout(product: CheckoutProduct, override?: CheckoutOverride) {
  const config = getCheckoutConfig(product, override);
  const win = window as Window & {
    fbq?: (event: string, name: string, params?: Record<string, unknown>) => void;
    gtag?: (event: string, name: string, params?: Record<string, unknown>) => void;
  };

  // Funnel attribution (e.g. ref=free-lesson) — only attached when present.
  const ref = getAttributionRef();
  const attribution = ref ? { ref } : {};

  win.gtag?.("event", "begin_checkout", {
    currency: "GEL",
    value: config.value,
    ...attribution,
    items: [
      {
        item_id: product,
        item_name: config.name,
        price: config.value,
        quantity: 1,
      },
    ],
  });

  win.fbq?.("track", "InitiateCheckout", {
    content_ids: [product],
    content_name: config.name,
    content_type: "product",
    currency: "GEL",
    value: config.value,
    ...attribution,
  });
}

export function handleBuy(product: CheckoutProduct, override?: CheckoutOverride) {
  const config = getCheckoutConfig(product, override);
  if (!config) {
    console.error(`[checkout] Unknown product: ${product}`);
    return;
  }

  if (config.mode === "redirect") {
    if (!config.link) {
      console.error(`[checkout] No Flitt link configured for ${product}`);
      return;
    }
    trackInitiateCheckout(product, override);
    window.location.href = config.link;
    return;
  }

  if (config.mode === "embed") {
    if (!config.buttonId) {
      console.error(`[checkout] No Flitt button ID configured for ${product}`);
      return;
    }
    trackInitiateCheckout(product, override);
    const detail: FlittOpenEventDetail = {
      product,
      buttonId: config.buttonId,
      name: config.name,
      value: config.value,
      savingsLabel: override?.savingsLabel,
    };
    window.dispatchEvent(new CustomEvent("flitt:open", { detail }));
  }
}
