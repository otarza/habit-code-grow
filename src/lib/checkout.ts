type CheckoutProduct = "bootcamp" | "pro";

// Flitt embed "button" IDs — one per payment-link product created in Flitt dashboard.
// Fill in `pro` when the corresponding Flitt product is created.
export const FLITT_BUTTONS: Partial<Record<CheckoutProduct, string>> = {
  bootcamp: "a0e5974bbff69a3970e39b77a5b1e20f6b0d2223",
  // pro: "<flitt-button-id-for-pro-tier>",
};

const CHECKOUT_META: Record<CheckoutProduct, { name: string; value: number }> = {
  bootcamp: { name: "AI Bootcamp Self-Paced", value: 99 },
  pro: { name: "AI Bootcamp Mentored", value: 249 },
};

function trackInitiateCheckout(product: CheckoutProduct) {
  const meta = CHECKOUT_META[product];
  const win = window as Window & {
    fbq?: (event: string, name: string, params?: Record<string, unknown>) => void;
    gtag?: (event: string, name: string, params?: Record<string, unknown>) => void;
  };

  win.gtag?.("event", "begin_checkout", {
    currency: "GEL",
    value: meta.value,
    items: [
      {
        item_id: product,
        item_name: meta.name,
        price: meta.value,
        quantity: 1,
      },
    ],
  });

  win.fbq?.("track", "InitiateCheckout", {
    content_ids: [product],
    content_name: meta.name,
    content_type: "product",
    currency: "GEL",
    value: meta.value,
  });
}

export type FlittOpenEventDetail = {
  product: CheckoutProduct;
  buttonId: string;
  name: string;
  value: number;
};

export function handleBuy(product: CheckoutProduct) {
  const buttonId = FLITT_BUTTONS[product];
  if (!buttonId) {
    console.error(`[checkout] No Flitt button ID configured for product: ${product}`);
    return;
  }

  trackInitiateCheckout(product);

  const detail: FlittOpenEventDetail = {
    product,
    buttonId,
    name: CHECKOUT_META[product].name,
    value: CHECKOUT_META[product].value,
  };

  window.dispatchEvent(new CustomEvent("flitt:open", { detail }));
}
