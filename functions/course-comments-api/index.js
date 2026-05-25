const functions = require("@google-cloud/functions-framework");
const crypto = require("crypto");
const { Firestore, FieldValue } = require("@google-cloud/firestore");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const SITE_ORIGIN = process.env.SITE_ORIGIN || "https://www.bitcamp.ge";
const MODERATOR_CHAT_IDS = (
  process.env.MODERATOR_TELEGRAM_CHAT_IDS ||
  process.env.ALLOWED_TELEGRAM_USER_IDS ||
  ""
)
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ||
  "https://www.bitcamp.ge,http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const firestore = new Firestore();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,80}$/;
const MAX_COMMENT_LENGTH = 2000;
const MIN_SECONDS_BETWEEN_COMMENTS = Number(process.env.MIN_SECONDS_BETWEEN_COMMENTS || 20);

functions.http("courseCommentsApi", async (req, res) => {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method === "GET") {
    return handleListComments(req, res);
  }

  if (req.method === "POST") {
    return handleCreateComment(req, res);
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
});

async function handleListComments(req, res) {
  const lesson = parseLessonParams(req.query || {});
  if (!lesson) {
    return res.status(400).json({ ok: false, error: "Invalid lesson" });
  }

  const summaryRef = firestore.collection("lesson_comment_summaries").doc(lesson.lessonHash);
  const summarySnap = await summaryRef.get();
  const approvedComments = normalizeCommentList(summarySnap.exists ? summarySnap.data()?.approvedComments : []);

  const authorEmail = normalizeEmail(req.query.authorEmail);
  let ownComments = [];

  if (EMAIL_RE.test(authorEmail) && (await hasCourseAccess(authorEmail, lesson.courseSlug))) {
    const authorEmailHash = hash(authorEmail);
    const ownRef = firestore
      .collection("lesson_comment_user_views")
      .doc(hash(`${lesson.lessonHash}|${authorEmailHash}`));
    const ownSnap = await ownRef.get();
    ownComments = normalizeCommentList(ownSnap.exists ? ownSnap.data()?.comments : []);
  }

  return res.status(200).json({
    ok: true,
    approvedComments,
    ownComments,
  });
}

