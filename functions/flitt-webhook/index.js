const functions = require("@google-cloud/functions-framework");
const crypto = require("crypto");
const postmark = require("postmark");

const FLITT_SECRET = process.env.FLITT_SECRET_KEY;
const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN;
const FROM_EMAIL = process.env.FROM_EMAIL || "hello@bitcamp.ge";
const MESSAGE_STREAM = process.env.POSTMARK_STREAM || "outbound";

// Map Flitt's `product_id` (set per payment link in Flitt dashboard)
// to our internal product slug + Postmark template alias.
// Fill in real product_id values after creating products in Flitt dashboard.
const PRODUCT_MAP = {
  // "<flitt-product-id>": { slug, template, name }
  // Example — update with real product_id from Flitt:
  // "12345": { slug: "bootcamp", template: "course-access-bootcamp", name: "AI Bootcamp Self-Paced" },
};

// Fallback used when product_id isn't in the map (e.g. unknown / new product)
// Lets a sale still complete; we can fix the mapping after seeing the first real callback.
const FALLBACK_PRODUCT = {
  slug: "bootcamp",
  template: "course-access-bootcamp",
  name: "AI Bootcamp Self-Paced",
};

const postmarkClient = new postmark.ServerClient(POSTMARK_TOKEN);

functions.http("flittWebhook", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const payload = req.body || {};
  // Log every callback for the first weeks so we can debug mappings + signature
  console.log("FLITT_CALLBACK", JSON.stringify(payload));

  if (!verifySignature(payload, FLITT_SECRET)) {
    console.error("SIGNATURE_FAIL", payload.order_id);
    return res.status(403).send("Invalid signature");
  }

  if (payload.order_status !== "approved") {
    console.log("SKIP_STATUS", payload.order_id, payload.order_status);
    // 200 so Flitt stops retrying for non-terminal statuses we don't act on
    return res.status(200).send("Acknowledged (status not approved)");
  }

  const product = PRODUCT_MAP[String(payload.product_id)] || FALLBACK_PRODUCT;

  const email = payload.sender_email;
  if (!email) {
    console.error("NO_EMAIL", payload.order_id);
    // 200 — we acknowledge; manual recovery from logs
    return res.status(200).send("No email captured");
  }

  const amountGel = (Number(payload.amount) / 100).toFixed(2);

  try {
    await postmarkClient.sendEmailWithTemplate({
      From: FROM_EMAIL,
      To: email,
      TemplateAlias: product.template,
      TemplateModel: {
        name: extractName(payload),
        order_id: payload.order_id,
        amount: amountGel,
        currency: payload.currency || "GEL",
        product_name: product.name,
        // Template-specific links — set as Postmark template defaults so the function
        // doesn't need to know course URLs. Override here if you'd rather pass them.
      },
      MessageStream: MESSAGE_STREAM,
    });
    console.log("EMAIL_SENT", payload.order_id, email, product.slug);
  } catch (err) {
    console.error("POSTMARK_FAIL", payload.order_id, err.message);
    // Still 200 — we have the callback logged; we don't want Flitt's 24h retry
    // storm if the issue is our side. Recover manually from logs.
    return res.status(200).send("Email failed; logged");
  }

  return res.status(200).send("OK");
});

function verifySignature(payload, secret) {
  if (!secret) {
    console.error("MISSING_SECRET_ENV");
    return false;
  }
  const { signature, response_signature_string } = payload;
  if (!signature || !response_signature_string) return false;

  // Flitt: SHA1 hex of `secret|response_signature_string`
  const toSign = `${secret}|${response_signature_string}`;
  const computed = crypto.createHash("sha1").update(toSign).digest("hex");

  return computed.toLowerCase() === String(signature).toLowerCase();
}

function extractName(payload) {
  // Flitt doesn't have a dedicated name field; try merchant_data first
  // (we can pass a name field via Flitt payment link's Additional fields → callback name `name`)
  if (payload.name) return payload.name;
  if (payload.merchant_data) {
    try {
      const md = typeof payload.merchant_data === "string"
        ? JSON.parse(payload.merchant_data)
        : payload.merchant_data;
      if (md && md.name) return md.name;
    } catch {
      // merchant_data isn't JSON — ignore
    }
  }
  // Fallback: use the email local part
  if (payload.sender_email) return payload.sender_email.split("@")[0];
  return "";
}
