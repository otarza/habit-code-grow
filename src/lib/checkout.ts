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

// Per-product checkout config. Add a `pro` Flitt button ID once the payment
// link product is created in Flitt dashboard.
export const PRODUCTS: Record<CheckoutProduct, ProductConfig> = {
  bootcamp: {
    mode: "redirect",
    link: "https://pay.flitt.com/merchants/a1a4a4e30664fd373149649e9bc5b98bb4bd35b9/c18b51f1b4d94e80286b8718cc25805492dd01ac/index.html?button=74de94a0a998fdf3f37f433e90448cd5dd11ee97",
    name: "AI Bootcamp Self-Paced",
    value: 99,
  },
  pro: {
    mode: "embed",
    buttonId: "811bb88862b6e4eb4b1a1bfdb86ba16cac23d8f8",
    name: "AI Bootcamp მენტორობით",
    value: 249,
  },
};

export type FlittOpenEventDetail = {
  product: CheckoutProduct;
  buttonId: string;
  name: string;
  value: number;
};

function trackInitiateCheckout(product: CheckoutProduct) {
  const config = PRODUCTS[product];
  const win = window as Window & {
    fbq?: (event: string, name: string, params?: Record<string, unknown>) => void;
    gtag?: (event: string, name: string, params?: Record<string, unknown>) => void;
  };

  win.gtag?.("event", "begin_checkout", {
    currency: "GEL",
    value: config.value,
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
  });
}

export function handleBuy(product: CheckoutProduct) {
  const config = PRODUCTS[product];
  if (!config) {
    console.error(`[checkout] Unknown product: ${product}`);
    return;
  }

  if (config.mode === "redirect") {
    if (!config.link) {
      console.error(`[checkout] No Flitt link configured for ${product}`);
      return;
    }
    trackInitiateCheckout(product);
    window.location.href = config.link;
    return;
  }

  if (config.mode === "embed") {
    if (!config.buttonId) {
      console.error(`[checkout] No Flitt button ID configured for ${product}`);
      return;
    }
    trackInitiateCheckout(product);
    const detail: FlittOpenEventDetail = {
      product,
      buttonId: config.buttonId,
      name: config.name,
      value: config.value,
    };
    window.dispatchEvent(new CustomEvent("flitt:open", { detail }));
  }
}
