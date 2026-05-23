const functions = require("@google-cloud/functions-framework");
const crypto = require("crypto");
const { Firestore, FieldValue } = require("@google-cloud/firestore");
const postmark = require("postmark");

const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN;
const FROM_EMAIL = process.env.FROM_EMAIL || "BitCamp <oto@bitcamp.ge>";
const MESSAGE_STREAM = process.env.POSTMARK_STREAM || "flitt-payments-transactional";
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://www.bitcamp.ge";
const LOGIN_TEMPLATE_ALIAS = process.env.LOGIN_TEMPLATE_ALIAS || "course-login-link";
const RATE_LIMIT_MINUTES = Number(process.env.RATE_LIMIT_MINUTES || 5);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://www.bitcamp.ge,http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COURSES = {
  "ai-bootcamp": {
    title: "AI Prompt Engineering Bootcamp",
    productName: "AI Bootcamp Self-Paced",
    learnPath: "/learn/ai-bootcamp",
    buyPath: "/ai-bootcamp",
  },
  "ai-pro": {
    title: "AI Bootcamp Mentored",
    productName: "AI Bootcamp Mentored",
    learnPath: "/learn/ai-pro",
    buyPath: "/ai",
  },
};

const firestore = new Firestore();
const postmarkClient = POSTMARK_TOKEN ? new postmark.ServerClient(POSTMARK_TOKEN) : null;

functions.http("courseAccessApi", async (req, res) => {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method === "GET") {
    return res.status(200).json({ ok: true, service: "course-access-api" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};
  const email = normalizeEmail(body.email);
  const courseSlug = String(body.courseSlug || "").trim();
  const course = COURSES[courseSlug];

  if (!EMAIL_RE.test(email) || !course) {
    console.warn("LOGIN_LINK_BAD_REQUEST", JSON.stringify({ courseSlug, hasEmail: Boolean(email) }));
    return sendNeutralResponse(res);
  }

  const emailHash = hashEmail(email);
  const docRef = firestore.collection("course_access").doc(emailHash);

  try {
    const doc = await docRef.get();
    const data = doc.exists ? doc.data() || {} : {};
    const access = data.courses?.[courseSlug];

    if (!access || access.status !== "active") {
      console.log("LOGIN_LINK_DENIED", JSON.stringify({ emailHash, courseSlug }));
      await recordAccessEvent({
        emailHash,
        courseSlug,
        type: "login_link_denied",
        metadata: { reason: "missing_or_inactive" },
      });
      return sendNeutralResponse(res);
    }

    if (isRateLimited(access.lastMagicLinkSentAt || data.lastMagicLinkSentAt)) {
      console.log("LOGIN_LINK_RATE_LIMITED", JSON.stringify({ emailHash, courseSlug }));
      await recordAccessEvent({
        emailHash,
        courseSlug,
        type: "login_link_rate_limited",
        metadata: { rateLimitMinutes: RATE_LIMIT_MINUTES },
      });
      return sendNeutralResponse(res);
    }

    if (!postmarkClient) {
      console.error("MISSING_POSTMARK_SERVER_TOKEN", JSON.stringify({ emailHash, courseSlug }));
      return sendNeutralResponse(res);
    }

    const base64Email = toBase64Url(email);
    const magicLink = `${SITE_ORIGIN}${course.learnPath}?access=${base64Email}`;

    const result = await postmarkClient.sendEmailWithTemplate({
      From: FROM_EMAIL,
      To: email,
      TemplateAlias: LOGIN_TEMPLATE_ALIAS,
      TemplateModel: {
        product_name: course.productName,
        course_title: course.title,
        magic_link: magicLink,
        base64_email: base64Email,
      },
      MessageStream: MESSAGE_STREAM,
      TrackOpens: true,
      TrackLinks: "HtmlAndText",
    });

    if (result.ErrorCode && result.ErrorCode !== 0) {
      console.error(
        "POSTMARK_LOGIN_LINK_ERROR",
        JSON.stringify({ emailHash, courseSlug, errorCode: result.ErrorCode, message: result.Message })
      );
      return sendNeutralResponse(res);
    }

    await docRef.set(
      {
        updatedAt: FieldValue.serverTimestamp(),
        lastMagicLinkSentAt: FieldValue.serverTimestamp(),
        courses: {
          [courseSlug]: {
            lastMagicLinkSentAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    await recordAccessEvent({
      emailHash,
      courseSlug,
      type: "login_link_sent",
      metadata: { messageId: result.MessageID },
    });

    console.log("LOGIN_LINK_SENT", JSON.stringify({ emailHash, courseSlug, messageId: result.MessageID }));
    return sendNeutralResponse(res);
  } catch (err) {
    console.error(
      "COURSE_ACCESS_API_FAIL",
      JSON.stringify({ emailHash, courseSlug, message: err.message, stack: err.stack })
    );
    return sendNeutralResponse(res);
  }
});

function setCors(req, res) {
  const origin = req.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
}

function sendNeutralResponse(res) {
  return res.status(200).json({
    ok: true,
    message: "If this email has access, we sent a login link.",
  });
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function hashEmail(email) {
  return crypto.createHash("sha256").update(email).digest("hex");
}

function toBase64Url(value) {
  return Buffer.from(String(value), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function isRateLimited(timestampValue) {
  const lastSent = timestampToMillis(timestampValue);
  if (!lastSent) return false;

  const windowMs = RATE_LIMIT_MINUTES * 60 * 1000;
  return Date.now() - lastSent < windowMs;
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value._seconds === "number") return value._seconds * 1000;
  if (typeof value.seconds === "number") return value.seconds * 1000;
  if (typeof value === "number") return value;
  return 0;
}

async function recordAccessEvent(event) {
  try {
    await firestore.collection("course_access_events").add({
      ...event,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("ACCESS_EVENT_LOG_FAIL", JSON.stringify({ message: err.message, type: event.type }));
  }
}
