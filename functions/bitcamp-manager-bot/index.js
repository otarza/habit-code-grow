/**
 * BitCamp Manager — Telegram bot
 *
 * Commands:
 *   /invite <email> [bootcamp|pro] [note]
 *   /help
 *
 * Security:
 *   - Telegram webhook secret_token must match TELEGRAM_WEBHOOK_SECRET env
 *   - message.from.id must be in ALLOWED_TELEGRAM_USER_IDS (comma-separated)
 *
 * Always returns 200 OK to Telegram (even on auth failure) to avoid retry loops.
 */

const functions = require("@google-cloud/functions-framework");
const crypto = require("crypto");
const { Firestore, FieldValue } = require("@google-cloud/firestore");
const postmark = require("postmark");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || "";
const ALLOWED_USER_IDS = (process.env.ALLOWED_TELEGRAM_USER_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const FROM = process.env.FROM_EMAIL || "BitCamp <oto@bitcamp.ge>";
const MESSAGE_STREAM = process.env.POSTMARK_STREAM || "flitt-payments-transactional";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COURSES = {
  bootcamp: {
    slug: "ai-bootcamp",
    template: "course-access-ai-bootcamp",
    name: "AI Bootcamp Self-Paced",
  },
  pro: {
    slug: "ai-pro",
    template: "course-access-ai-pro",
    name: "AI Bootcamp Mentored",
  },
};

const firestore = new Firestore();
const postmarkClient = new postmark.ServerClient(POSTMARK_TOKEN);

functions.http("telegramBot", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("ok");
  }

  // Webhook secret check (Telegram sends this header when registered with secret_token)
  if (WEBHOOK_SECRET) {
    const incoming = req.get("X-Telegram-Bot-Api-Secret-Token") || "";
    if (incoming !== WEBHOOK_SECRET) {
      console.warn("WEBHOOK_SECRET_MISMATCH");
      return res.status(200).send("ok");
    }
  }

  const update = req.body || {};
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
    return res.status(200).send("ok");
  }

  const message = update.message || update.edited_message;
  if (!message || !message.text) {
    return res.status(200).send("ok");
  }

  const fromId = String(message.from?.id || "");
  const fromHandle = message.from?.username || message.from?.first_name || fromId;
  const chatId = message.chat?.id;
  const text = (message.text || "").trim();

  console.log("TG_MSG", JSON.stringify({ fromId, fromHandle, text }));

  // Allow-list check
  if (!ALLOWED_USER_IDS.includes(fromId)) {
    console.warn("UNAUTHORIZED_USER", fromId, fromHandle);
    await sendMessage(
      chatId,
      `🚫 Not authorized.\n\nYour Telegram user ID: <code>${escapeHtml(fromId)}</code>\nGive this to the admin to be added.`
    );
    return res.status(200).send("ok");
  }

  // Strip optional @botname suffix (Telegram appends in groups)
  const cleanText = text.replace(/^(\/[a-z_]+)@\w+/i, "$1");

  if (cleanText.startsWith("/start") || cleanText.startsWith("/help")) {
    await sendMessage(chatId, helpText());
  } else if (cleanText.startsWith("/invite")) {
    await handleInvite(chatId, cleanText);
  } else {
    await sendMessage(chatId, "Unknown command. Try /help");
  }

  return res.status(200).send("ok");
});

async function handleCallbackQuery(callback) {
  const fromId = String(callback.from?.id || "");
  const fromHandle = callback.from?.username || callback.from?.first_name || fromId;
  const data = String(callback.data || "");

  console.log("TG_CALLBACK", JSON.stringify({ fromId, fromHandle, data }));

  if (!ALLOWED_USER_IDS.includes(fromId)) {
    console.warn("UNAUTHORIZED_CALLBACK_USER", fromId, fromHandle);
    await answerCallbackQuery(callback.id, "Not authorized", true);
    return;
  }

  if (data.startsWith("comment:")) {
    await handleCommentModeration(callback, data, fromId);
    return;
  }

  await answerCallbackQuery(callback.id, "Unknown action", true);
}

