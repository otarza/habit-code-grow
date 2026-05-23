#!/usr/bin/env node
/**
 * Invite someone to a course without a payment.
 * Sends the SAME welcome email a paying customer gets — with a working
 * Magic Link — but flags the order_id as INVITE_* so it's distinguishable
 * in Postmark Activity.
 *
 * Run:
 *   POSTMARK_TOKEN=<token> node scripts/invite-to-course.js \
 *     --email friend@example.com \
 *     [--course bootcamp|pro]    (default: bootcamp)
 *     [--note "VIP gift"]        (optional label, suffixed to order_id)
 *     [--dry-run]                (preview without sending)
 */

import postmark from "postmark";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const FROM = "BitCamp <oto@bitcamp.ge>";
const MESSAGE_STREAM = "flitt-payments-transactional";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PROJECT_ID = "bitcamp-flitt";

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

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { course: "bootcamp", project: DEFAULT_PROJECT_ID, dryRun: false, skipEmail: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email") out.email = args[++i];
    else if (args[i] === "--course") out.course = args[++i];
    else if (args[i] === "--note") out.note = args[++i];
    else if (args[i] === "--project") out.project = args[++i];
    else if (args[i] === "--dry-run") out.dryRun = true;
    else if (args[i] === "--skip-email") out.skipEmail = true;
  }
  return out;
}

function usageAndExit(msg) {
  if (msg) console.error(`error: ${msg}\n`);
  console.error(`Usage:
  POSTMARK_TOKEN=<token> node scripts/invite-to-course.js \\
    --email <email>            (required)
    [--course bootcamp|pro]    (default: bootcamp)
    [--note "<short label>"]   (suffixed to order_id, e.g. "VIP gift")
    [--project bitcamp-flitt]  (Firestore project)
    [--skip-email]             (grant access without sending Postmark email)
    [--dry-run]                (preview without sending)

Examples:
  node scripts/invite-to-course.js --email friend@example.com
  node scripts/invite-to-course.js --email vip@x.com --course pro --note "speaker comp"
`);
  process.exit(1);
}

function toBase64Url(value) {
  return Buffer.from(String(value), "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function hashEmail(email) {
  return crypto.createHash("sha256").update(email).digest("hex");
}

async function upsertCourseAccessWithGcloudToken({ project, email, courseSlug, metadata }) {
  const token = execFileSync("gcloud", ["auth", "print-access-token"], { encoding: "utf8" }).trim();
  const emailHash = hashEmail(email);
  const now = new Date().toISOString();
  const quotedCoursePath = `courses.${String.fromCharCode(96)}${courseSlug}${String.fromCharCode(96)}`;
  const updateMask = [
    "email",
    "emailNormalized",
    "updatedAt",
    `${quotedCoursePath}.status`,
    `${quotedCoursePath}.source`,
    `${quotedCoursePath}.grantedAt`,
    `${quotedCoursePath}.updatedAt`,
  ];

  for (const key of Object.keys(metadata)) {
    updateMask.push(`${quotedCoursePath}.${key}`);
  }

  const params = new URLSearchParams();
  for (const fieldPath of updateMask) {
    params.append("updateMask.fieldPaths", fieldPath);
  }

  const metadataFields = Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => [key, { stringValue: String(value ?? "") }])
  );

  const body = {
    fields: {
      email: { stringValue: email },
      emailNormalized: { stringValue: email },
      updatedAt: { timestampValue: now },
      courses: {
        mapValue: {
          fields: {
            [courseSlug]: {
              mapValue: {
                fields: {
                  status: { stringValue: "active" },
                  source: { stringValue: "manual_invite_script" },
                  grantedAt: { timestampValue: now },
                  updatedAt: { timestampValue: now },
                  ...metadataFields,
                },
              },
            },
          },
        },
      },
    },
  };

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/course_access/${emailHash}?${params.toString()}`,
    {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firestore REST upsert failed: ${response.status} ${text}`);
  }
}

async function main() {
  const opts = parseArgs();
  const token = process.env.POSTMARK_TOKEN;

  if (!opts.skipEmail && !opts.dryRun && !token) usageAndExit("POSTMARK_TOKEN env var not set");
  if (!opts.email) usageAndExit("--email required");

  const email = opts.email.toLowerCase().trim();
  if (!EMAIL_RE.test(email)) usageAndExit(`invalid email: ${email}`);

  const course = COURSES[opts.course];
  if (!course) usageAndExit(`unknown course: '${opts.course}' (use 'bootcamp' or 'pro')`);

  const noteSlug = opts.note ? `_${opts.note.replace(/[^a-zA-Z0-9_-]+/g, "_")}` : "";
  const orderId = `INVITE_${Date.now()}${noteSlug}`;
  const base64Email = toBase64Url(email);
  const magicLink = `https://www.bitcamp.ge/learn/${course.slug}?access=${base64Email}`;

  console.log(`\n${"─".repeat(56)}`);
  console.log(`Inviting:    ${email}`);
  console.log(`Course:      ${course.name}  (template: ${course.template})`);
  console.log(`Project:     ${opts.project}`);
  console.log(`Order ID:    ${orderId}`);
  console.log(`Magic link:  ${magicLink}`);
  console.log(`Email:       ${opts.skipEmail ? "skip" : "send"}`);
  console.log(`${"─".repeat(56)}\n`);

  if (opts.dryRun) {
    console.log("DRY RUN — Firestore not written and email not sent.");
    return;
  }

  const entitlementMetadata = {
    order_id: orderId,
    orderId,
    note: opts.note || "",
  };

  await upsertCourseAccessWithGcloudToken({
    project: opts.project,
    email,
    courseSlug: course.slug,
    metadata: entitlementMetadata,
  });
  console.log(`✓ Granted ${course.slug} access in Firestore`);

  if (opts.skipEmail) {
    console.log("Email skipped.");
    return;
  }

  const client = new postmark.ServerClient(token);
  const result = await client.sendEmailWithTemplate({
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
      console.error(`FAIL: [${result.ErrorCode}] ${result.Message}`);
      process.exit(1);
    }

  console.log(`✓ Sent to ${email}`);
  console.log(`  MessageID: ${result.MessageID}`);
  console.log(`  Check Postmark Activity to confirm delivery.`);
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
