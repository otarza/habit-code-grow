const functions = require("@google-cloud/functions-framework");
const crypto = require("crypto");
const { Firestore, FieldValue } = require("@google-cloud/firestore");
const postmark = require("postmark");

const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN;
const FROM_EMAIL = process.env.FROM_EMAIL || "BitCamp <hello@bitcamp.ge>";
const MESSAGE_STREAM = process.env.POSTMARK_STREAM || "outbound";
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://www.bitcamp.ge";
const PDF_PUBLIC_PATH = process.env.PDF_PUBLIC_PATH || "/resources/teacher-ai-guide-placeholder.pdf";
const MASTERCLASS_CONFIRM_PATH =
  process.env.MASTERCLASS_CONFIRM_PATH || "/teachers-ai-masterclass/confirmed";
const MASTERCLASS_TITLE = "AI მასტერკლასი მასწავლებლებისთვის";
const MASTERCLASS_DATE_LABEL = "შაბათი, 6 ივნისი, 2026";
const MASTERCLASS_TIME_LABEL = "13:00 - 14:30 (საქართველოს დრო)";
const MASTERCLASS_PLATFORM_LABEL = "ონლაინ შეხვედრა";
const MASTERCLASS_START_UTC = "20260606T090000Z";
const MASTERCLASS_END_UTC = "20260606T103000Z";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://www.bitcamp.ge,https://bitcamp.ge,http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PHONE_DIGITS = 9;
const MAX_PHONE_DIGITS = 15;
const LEADS_COLLECTION = "teacher_guide_leads";
const EVENTS_COLLECTION = "teacher_guide_events";

const firestore = new Firestore();
const postmarkClient = POSTMARK_TOKEN ? new postmark.ServerClient(POSTMARK_TOKEN) : null;