function helpText() {
  return `<b>BitCamp Manager</b> 🤖

<b>/invite</b> &lt;email&gt; [course] [note]
  Send free course access to anyone.

  <b>Examples:</b>
  <code>/invite friend@example.com</code>
  <code>/invite vip@x.com pro</code>
  <code>/invite speaker@x.com pro speaker comp</code>

  Courses: <code>bootcamp</code> (default) or <code>pro</code>`;
}

async function handleCommentModeration(callback, data, moderatorTelegramId) {
  const [, action, commentId] = data.split(":");
  const isApproval = action === "approve";
  const isDecline = action === "decline";

  if (!commentId || (!isApproval && !isDecline)) {
    await answerCallbackQuery(callback.id, "Invalid moderation action", true);
    return;
  }

  const commentRef = firestore.collection("lesson_comments").doc(commentId);
  const snap = await commentRef.get();
  if (!snap.exists) {
    await answerCallbackQuery(callback.id, "Comment not found", true);
    return;
  }

  const comment = snap.data() || {};
  if (comment.status === "approved" || comment.status === "declined") {
    await answerCallbackQuery(callback.id, `Already ${comment.status}`);
    await editModerationMessage(callback, commentId, comment, comment.status);
    return;
  }

  const nextStatus = isApproval ? "approved" : "declined";
  await commentRef.set(
    {
      status: nextStatus,
      moderatedAt: FieldValue.serverTimestamp(),
      moderatedBy: String(moderatorTelegramId || ""),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  if (isApproval) {
    await publishApprovedComment(commentId, comment);
  }

  console.log("COMMENT_MODERATED", JSON.stringify({ commentId, status: nextStatus, lessonKey: comment.lessonKey }));
  await answerCallbackQuery(callback.id, isApproval ? "Approved" : "Declined");
  await editModerationMessage(callback, commentId, comment, nextStatus);
}

async function publishApprovedComment(commentId, comment) {
  const lessonHash = comment.lessonHash;
  if (!lessonHash) return;

  await firestore
    .collection("lesson_comment_summaries")
    .doc(lessonHash)
    .set(
      {
        lessonHash,
        lessonKey: comment.lessonKey || "",
        courseSlug: comment.courseSlug || "",
        topicSlug: comment.topicSlug || "",
        lessonSlug: comment.lessonSlug || "",
        approvedComments: FieldValue.arrayUnion({
          id: commentId,
          text: String(comment.text || ""),
          authorEmailMasked: String(comment.authorEmailMasked || "სტუდენტი"),
          createdAt: String(comment.createdAtIso || new Date().toISOString()),
        }),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

async function editModerationMessage(callback, commentId, comment, status) {
  const chatId = callback.message?.chat?.id;
  const messageId = callback.message?.message_id;
  if (!chatId || !messageId) return;

  const statusMeta =
    status === "approved"
      ? {
          icon: "✅",
          title: "APPROVED COMMENT",
          label: "Approved and visible to everyone",
        }
      : {
          icon: "❌",
          title: "DECLINED COMMENT",
          label: "Declined and hidden from everyone except the author",
        };
  const lessonUrl =
    comment.courseSlug && comment.topicSlug && comment.lessonSlug
      ? `https://www.bitcamp.ge/learn/${comment.courseSlug}/${comment.topicSlug}/${comment.lessonSlug}`
      : "";
  const lessonLine = lessonUrl
    ? `Lesson: <a href="${lessonUrl}">${escapeHtml(comment.lessonTitle || comment.lessonSlug || "")}</a>\n`
    : `Lesson: ${escapeHtml(comment.lessonTitle || comment.lessonSlug || "")}\n`;

  await editMessageText(
    chatId,
    messageId,
    `${statusMeta.icon} <b>${statusMeta.title}</b>\n` +
      `<b>Status:</b> ${escapeHtml(statusMeta.label)}\n\n` +
      `Course: <b>${escapeHtml(comment.courseTitle || comment.courseSlug || "")}</b>\n` +
      lessonLine +
      `Student: <code>${escapeHtml(comment.authorEmail || "")}</code>\n` +
      `Comment ID: <code>${escapeHtml(commentId)}</code>\n\n` +
      `<b>Comment:</b>\n${escapeHtml(truncate(comment.text || "", 2800))}`
  );
}

async function handleInvite(chatId, text) {
  const parts = text.split(/\s+/).slice(1);
  if (parts.length === 0) {
    return sendMessage(chatId, "Usage:\n<code>/invite &lt;email&gt; [bootcamp|pro] [note]</code>");
  }

  const email = parts[0].toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return sendMessage(chatId, `❌ Invalid email: <code>${escapeHtml(email)}</code>`);
  }

  const courseArg = (parts[1] || "bootcamp").toLowerCase();
  const course = COURSES[courseArg];
  if (!course) {
    return sendMessage(
      chatId,
      `❌ Unknown course: <code>${escapeHtml(courseArg)}</code>\nUse <code>bootcamp</code> or <code>pro</code>`
    );
  }

  const note = parts.slice(2).join(" ");
  const noteSlug = note ? `_${note.replace(/[^a-zA-Z0-9_-]+/g, "_")}` : "";
  const orderId = `INVITE_${Date.now()}${noteSlug}`;
  const base64Email = toBase64Url(email);
  const magicLink = `https://www.bitcamp.ge/learn/${course.slug}?access=${base64Email}`;

  try {
    await upsertCourseAccess({
      email,
      courseSlug: course.slug,
      source: "telegram_invite",
      metadata: {
        orderId,
        note,
        invitedBy: "telegram_bot",
      },
    });

    const result = await postmarkClient.sendEmailWithTemplate({
      From: FROM,
      To: email,
      TemplateAlias: course.template,
      TemplateModel: {
        product_name: course.name,
        order_id: orderId,
        amount: "უფასო",
        currency: "",
        base64_email: base64Email,
      },
      MessageStream: MESSAGE_STREAM,
      TrackOpens: true,
      TrackLinks: "HtmlAndText",
    });

    if (result.ErrorCode && result.ErrorCode !== 0) {
      return sendMessage(
        chatId,
        `❌ Postmark error <code>${result.ErrorCode}</code>: ${escapeHtml(result.Message || "")}`
      );
    }

    console.log("INVITE_SENT", { email, course: course.slug, orderId, messageId: result.MessageID });
    await sendMessage(
      chatId,
      `✅ <b>Invite sent</b>\n\n` +
        `To: <code>${escapeHtml(email)}</code>\n` +
        `Course: <b>${escapeHtml(course.name)}</b>\n` +
        `Access: <b>active</b>\n` +
        `Order: <code>${escapeHtml(orderId)}</code>\n` +
        `Postmark MessageID: <code>${escapeHtml(result.MessageID)}</code>\n\n` +
        `<a href="${magicLink}">Magic link</a> (works the same as a paid customer)`
    );
  } catch (err) {
    console.error("INVITE_FAIL", err);
    await sendMessage(
      chatId,
      `❌ Send failed: ${escapeHtml(err.message || "unknown error")}`
    );
  }
}

async function upsertCourseAccess({ email, courseSlug, source, metadata }) {
  const emailHash = hashEmail(email);
  const docRef = firestore.collection("course_access").doc(emailHash);

  await docRef.set(
    {
      email,
      emailNormalized: email,
      updatedAt: FieldValue.serverTimestamp(),
      courses: {
        [courseSlug]: {
          status: "active",
          source,
          grantedAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
          ...metadata,
        },
      },
    },
    { merge: true }
  );

  await firestore.collection("course_access_events").add({
    emailHash,
    courseSlug,
    type: "telegram_invite",
    createdAt: FieldValue.serverTimestamp(),
    metadata,
  });
}

async function sendMessage(chatId, text) {
  if (!chatId) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error("TG_SEND_NONOK", r.status, body);
    }
  } catch (err) {
    console.error("TG_SEND_FAIL", err);
  }
}

async function answerCallbackQuery(callbackQueryId, text, showAlert = false) {
  if (!callbackQueryId) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error("TG_CALLBACK_ANSWER_NONOK", r.status, body);
    }
  } catch (err) {
    console.error("TG_CALLBACK_ANSWER_FAIL", err);
  }
}

async function editMessageText(chatId, messageId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`;
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: { inline_keyboard: [] },
      }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error("TG_EDIT_NONOK", r.status, body);
    }
  } catch (err) {
    console.error("TG_EDIT_FAIL", err);
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

function truncate(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
