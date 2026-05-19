const functions = require("@google-cloud/functions-framework");
const crypto = require("crypto");
const postmark = require("postmark");

const FLITT_SECRET = process.env.FLITT_SECRET_KEY;
const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN;
const FROM_EMAIL = process.env.FROM_EMAIL || "hello@bitcamp.ge";
const MESSAGE_STREAM = process.env.POSTMARK_STREAM || "outbound";

// Map Flitt's `product_id` (set per payment link in Flitt dashboard)
// to our internal product slug + Postmark template alias.
const BOOTCAMP_PRODUCT = {
  slug: "bootcamp",
  template: "course-access-ai-bootcamp",
  name: "AI Bootcamp Self-Paced",
};

const PRO_PRODUCT = {
  slug: "pro",
  template: "course-access-ai-pro",
  name: "AI Bootcamp Mentored",
};

const PRODUCT_MAP = {
  // Bootcamp (₾99 self-paced) — both the dashboard product_id and button hash
  "btcp-ai-bootcamp": BOOTCAMP_PRODUCT,
  "74de94a0a998fdf3f37f433e90448cd5dd11ee97": BOOTCAMP_PRODUCT,
  // Pro (₾249 mentored)
  "btcp-ai-pro": PRO_PRODUCT,
  "811bb88862b6e4eb4b1a1bfdb86ba16cac23d8f8": PRO_PRODUCT,
};

// Fallback used when product_id isn't in the map (e.g. unknown / new product)
// Lets a sale still complete; we can fix the mapping after seeing the first real callback.
const FALLBACK_PRODUCT = {
  slug: "bootcamp",
  template: "course-access-ai-bootcamp",
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

  const email = extractEmail(payload);
  if (!email) {
    console.error("NO_EMAIL", payload.order_id);
    // 200 — we acknowledge; manual recovery from logs
    return res.status(200).send("No email captured");
  }

  const amountGel = (Number(payload.amount) / 100).toFixed(2);

  try {
    const result = await postmarkClient.sendEmailWithTemplate({
      From: FROM_EMAIL,
      To: email,
      TemplateAlias: product.template,
      TemplateModel: {
        order_id: payload.order_id,
        amount: amountGel,
        currency: payload.currency || "GEL",
        product_name: product.name,
        base64_email: toBase64Url(email),
      },
      MessageStream: MESSAGE_STREAM,
    });
    console.log(
      "POSTMARK_RESPONSE",
      payload.order_id,
      email,
      product.slug,
      JSON.stringify({
        MessageID: result.MessageID,
        SubmittedAt: result.SubmittedAt,
        To: result.To,
        ErrorCode: result.ErrorCode,
        Message: result.Message,
      })
    );
  } catch (err) {
    console.error(
      "POSTMARK_FAIL",
      payload.order_id,
      JSON.stringify({
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
      })
    );
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
  const { signature } = payload;
  if (!signature) return false;

  let toSign;

  if (payload.response_signature_string) {
    // Path 1: Flitt provides the pre-formatted message with secret masked at
    // start (e.g. "**********|val1|val2|..."). Replace the mask with the
    // real secret and SHA1.
    toSign = payload.response_signature_string.replace(/^[^|]*/, secret);
  } else {
    // Path 2: Flitt didn't include response_signature_string (observed on
    // some Apple Pay callbacks). Build it manually per Flitt's standard
    // algorithm: SHA1(secret + "|" + values-of-non-empty-fields-sorted-by-key)
    const excluded = new Set(["signature", "response_signature_string"]);
    const values = Object.keys(payload)
      .filter((k) => !excluded.has(k))
      .filter((k) => {
        const v = payload[k];
        return v !== "" && v !== null && v !== undefined;
      })
      .sort()
      .map((k) => String(payload[k]));
    toSign = secret + "|" + values.join("|");
  }

  const computed = crypto.createHash("sha1").update(toSign).digest("hex");

  return computed.toLowerCase() === String(signature).toLowerCase();
}

function extractEmail(payload) {
  // 1. Flitt's native sender_email — present in real callbacks even when only
  // a custom "Additional field" was used in the dashboard
  if (payload.sender_email) return payload.sender_email;
  // 2. Top-level `email` field (if Flitt ever flattens it that way)
  if (payload.email) return payload.email;
  // 3. merchant_data is a JSON array of custom field objects in real Flitt callbacks:
  //    [{"name":"email","label":"...","value":"buyer@example.com"}, ...]
  if (payload.merchant_data) {
    try {
      const md =
        typeof payload.merchant_data === "string"
          ? JSON.parse(payload.merchant_data)
          : payload.merchant_data;
      if (Array.isArray(md)) {
        const f = md.find((x) => x && x.name === "email" && x.value);
        if (f) return f.value;
      } else if (md && md.email) {
        return md.email;
      }
    } catch {
      // not JSON — ignore
    }
  }
  return null;
}

function toBase64Url(value) {
  return Buffer.from(String(value), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

// ───────────────────────────────────────────────────────────────────────
// Browser-redirect helper (separate function deployment).
//
// Flitt POSTs back to the configured Success/Decline URLs with order data.
// GitHub Pages only serves GET → POST returns 405 Method Not Allowed.
// This function accepts the POST and 303-redirects the buyer (as a GET)
// to our static /thank-you page with the relevant fields as query params.
// ───────────────────────────────────────────────────────────────────────
functions.http("flittRedirect", (req, res) => {
  const targetBase = process.env.THANK_YOU_URL || "https://www.bitcamp.ge/thank-you";

  // We set ?status=success or ?status=declined on the Flitt-dashboard URL
  // — Flitt preserves our query string when it appends its own POST body.
  const status = (req.query.status || "").toString();

  const body =
    typeof req.body === "object" && req.body !== null ? req.body : {};

  const params = new URLSearchParams();
  if (status) params.set("status", status);

  // Pass through useful Flitt fields (browser-visible only; the source of
  // truth for fulfillment is the signed server-callback, not these).
  const passthrough = ["order_id", "order_status", "payment_id", "amount", "currency"];
  for (const field of passthrough) {
    const value = body[field] ?? req.query[field];
    if (value !== undefined && value !== null && value !== "") {
      params.set(field, String(value));
    }
  }

  const qs = params.toString();
  res.redirect(303, qs ? `${targetBase}?${qs}` : targetBase);
});