functions.http("teacherGuideApi", async (req, res) => {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  const action = getAction(req);

  try {
    if (req.method === "POST" && action === "lead") {
      return handleLead(req, res);
    }

    if (req.method === "POST" && action === "masterclass-details") {
      return handleMasterclassDetails(req, res);
    }

    if (req.method === "GET" && action === "registration") {
      return handleRegistrationLookup(req, res);
    }

    if (req.method === "GET" && action === "calendar") {
      return handleCalendarDownload(req, res);
    }

    if (req.method === "GET" && action === "download") {
      return handleTrackedRedirect(req, res, {
        eventType: "pdf_clicked",
        update: {
          pdfClickCount: FieldValue.increment(1),
          lastPdfClickedAt: FieldValue.serverTimestamp(),
        },
        redirectPath: PDF_PUBLIC_PATH,
      });
    }

    if (req.method === "GET" && action === "masterclass") {
      return handleMasterclassRegistration(req, res);
    }

    if (req.method === "GET") {
      return res.status(200).json({ ok: true, service: "teacher-guide-api" });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (err) {
    console.error("TEACHER_GUIDE_API_FAIL", JSON.stringify({ action, message: err.message, stack: err.stack }));
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
});

async function handleLead(req, res) {
  const body = req.body || {};
  const email = normalizeEmail(body.email);

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "Invalid email" });
  }

  if (!postmarkClient) {
    console.error("MISSING_POSTMARK_SERVER_TOKEN", JSON.stringify({ emailHash: hash(email) }));
    return res.status(500).json({ ok: false, error: "Email service is not configured" });
  }

  const token = createToken();
  const tokenHash = hash(token);
  const emailHash = hash(email);
  const leadRef = firestore.collection(LEADS_COLLECTION).doc(emailHash);
  const source = cleanString(body.source) || "teacher-ai-guide-page";
  const utm = {
    utmSource: cleanString(body.utmSource),
    utmMedium: cleanString(body.utmMedium),
    utmCampaign: cleanString(body.utmCampaign),
    fbclid: cleanString(body.fbclid),
  };

  await firestore.runTransaction(async (tx) => {
    const existing = await tx.get(leadRef);
    const payload = {
      email,
      emailNormalized: email,
      emailHash,
      tokenHash,
      source,
      ...utm,
      status: "lead",
      updatedAt: FieldValue.serverTimestamp(),
      lastSubmittedAt: FieldValue.serverTimestamp(),
      submitCount: FieldValue.increment(1),
    };

    if (!existing.exists) {
      payload.firstSubmittedAt = FieldValue.serverTimestamp();
      payload.masterclassStatus = "not_registered";
    }

    tx.set(leadRef, payload, { merge: true });
  });

  await recordEvent({
    emailHash,
    type: "lead_created",
    metadata: {
      source,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
      hasFbclid: Boolean(utm.fbclid),
    },
  });

  const downloadUrl = buildFunctionUrl("download", token);
  const masterclassUrl = buildFunctionUrl("masterclass", token);

  try {
    const result = await postmarkClient.sendEmail({
      From: FROM_EMAIL,
      To: email,
      Subject: "შენი უფასო AI გზამკვლევი მასწავლებლებისთვის | BitCamp",
      HtmlBody: buildEmailHtml({ downloadUrl, masterclassUrl }),
      TextBody: buildEmailText({ downloadUrl, masterclassUrl }),
      MessageStream: MESSAGE_STREAM,
      TrackOpens: true,
      TrackLinks: "HtmlAndText",
    });

    await leadRef.set(
      {
        emailSentAt: FieldValue.serverTimestamp(),
        postmarkMessageId: result.MessageID || "",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await recordEvent({
      emailHash,
      type: "email_sent",
      metadata: { messageId: result.MessageID || "" },
    });

    console.log("TEACHER_GUIDE_EMAIL_SENT", JSON.stringify({ emailHash, messageId: result.MessageID }));
  } catch (err) {
    await recordEvent({
      emailHash,
      type: "email_failed",
      metadata: { message: err.message, code: err.code || "", statusCode: err.statusCode || "" },
    });

    console.error(
      "TEACHER_GUIDE_EMAIL_FAIL",
      JSON.stringify({ emailHash, message: err.message, code: err.code, statusCode: err.statusCode })
    );
    return res.status(502).json({ ok: false, error: "Email failed" });
  }

  return res.status(200).json({ ok: true });
}

async function handleMasterclassDetails(req, res) {
  const body = req.body || {};
  const token = cleanString(body.token);
  if (!token) {
    return res.status(400).json({ ok: false, error: "Missing token" });
  }

  const leadRecord = await findLeadByToken(token);
  if (!leadRecord) {
    return res.status(404).json({ ok: false, error: "Registration not found" });
  }

  const name = cleanString(body.name).slice(0, 120);
  const teachingSubject = cleanString(body.subject).slice(0, 160);
  const phone = normalizePhone(body.phone);

  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ ok: false, error: "Invalid phone" });
  }

  const doc = leadRecord.doc;
  const lead = doc.data() || {};
  const emailHash = lead.emailHash || doc.id;

  await doc.ref.set(
    {
      name,
      teachingSubject,
      phone,
      masterclassDetailsSubmittedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await recordEvent({
    emailHash,
    type: "masterclass_details_submitted",
    metadata: {
      hasName: Boolean(name),
      hasPhone: Boolean(phone),
      hasSubject: Boolean(teachingSubject),
    },
  });

  return res.status(200).json({ ok: true });
}

async function handleRegistrationLookup(req, res) {
  const token = cleanString(req.query.token);
  if (!token) {
    return res.status(400).json({ ok: false, error: "Missing token" });
  }

  const leadRecord = await findLeadByToken(token);
  if (!leadRecord) {
    return res.status(404).json({ ok: false, error: "Registration not found" });
  }

  const lead = leadRecord.data;
  return res.status(200).json({
    ok: true,
    email: lead.email || "",
    masterclassStatus: lead.masterclassStatus || "registered",
    event: getMasterclassEventModel(),
  });
}

async function handleCalendarDownload(req, res) {
  const token = cleanString(req.query.token);
  if (!token) {
    return res.status(400).send("Missing token");
  }

  const leadRecord = await findLeadByToken(token);
  if (!leadRecord) {
    return res.status(404).send("Registration not found");
  }

  const ics = buildCalendarIcs(leadRecord.data.email || "");
  res.set("Content-Type", "text/calendar; charset=utf-8");
  res.set("Content-Disposition", 'attachment; filename="bitcamp-teacher-ai-masterclass.ics"');
  return res.status(200).send(ics);
}

async function handleMasterclassRegistration(req, res) {
  const token = cleanString(req.query.token);
  if (!token) {
    return redirectToGuide(res, "missing-token");
  }

  const leadRecord = await findLeadByToken(token);
  if (!leadRecord) {
    return redirectToGuide(res, "invalid-token");
  }

  const { doc, data: lead } = leadRecord;
  const emailHash = lead.emailHash || doc.id;
  const calendarUrl = buildFunctionUrl("calendar", token);
  const confirmationUrl = new URL(MASTERCLASS_CONFIRM_PATH, SITE_ORIGIN);
  confirmationUrl.searchParams.set("token", token);

  await doc.ref.set(
    {
      masterclassStatus: "registered",
      masterclassRegisteredAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await recordEvent({
    emailHash,
    type: "masterclass_registered",
    metadata: {
      userAgent: req.get("user-agent") || "",
      referer: req.get("referer") || "",
    },
  });

  if (!lead.masterclassConfirmationEmailSentAt && postmarkClient && lead.email) {
    try {
      const result = await postmarkClient.sendEmail({
        From: FROM_EMAIL,
        To: lead.email,
        Subject: "მასტერკლასზე რეგისტრაცია დადასტურდა | BitCamp",
        HtmlBody: buildMasterclassConfirmationHtml({
          email: lead.email,
          calendarUrl,
          confirmationUrl: confirmationUrl.toString(),
        }),
        TextBody: buildMasterclassConfirmationText({
          email: lead.email,
          calendarUrl,
          confirmationUrl: confirmationUrl.toString(),
        }),
        MessageStream: MESSAGE_STREAM,
        TrackOpens: true,
        TrackLinks: "HtmlAndText",
      });

      await doc.ref.set(
        {
          masterclassConfirmationEmailSentAt: FieldValue.serverTimestamp(),
          masterclassConfirmationMessageId: result.MessageID || "",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      await recordEvent({
        emailHash,
        type: "masterclass_confirmation_email_sent",
        metadata: { messageId: result.MessageID || "" },
      });
    } catch (err) {
      console.error("MASTERCLASS_CONFIRMATION_EMAIL_FAIL", JSON.stringify({ emailHash, message: err.message }));
      await recordEvent({
        emailHash,
        type: "masterclass_confirmation_email_failed",
        metadata: { message: err.message, code: err.code || "", statusCode: err.statusCode || "" },
      });
    }
  }

  return res.redirect(302, confirmationUrl.toString());
}

async function handleTrackedRedirect(req, res, { eventType, update, redirectPath, includeTokenInRedirect = false }) {
  const token = cleanString(req.query.token);
  if (!token) {
    return redirectToGuide(res, "missing-token");
  }

  const tokenHash = hash(token);
  const snapshot = await firestore.collection(LEADS_COLLECTION).where("tokenHash", "==", tokenHash).limit(1).get();

  if (snapshot.empty) {
    return redirectToGuide(res, "invalid-token");
  }

  const doc = snapshot.docs[0];
  const lead = doc.data() || {};
  const emailHash = lead.emailHash || doc.id;

  await doc.ref.set(
    {
      ...update,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await recordEvent({
    emailHash,
    type: eventType,
    metadata: {
      userAgent: req.get("user-agent") || "",
      referer: req.get("referer") || "",
    },
  });

  const url = new URL(redirectPath, SITE_ORIGIN);
  if (includeTokenInRedirect) {
    url.searchParams.set("token", token);
  }

  return res.redirect(302, url.toString());
}

function getAction(req) {
  if (req.query && req.query.action) return String(req.query.action).trim().toLowerCase();

  const pathParts = String(req.path || req.url || "")
    .split("?")[0]
    .split("/")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

  return (
    pathParts.find((part) =>
      ["lead", "download", "masterclass", "masterclass-details", "registration", "calendar"].includes(part)
    ) || ""
  );
}

function buildFunctionUrl(action, token) {
  const baseUrl = getFunctionBaseUrl();
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/${action}`);
  url.searchParams.set("token", token);
  return url.toString();
}

function getFunctionBaseUrl() {
  return process.env.FUNCTION_PUBLIC_URL || `${SITE_ORIGIN}/api/teacher-guide`;
}

function setCors(req, res) {
  const origin = req.get("origin");
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
}

function redirectToGuide(res, reason) {
  const url = new URL("/teachers-ai-guide", SITE_ORIGIN);
  url.searchParams.set("status", reason);
  return res.redirect(302, url.toString());
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  return String(value || "").trim().replace(/[^\d+]/g, "");
}

function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS;
}

function cleanString(value) {
  return String(value || "").trim().slice(0, 500);
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function createToken() {
  return crypto.randomBytes(32).toString("base64url");
}

async function findLeadByToken(token) {
  const tokenHash = hash(token);
  const snapshot = await firestore.collection(LEADS_COLLECTION).where("tokenHash", "==", tokenHash).limit(1).get();
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { doc, data: doc.data() || {} };
}

function getMasterclassEventModel() {
  return {
    title: MASTERCLASS_TITLE,
    date: MASTERCLASS_DATE_LABEL,
    time: MASTERCLASS_TIME_LABEL,
    platform: MASTERCLASS_PLATFORM_LABEL,
    startUtc: MASTERCLASS_START_UTC,
    endUtc: MASTERCLASS_END_UTC,
  };
}

async function recordEvent(event) {
  try {
    await firestore.collection(EVENTS_COLLECTION).add({
      ...event,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error("TEACHER_GUIDE_EVENT_LOG_FAIL", JSON.stringify({ type: event.type, message: err.message }));
  }
}

function buildMasterclassConfirmationHtml({ email, calendarUrl, confirmationUrl }) {
  const event = getMasterclassEventModel();
  return `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>მასტერკლასზე რეგისტრაცია დადასტურდა</title>
</head>
<body style="margin:0;padding:0;background:#05091d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#fff4e8;line-height:1.6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#05091d;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#071025;border:1px solid #293a52;">
          <tr>
            <td style="padding:28px;border-top:6px solid #df3342;">
              <p style="margin:0;color:#fff4e8;font-size:24px;font-weight:900;letter-spacing:2px;">BITCAMP</p>
              <p style="margin:8px 0 0 0;color:#ffb3ad;font-size:12px;font-weight:700;text-transform:uppercase;">რეგისტრაცია დადასტურდა</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 8px 28px;">
              <h1 style="margin:0 0 12px 0;color:#fff4e8;font-size:25px;line-height:1.3;font-weight:900;">${event.title}</h1>
              <p style="margin:0;color:#c7d3df;font-size:16px;">რეგისტრაცია დადასტურდა თქვენს მისამართზე: <strong style="color:#fff4e8;">${escapeHtml(email)}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #293a52;background:#05091d;">
                <tr>
                  <td style="padding:18px;color:#c7d3df;font-size:15px;">
                    <p style="margin:0 0 6px 0;"><strong style="color:#fff4e8;">თარიღი:</strong> ${event.date}</p>
                    <p style="margin:0 0 6px 0;"><strong style="color:#fff4e8;">დრო:</strong> ${event.time}</p>
                    <p style="margin:0;"><strong style="color:#fff4e8;">ფორმატი:</strong> ${event.platform}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:4px 28px 28px 28px;">
              <a href="${calendarUrl}" style="display:inline-block;background:#df3342;color:#fff4e8;text-decoration:none;font-size:15px;font-weight:900;padding:12px 18px;margin:0 8px 10px 0;">Add to calendar</a>
              <a href="${confirmationUrl}" style="display:inline-block;background:#fff4e8;color:#05091d;text-decoration:none;font-size:15px;font-weight:900;padding:12px 18px;margin:0 0 10px 0;">დეტალების დამატება</a>
              <p style="margin:14px 0 0 0;color:#9fb0c3;font-size:14px;">დასწრების ბმულს ცალკე ელფოსტით მიიღებთ მასტერკლასამდე.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildMasterclassConfirmationText({ email, calendarUrl, confirmationUrl }) {
  const event = getMasterclassEventModel();
  return `${event.title}

რეგისტრაცია დადასტურდა თქვენს მისამართზე: ${email}

თარიღი: ${event.date}
დრო: ${event.time}
ფორმატი: ${event.platform}

Add to calendar:
${calendarUrl}

დეტალების დამატება:
${confirmationUrl}`;
}

function buildCalendarIcs(email) {
  const uid = `teacher-ai-masterclass-20260606-${hash(email || "guest").slice(0, 12)}@bitcamp.ge`;
  const description = "BitCamp-ის უფასო AI მასტერკლასი მასწავლებლებისთვის.";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BitCamp//Teacher AI Masterclass//KA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${MASTERCLASS_START_UTC}`,
    `DTEND:${MASTERCLASS_END_UTC}`,
    `SUMMARY:${escapeIcsText(MASTERCLASS_TITLE)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(MASTERCLASS_PLATFORM_LABEL)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function formatIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml({ downloadUrl, masterclassUrl }) {
  return `<!DOCTYPE html>
<html lang="ka">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI გზამკვლევი მასწავლებლებისთვის</title>
</head>
<body style="margin:0;padding:0;background:#05091d;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#fff4e8;line-height:1.6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#05091d;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;width:100%;background:#071025;border:1px solid #293a52;">
          <tr>
            <td style="padding:28px 28px 16px 28px;border-top:6px solid #df3342;">
              <p style="margin:0;color:#fff4e8;font-size:24px;font-weight:900;letter-spacing:2px;">BITCAMP</p>
              <p style="margin:8px 0 0 0;color:#ffb3ad;font-size:12px;font-weight:700;text-transform:uppercase;">უფასო გზამკვლევი მასწავლებლებისთვის</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px 28px;">
              <h1 style="margin:0 0 14px 0;color:#fff4e8;font-size:27px;line-height:1.25;font-weight:900;">გადატვირთული მასწავლებლიდან AI-ით აღჭურვილ პროფესიონალამდე</h1>
              <p style="margin:0;color:#c7d3df;font-size:16px;">მადლობა ინტერესისთვის. ქვემოთ არის შენი პერსონალური ჩამოსატვირთი ბმული. PDF არ არის მიმაგრებული ფაილად, რომ ჩამოტვირთვები სწორად დავითვალოთ.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 28px;">
              <a href="${downloadUrl}" style="display:block;background:#df3342;color:#fff4e8;text-decoration:none;text-align:center;font-size:16px;font-weight:900;padding:15px 18px;">ჩამოტვირთე PDF გზამკვლევი</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 8px 28px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border:1px solid #293a52;background:#05091d;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px 0;color:#ffb3ad;font-size:12px;font-weight:700;text-transform:uppercase;">შემდეგი ნაბიჯი</p>
                    <h2 style="margin:0 0 10px 0;color:#fff4e8;font-size:20px;line-height:1.3;">უფასო AI მასტერკლასი მასწავლებლებისთვის</h2>
                    <p style="margin:0 0 10px 0;color:#c7d3df;font-size:15px;"><strong style="color:#fff4e8;">შაბათი, 6 ივნისი, 2026 · 13:00</strong> საქართველოს დროით.</p>
                    <p style="margin:0 0 18px 0;color:#c7d3df;font-size:15px;">მასტერკლასზე ვაჩვენებთ პრაქტიკულ მაგალითებს: გაკვეთილის გეგმა, შეფასების რუბრიკა, უკუკავშირი და ინდივიდუალური მასალები AI-ს დახმარებით.</p>
                    <a href="${masterclassUrl}" style="display:inline-block;background:#fff4e8;color:#05091d;text-decoration:none;font-size:15px;font-weight:900;padding:12px 18px;">დამარეგისტრირე მასტერკლასზე</a>
                    <p style="margin:12px 0 0 0;color:#9fb0c3;font-size:13px;">ეს ბმული შენთვისაა. კლიკი ავტომატურად დაგარეგისტრირებს, შემდეგ კი სურვილისამებრ შეგიძლია დაამატო სახელი, ტელეფონი და საგანი.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px 28px;">
              <p style="margin:0;color:#9fb0c3;font-size:14px;">კითხვები? უპასუხე ამ წერილს ან მოგვწერე <a href="mailto:hello@bitcamp.ge" style="color:#ffb3ad;">hello@bitcamp.ge</a>.</p>
              <p style="margin:16px 0 0 0;color:#c7d3df;font-size:14px;">წარმატებას გისურვებ,<br><strong>BitCamp</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText({ downloadUrl, masterclassUrl }) {
  return `BitCamp

შენი უფასო AI გზამკვლევი მასწავლებლებისთვის:
${downloadUrl}

უფასო AI მასტერკლასზე ერთი კლიკით რეგისტრაცია:
${masterclassUrl}

მასტერკლასი გაიმართება შაბათს, 6 ივნისს, 2026, 13:00-ზე საქართველოს დროით.

კითხვები? მოგვწერე hello@bitcamp.ge`;
}
