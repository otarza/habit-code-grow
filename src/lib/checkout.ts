type CheckoutProduct = "bootcamp" | "pro";

// Flitt hosted payment-link URLs — full URL to each payment page.
// Each link is pre-configured in Flitt dashboard with:
//   - Response URL (where buyer redirects after payment, success or decline)
//   - Cancel URL (if buyer clicks Cancel)
//   - Server Callback URL (our Cloud Function for sending welcome email)
//   - Required custom fields (email)
// Add the `pro` link once that payment-link product is created in Flitt.
export const FLITT_LINKS: Partial<Record<CheckoutProduct, string>> = {
  bootcamp:
    "https://pay.flitt.com/merchants/a1a4a4e30664fd373149649e9bc5b98bb4bd35b9/41f1b22012027a5ddbc8399115fe0040/index.html?button=74de94a0a998fdf3f37f433e90448cd5dd11ee97",
  // pro: "<flitt-hosted-link-for-pro-tier>",
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

export function handleBuy(product: CheckoutProduct) {
  const link = FLITT_LINKS[product];
  if (!link) {
    console.error(`[checkout] No Flitt link configured for product: ${product}`);
    return;
  }

  trackInitiateCheckout(product);
  window.location.href = link;
}