async function handleCreateComment(req, res) {
  const body = req.body || {};
  const lesson = parseLessonParams(body);
  const authorEmail = normalizeEmail(body.authorEmail);
  const text = normalizeCommentText(body.text);

  if (!lesson || !EMAIL_RE.test(authorEmail) || !text) {
    return res.status(400).json({ ok: false, error: "Invalid comment" });
  }

  if (text.length > MAX_COMMENT_LENGTH) {
    return res.status(400).json({ ok: false, error: "Comment is too long" });
  }

  if (!(await hasCourseAccess(authorEmail, lesson.courseSlug))) {
    console.warn("COMMENT_ACCESS_DENIED", JSON.stringify({ lessonKey: lesson.lessonKey, emailHash: hash(authorEmail) }));
    return res.status(403).json({ ok: false, error: "No course access" });
  }

  const authorEmailHash = hash(authorEmail);
  const rateLimitRef = firestore
    .collection("lesson_comment_rate_limits")
    .doc(hash(`${lesson.lessonHash}|${authorEmailHash}`));
  const rateLimitSnap = await rateLimitRef.get();
  const lastCommentAt = timestampToMillis(rateLimitSnap.exists ? rateLimitSnap.data()?.lastCommentAt : null);
  if (lastCommentAt && Date.now() - lastCommentAt < MIN_SECONDS_BETWEEN_COMMENTS * 1000) {
    return res.status(429).json({ ok: false, error: "Please wait before commenting again" });
  }

  const nowIso = new Date().toISOString();
  const authorEmailMasked = maskEmail(authorEmail);
  const commentRef = firestore.collection("lesson_comments").doc();
  const comment = {
    id: commentRef.id,
    lessonHash: lesson.lessonHash,
    lessonKey: lesson.lessonKey,
    courseSlug: lesson.courseSlug,
    topicSlug: lesson.topicSlug,
    lessonSlug: lesson.lessonSlug,
    courseTitle: cleanLabel(body.courseTitle) || lesson.courseSlug,
    lessonTitle: cleanLabel(body.lessonTitle) || lesson.lessonSlug,
    authorEmail,
    authorEmailHash,
    authorEmailMasked,
    text,
    status: "pending",
    createdAtIso: nowIso,
  };

  const userViewRef = firestore
    .collection("lesson_comment_user_views")
    .doc(hash(`${lesson.lessonHash}|${authorEmailHash}`));

  await firestore.runTransaction(async (transaction) => {
    transaction.set(commentRef, {
      ...comment,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    transaction.set(
      userViewRef,
      {
        lessonHash: lesson.lessonHash,
        lessonKey: lesson.lessonKey,
        authorEmailHash,
        comments: FieldValue.arrayUnion(toDisplayComment(comment)),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    transaction.set(
      rateLimitRef,
      {
        lastCommentAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await notifyModerators(comment);

  return res.status(200).json({
    ok: true,
    comment: toDisplayComment(comment),
  });
}

function parseLessonParams(input) {
  const courseSlug = String(input.courseSlug || "").trim();
  const topicSlug = String(input.topicSlug || "").trim();
  const lessonSlug = String(input.lessonSlug || "").trim();

  if (!SLUG_RE.test(courseSlug) || !SLUG_RE.test(topicSlug) || !SLUG_RE.test(lessonSlug)) {
    return null;
  }

  const lessonKey = `${courseSlug}/${topicSlug}/${lessonSlug}`;
  return {
    courseSlug,
    topicSlug,
    lessonSlug,
    lessonKey,
    lessonHash: hash(lessonKey),
  };
}

async function hasCourseAccess(email, courseSlug) {
  const snap = await firestore.collection("course_access").doc(hash(email)).get();
  if (!snap.exists) return false;
  return snap.data()?.courses?.[courseSlug]?.status === "active";
}

async function notifyModerators(comment) {
  if (!TELEGRAM_BOT_TOKEN || MODERATOR_CHAT_IDS.length === 0) {
    console.warn("COMMENT_TELEGRAM_NOT_CONFIGURED", comment.id);
    return;
  }

  const lessonUrl = `${SITE_ORIGIN}/learn/${comment.courseSlug}/${comment.topicSlug}/${comment.lessonSlug}`;
  const text =
    `<b>New lesson comment</b>\n\n` +
    `Course: <b>${escapeHtml(comment.courseTitle)}</b>\n` +
    `Lesson: <a href="${lessonUrl}">${escapeHtml(comment.lessonTitle)}</a>\n` +
    `Student: <code>${escapeHtml(comment.authorEmail)}</code>\n` +
    `Comment ID: <code>${escapeHtml(comment.id)}</code>\n\n` +
    `<b>Comment:</b>\n${escapeHtml(truncate(comment.text, 2800))}`;

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: "Approve", callback_data: `comment:approve:${comment.id}` },
        { text: "Decline", callback_data: `comment:decline:${comment.id}` },
      ],
    ],
  };

  await Promise.all(
    MODERATOR_CHAT_IDS.map((chatId) =>
      sendTelegramMessage(chatId, text, replyMarkup).catch((err) => {
        console.error("COMMENT_TG_NOTIFY_FAIL", JSON.stringify({ commentId: comment.id, chatId, message: err.message }));
      })
    )
  );
}

async function sendTelegramMessage(chatId, text, replyMarkup) {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: replyMarkup,
    }),
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }
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

function toDisplayComment(comment) {
  return {
    id: comment.id,
    text: comment.text,
    authorEmailMasked: comment.authorEmailMasked,
    createdAt: comment.createdAtIso,
  };
}

function normalizeCommentList(value) {
  return Array.isArray(value)
    ? value
        .filter((comment) => comment && comment.id && comment.text)
        .map((comment) => ({
          id: String(comment.id),
          text: String(comment.text),
          authorEmailMasked: String(comment.authorEmailMasked || "სტუდენტი"),
          createdAt: String(comment.createdAt || comment.createdAtIso || ""),
        }))
    : [];
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeCommentText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .trim()
    .replace(/\n{4,}/g, "\n\n\n");
}

function cleanLabel(value) {
  return String(value || "").trim().slice(0, 160);
}

function maskEmail(email) {
  const [name, domain] = String(email).split("@");
  if (!name || !domain) return "სტუდენტი";
  return name;
}

function timestampToMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value._seconds === "number") return value._seconds * 1000;
  if (typeof value.seconds === "number") return value.seconds * 1000;
  if (typeof value === "number") return value;
  return 0;
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function truncate(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}
