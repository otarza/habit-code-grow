import { getAttributionRef } from "./attribution";

export type CheckoutProduct = "bootcamp" | "pro" | "starter";

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

// From Nov 1 03:00 (after the 3-hour Halloween extension) the Starter sells at ₾149 as a discount from the
// ₾249 list price; ₾149 window framed as მე-19 ნაკადი (Nov 2–8), then Black Friday until Nov 27 (see STARTER_PROMO_PHASES).
// Own Flitt product (btcp-ai-3m-149) + button; the webhook maps both to AI Starter.
export const STARTER_149_BUTTON_ID = (import.meta.env.VITE_AI_STARTER_149_FLITT_BUTTON_ID as string | undefined) ?? "5fd5468dc15516804904fdb9e1ce52d946210745";

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
  starter: {
    mode: "embed",
    // Public Flitt button ID supplied by the owner for the ₾249 Starter product.
    // ₾249 list price stays genuinely purchasable (the "continue at full price" path) so the ₾149 strike-through is real.
    buttonId: import.meta.env.VITE_AI_STARTER_FLITT_BUTTON_ID ?? "8dd7438a4579ed39bd7ae731fb8b6f359a2aae58",
    name: "AI Starter — 3 ვიდეომოდული",
    value: 249,
  },
};

export type StarterPromoPhase = CheckoutOverride & {
  value: number;
  // Last moment the phase price is offered (Tbilisi time); Infinity for an open-ended standing discount.
  endsAt: number;
  endLabel: string; // "… ჩათვლით" (empty when open-ended)
  endDay: string; // "სრულდება …" (empty when open-ended)
  // Last-minute extension after the announced deadline: same price/button, Halloween-themed extra timer.
  extension?: boolean;
  // Standing discount with no deadline: no countdown, no "ends …" copy anywhere (unused since Nov 2; kept for reuse).
  open?: boolean;
};

// Halloween skin for /ai-starter: Oct 31 through the end of the 3-hour extension.
export const HALLOWEEN_THEME = {
  from: Date.parse("2026-10-31T00:00:00+04:00"),
  until: Date.parse("2026-11-01T03:00:00+04:00"),
};
export const isHalloweenTheme = (now: number) => now >= HALLOWEEN_THEME.from && now < HALLOWEEN_THEME.until;

// Black Friday skin for /ai-starter (black + yellow, matches the BF ad creatives): until the ₾149 deadline.
export const BLACK_FRIDAY_THEME = {
  from: Date.parse("2026-11-09T00:00:00+04:00"),
  until: Date.parse("2026-11-28T00:00:00+04:00"),
};
export const isBlackFridayTheme = (now: number) => now >= BLACK_FRIDAY_THEME.from && now < BLACK_FRIDAY_THEME.until;

// Starter promo phases, in order. When the last deadline passes, starterPromoPhase() returns undefined and the
// page sells at the plain ₾249 list price (no timer, no discount copy).
// Button IDs are public Flitt identifiers, not API secrets.
export const STARTER_PROMO_PHASES: StarterPromoPhase[] = [
  {
    buttonId: import.meta.env.VITE_AI_STARTER_PROMO_FLITT_BUTTON_ID ?? "6e34b7a462c13603d26c45affbc44ae17bddf82d",
    name: "AI Starter — 3 ვიდეომოდული",
    value: 79,
    savingsLabel: "შენ ზოგავ ₾170-ს",
    endsAt: Date.parse("2026-10-18T23:59:59+04:00"),
    endLabel: "18 ოქტომბრის ჩათვლით",
    endDay: "სრულდება 18 ოქტომბერს",
  },
  {
    buttonId: "fe99a05bc8302656378089f4f0e8c854c3fc6e51",
    name: "AI Starter — 3 ვიდეომოდული",
    value: 99,
    savingsLabel: "შენ ზოგავ ₾150-ს",
    endsAt: Date.parse("2026-10-31T23:59:59+04:00"),
    endLabel: "31 ოქტომბრის ჩათვლით",
    endDay: "სრულდება 31 ოქტომბერს",
  },
  {
    // Starts the moment the Oct 31 timer hits 00:00:00 — same ₾99 button, 3 extra hours for late comers.
    buttonId: "fe99a05bc8302656378089f4f0e8c854c3fc6e51",
    name: "AI Starter — 3 ვიდეომოდული",
    value: 99,
    savingsLabel: "შენ ზოგავ ₾150-ს",
    endsAt: Date.parse("2026-11-01T03:00:00+04:00"),
    endLabel: "ღამის 03:00-მდე",
    endDay: "ფასდაკლება გაგრძელდა მხოლოდ 3 საათით",
    extension: true,
  },
  {
    // Nov 1 03:00 – Nov 27 23:59 (Tbilisi): ₾149 shown as a discount from the ₾249 list price, with a countdown.
    // Framed as Black Friday since Nov 9 (was the მე-19 ნაკადი window until Nov 15). After it the page sells at ₾249.
    buttonId: STARTER_149_BUTTON_ID,
    name: "AI Starter — 3 ვიდეომოდული",
    value: 149,
    savingsLabel: "შენ ზოგავ ₾100-ს",
    endsAt: Date.parse("2026-11-27T23:59:59+04:00"),
    endLabel: "27 ნოემბრის ჩათვლით",
    endDay: "სრულდება 27 ნოემბერს",
  },
];
// Last real deadline — the page's clock stops ticking after it.
export const STARTER_LAST_DEADLINE = Math.max(...STARTER_PROMO_PHASES.map(p => p.endsAt).filter(Number.isFinite));

export const starterPromoPhase = (now: number) => STARTER_PROMO_PHASES.find(p => now < p.endsAt);

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

export function trackInitiateCheckout(product: CheckoutProduct, override?: CheckoutOverride) {
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
